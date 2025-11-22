import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User, UserRole } from './user.entity';
import { Farm } from './farm.entity';

@Entity('user_farm_access')
@Unique(['userId', 'farmId'])
export class UserFarmAccess {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'farm_id' })
  farmId: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'simple-array', nullable: true })
  permissions?: string[];

  @Column({ name: 'granted_by' })
  grantedBy: string;

  @CreateDateColumn({ name: 'granted_at' })
  grantedAt: Date;

  @ManyToOne(() => User, (user) => user.farmAccess, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Farm, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;
}
