/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateWorkoutDayDto } from './create-workout-day.dto';

export class CreateWorkoutDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkoutDayDto)
  days: CreateWorkoutDayDto[];
}
