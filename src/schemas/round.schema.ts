import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ timestamps: true })
export class Record {
  @Prop({ type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Prop({ type: String })
  username: string;

  @Prop({ type: Number })
  biddingPoints: number;

  @Prop({ type: Number })
  prediction: number;

  @Prop({ type: Number })
  result: number;
}

export type RoundDocument = HydratedDocument<Round>;

@Schema({ timestamps: true })
export class Round {
  @Prop({ type: Number, default: 1 })
  multiplierValue: number;

  @Prop({ type: Types.ObjectId, ref: "Game" })
  gameId: number;

  @Prop({ type: Number, default: 1 })
  roundNumber: number;

  @Prop({ type: [Record], default: [] })
  records: Record[]

  @Prop({ type: String, enum: ["started", "finished"], default: "started" })
  status: string;
}

export const RoundSchema = SchemaFactory.createForClass(Round)