import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Workout } from './workouts.entity';
import { WorkoutExercise } from './workout_exercises.entity';

@Entity('workout_days')
export class WorkoutDay extends BaseEntity {
  @ManyToOne(() => Workout, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workoutId' })
  workout: Workout;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @OneToMany(() => WorkoutExercise, (ex) => ex.workoutDay)
  exercises: WorkoutExercise[];
}
