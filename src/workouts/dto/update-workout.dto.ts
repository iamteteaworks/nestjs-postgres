/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreateWorkoutDto } from './create-workout.dto';
import { UpdateWorkoutDayDto } from './update-workout-day.dto';

export class UpdateWorkoutDto extends PartialType(CreateWorkoutDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateWorkoutDayDto)
  days?: UpdateWorkoutDayDto[];
}
