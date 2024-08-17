import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Game, GameSchema } from "src/schemas/game.schema";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { UserModule } from "../users/user.module";
import { GameGateway } from "./game.gateway";
import { WsGuard } from "src/guards/ws.guard";
import { AuthGuard } from "src/guards/auth.guard";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    UserModule,
  ],
  controllers: [GameController],
  providers: [GameService, GameGateway, WsGuard, AuthGuard],
  exports: [],
})
export class GameModule {};