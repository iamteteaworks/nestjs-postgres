import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from 'src/database/core/workouts.entity';
import { WorkoutDay } from 'src/database/core/workout_days.entity';
import { WorkoutExercise } from 'src/database/core/workout_exercises.entity';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workout, WorkoutDay, WorkoutExercise])],
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
})
export class WorkoutsModule {}
