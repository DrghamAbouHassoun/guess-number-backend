import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Round } from "src/schemas/round.schema";
import { RecordDto, RoundDto } from "./round.dto";

@Injectable()
export class RoundService {
  constructor(@InjectModel(Round.name) private roundModel: Model<Round>) {};

  async createRound(newRound: RoundDto) {
    await this.roundModel.create({
      gameId: newRound.gameId,
      multiplierValue: newRound.multiplierValue,
      roundNumber: newRound.roundNumber,
      records: newRound.records,
    })
  }

  async addRecord(roundId: string, record: RecordDto) {
    const round = await this.roundModel.findById(roundId)
    if (!round) {
      throw new HttpException({
        success: false,
        messages: ["Round is not found"],
        data: [],
        status: 404,
      }, 200)
    }
    round.records.push({
      userId: new Types.ObjectId(record.userId),
      biddingPoints: record.biddingPoints,
      prediction: record.prediction,
      username: record.username,
      result: 0,
    })
  }

  async endRound() {}
}