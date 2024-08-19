import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { GameService } from "./game.service";
import { Server, Socket } from "socket.io";
import { Logger, UseGuards } from "@nestjs/common";
import { WsGuard } from "src/guards/ws.guard";
import { UserService } from "../users/user.service";
import { JwtService } from "@nestjs/jwt";

interface ExtendedSocket extends Socket {
  user: any;
}

@WebSocketGateway(5001, { cors: ["*"], })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  
  constructor(
    private gameService: GameService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {};

  @WebSocketServer() server: Server;

  @UseGuards(WsGuard)
  async handleConnection(client: ExtendedSocket) {
    const user = client["user"];
    if (user._id) {
      this.userService.changeUserStatus({ userId: user._id, status: true });
      console.log("User status updated: ", user._id);
    }

    console.log("Client connected", user.name);
    this.server.emit("clientConnected", user);
    const pendingGames = await this.gameService.getPendingGames();
    this.server.emit("pendingGames", { games: pendingGames })
  }

  handleDisconnect(client: ExtendedSocket) {
    const user = client["user"];
    if (user._id) {
      this.userService.changeUserStatus({ userId: user._id, status: false });
      console.log("User status updated: ", user._id);
    }
    console.log("Client has disconnected", user._id);
    this.server.emit("clientDisconnected", user);
    console.log("Client Disconnected: ", client.id)
  }

  afterInit(server: Server) {
    server.use((client, next) => {
      try {
        const [type, token] = client.handshake.headers.authorization?.split(" ");
        if (!token || !type) {
          next(new Error("Invalid token"))
        }
        const result = this.jwtService.verify(token, { secret: process.env.JWT_AUTH_TOKEN });
        if (!result) {
          throw new Error("Invalid authentication token");
        }
        client["user"] = result
        next();
      } catch (error) {
        next(error);
      }

    })
    Logger.log("Websocket initialized")
  }

  @SubscribeMessage("joinGame")
  async handleJoinRoom(client: Socket, { gameId }: { gameId: string }) {
    console.log("Join game: ", gameId)
    const game = await this.gameService.addPlayer(gameId, client["user"]._id)
    client.join(gameId);
    console.log(`${client["user"].name} has joined game ${gameId}`)
    client.to(gameId).emit("userJoinedToRoom", `${client.id} has joined game ${gameId}`);
    this.server.emit("updatedGame", { game: game });
  }
}