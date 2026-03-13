/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString } from 'class-validator';

export class CreateWorkoutExerciseDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  set?: string;

  @IsOptional()
  @IsString()
  reps?: string;
}
