import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { GameService } from "./game.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("/games")
export class GameController {
  constructor(private gameService: GameService) {};

  @UseGuards(AuthGuard)
  @Post("/")
  async createGame (@Request() req, @Body() body: { descirption: string }) {
    const newGame = await this.gameService.createNewGame(req.user, body.descirption);
    return {
      success: true,
      messages: ["Game created"],
      data: newGame,
      status: 201,
    }
  }

  @Get("/")
  async getAllGames() {
    const games = await this.gameService.getAllGames();
    return {
      success: true,
      messages: ["Games fetched"],
      data: games,
      status: 200,
    }
  }
}