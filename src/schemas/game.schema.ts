import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.schema";

export type GameDocument = HydratedDocument<Game>;

@Schema({ timestamps: true })
export class Game {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Post' }] })
  users: User[]
}

export const GameSchema = SchemaFactory.createForClass(Game);