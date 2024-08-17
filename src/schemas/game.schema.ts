import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type GameDocument = HydratedDocument<Game>;

@Schema({ timestamps: true })
export class Player {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: String })
  username: string;

  @Prop({ type: Number, default: 1 })
  currentBid: number;

  @Prop({ type: Number, default: 400 })
  currentPoints: number;
}

@Schema({ timestamps: true })
export class Game {
  @Prop({ type: [Player], default: [] })
  players: Player[]

  @Prop({ type: String, enum: ["pending", "running", "ended"], default: "pending" })
  status: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: Types.ObjectId;
}

export const GameSchema = SchemaFactory.createForClass(Game);