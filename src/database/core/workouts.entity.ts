import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from './users.entity';
import { WorkoutDay } from './workout_days.entity';

@Entity('workouts')
export class Workout extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  name: string;

  @Column()
  notes: string;

  @OneToMany(() => WorkoutDay, (day) => day.workout)
  days: WorkoutDay[];
}
