/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UpdateWorkoutExerciseDto } from './update-workout-exercise.dto';

export class UpdateWorkoutDayDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateWorkoutExerciseDto)
  exercises: UpdateWorkoutExerciseDto[];
}
