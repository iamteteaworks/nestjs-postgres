/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsString,
  ValidateNested,
} from 'class-validator';

class SessionDateDto {
  @IsDateString()
  date: string;
}

export class CreateSessionDto {
  @IsString()
  name: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SessionDateDto)
  dates: SessionDateDto[];
}
