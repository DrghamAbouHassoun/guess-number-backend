import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Round } from "src/schemas/round.schema";
import { RoundDto } from "./round.dto";

@Injectable()
export class RoundService {
  constructor(@InjectModel(Round.name) private roundModel: Model<Round>) {};

  async createRound(newRound: RoundDto) {
    this.roundModel.create({
      gameId: newRound.gameId,
      multiplierValue: newRound.multiplierValue,
      roundNumber: newRound.roundNumber,
    })
  }
}