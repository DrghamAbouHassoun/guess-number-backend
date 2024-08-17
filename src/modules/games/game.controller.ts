import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { GameService } from "./game.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("/games")
export class GameController {
  constructor(private gameService: GameService) {};

  @UseGuards(AuthGuard)
  @Post()
  async createGame (@Request() req, @Body() body: { descirption: string }) {
    await this.gameService.createNewGame(req.user, body.descirption);
  }
}