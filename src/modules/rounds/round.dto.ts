import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from "class-validator";

export class RecordDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsNumber()
  biddingPoints: number;

  @IsNumber()
  prediction: number;

  @IsString()
  username: string;
}

export class RoundDto {
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(9)
  multiplierValue: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  roundNumber: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RecordDto)
  records: RecordDto[];
}