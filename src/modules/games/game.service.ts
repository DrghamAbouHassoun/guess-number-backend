import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Game } from "src/schemas/game.schema";
import { IUser } from "src/types/user";
import { UserService } from "../users/user.service";

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    private userSrevice: UserService,
  ) {}

  async getAllGames () {
    try {
      const games = await this.gameModel.find();
      return games;
    } catch (error) {
      throw new HttpException({
        success: false,
        messages: ["Something went wrong"],
        data: [],
        status: 500,
        error
      }, 200)
    }
  }

  async createNewGame(creator: IUser, description: string) {
    const user = await this.userSrevice.findUserById(creator._id);
    const newGame = await this.gameModel.create({
      createdBy: user._id,
      players: [{ userId: user._id, username: user.name, currentPoints: 0, currentBid: 1 }],
      status: "pending",
      description: description,
    })
    return newGame;
  }

  async findGameById(id: string) {
    return await this.gameModel.findById({ id: id });
  }

  async addPlayer(gameId: string, playerId: string) {
    const game = await this.findGameById(gameId);
    if (game.status !== "pending") {
      throw new HttpException({
        success: false,
        messages: "Game is already started",
        data: [],
        status: 400,
      }, 200)
    }
    const user = await this.userSrevice.findUserByEmail(playerId);
    game.players.push({ userId: user.id, username: user.name, currentPoints: 400, currentBid: 0 });
    return await game.save();
  }

  async changeGameStatus(gameId: string, newState: string) {
    const game = await this.gameModel.findByIdAndUpdate(gameId, {
      status: newState,
    })
    return game;
  }
}