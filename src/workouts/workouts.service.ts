import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from 'src/database/core/workouts.entity';
import { WorkoutDay } from 'src/database/core/workout_days.entity';
import { WorkoutExercise } from 'src/database/core/workout_exercises.entity';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepo: Repository<Workout>,
    @InjectRepository(WorkoutDay)
    private readonly workoutDayRepo: Repository<WorkoutDay>,
    @InjectRepository(WorkoutExercise)
    private readonly workoutExerciseRepo: Repository<WorkoutExercise>,
  ) {}

  async create(userId: string, dto: CreateWorkoutDto): Promise<Workout> {
    const workout = this.workoutRepo.create({
      name: dto.name,
      notes: dto.notes ?? '',
      user: { id: userId },
    });
    const saved = await this.workoutRepo.save(workout);

    for (const dayDto of dto.days ?? []) {
      const day = this.workoutDayRepo.create({
        workout: { id: saved.id },
        name: dayDto.name,
        description: dayDto.description ?? null,
      });
      const savedDay = await this.workoutDayRepo.save(day);
      for (const exDto of dayDto.exercises ?? []) {
        const ex = this.workoutExerciseRepo.create({
          workoutDay: { id: savedDay.id },
          name: exDto.name,
          set: exDto.set ?? null,
          reps: exDto.reps ?? null,
        });
        await this.workoutExerciseRepo.save(ex);
      }
    }

    return this.findOne(userId, saved.id);
  }

  async findAll(userId: string): Promise<Workout[]> {
    return this.workoutRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Workout> {
    const workout = await this.workoutRepo.findOne({
      where: { id, user: { id: userId } },
      relations: { days: { exercises: true } },
      order: { days: { createdAt: 'ASC', exercises: { createdAt: 'ASC' } } },
    });
    if (!workout) throw new NotFoundException('Workout not found');
    return workout;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateWorkoutDto,
  ): Promise<Workout> {
    const workout = await this.workoutRepo.findOne({
      where: { id, user: { id: userId } },
      relations: { days: { exercises: true } },
    });
    if (!workout) throw new NotFoundException('Workout not found');

    if (dto.name != null) workout.name = dto.name;
    if (dto.notes != null) workout.notes = dto.notes;
    await this.workoutRepo.save(workout);

    const payloadDayIds = (dto.days ?? []).map((d) => d.id).filter(Boolean);
    const existingDays = workout.days ?? [];

    for (const existingDay of existingDays) {
      if (!payloadDayIds.includes(existingDay.id)) {
        await this.workoutDayRepo.softRemove(existingDay);
      }
    }

    for (const dayDto of dto.days ?? []) {
      if (dayDto.id) {
        const existingDay = existingDays.find((d) => d.id === dayDto.id);
        if (existingDay) {
          existingDay.name = dayDto.name;
          existingDay.description = dayDto.description ?? null;
          await this.workoutDayRepo.save(existingDay);

          const payloadExIds = (dayDto.exercises ?? [])
            .map((e) => e.id)
            .filter(Boolean);
          const existingExercises = existingDay.exercises ?? [];
          for (const ex of existingExercises) {
            if (!payloadExIds.includes(ex.id)) {
              await this.workoutExerciseRepo.softRemove(ex);
            }
          }
          for (const exDto of dayDto.exercises ?? []) {
            if (exDto.id) {
              const existingEx = existingExercises.find(
                (e) => e.id === exDto.id,
              );
              if (existingEx) {
                existingEx.name = exDto.name;
                existingEx.set = exDto.set ?? null;
                existingEx.reps = exDto.reps ?? null;
                await this.workoutExerciseRepo.save(existingEx);
              }
            } else {
              const newEx = this.workoutExerciseRepo.create({
                workoutDay: { id: existingDay.id },
                name: exDto.name,
                set: exDto.set ?? null,
                reps: exDto.reps ?? null,
              });
              await this.workoutExerciseRepo.save(newEx);
            }
          }
          continue;
        }
      }
      const newDay = this.workoutDayRepo.create({
        workout: { id },
        name: dayDto.name,
        description: dayDto.description ?? null,
      });
      const savedDay = await this.workoutDayRepo.save(newDay);
      for (const exDto of dayDto.exercises ?? []) {
        const ex = this.workoutExerciseRepo.create({
          workoutDay: { id: savedDay.id },
          name: exDto.name,
          set: exDto.set ?? null,
          reps: exDto.reps ?? null,
        });
        await this.workoutExerciseRepo.save(ex);
      }
    }

    return this.findOne(userId, id);
  }

  async remove(userId: string, id: string): Promise<void> {
    const workout = await this.workoutRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!workout) throw new NotFoundException('Workout not found');
    await this.workoutRepo.softRemove(workout);
  }
}
