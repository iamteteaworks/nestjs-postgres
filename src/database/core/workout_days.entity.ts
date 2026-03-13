import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Workout } from './workouts.entity';

@Entity('workout_days')
export class WorkoutDay extends BaseEntity {
  @ManyToOne(() => Workout, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workoutId' })
  workout: Workout;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;
}
