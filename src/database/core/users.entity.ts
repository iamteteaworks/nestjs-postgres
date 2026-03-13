import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { AuthProvider } from 'src/enum/user.enum';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: AuthProvider })
  authProvider: AuthProvider;

  @Column()
  authProviderId: string;

  @Column({ type: 'varchar', nullable: true })
  avatarPath: string | null;
}
