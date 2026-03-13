import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { WorkoutDay } from './workout_days.entity';

@Entity('workout_exercises')
export class WorkoutExercise extends BaseEntity {
  @ManyToOne(() => WorkoutDay, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workoutDayId' })
  workoutDay: WorkoutDay;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;
}
