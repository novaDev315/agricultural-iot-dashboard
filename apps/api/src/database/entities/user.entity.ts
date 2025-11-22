import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Farm } from './farm.entity';
import { UserFarmAccess } from './user-farm-access.entity';

export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VIEWER })
  role: UserRole;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  timezone?: string;

  @Column({ nullable: true })
  language?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'last_login', nullable: true })
  lastLogin?: Date;

  @Column({ name: 'refresh_token', nullable: true })
  @Exclude()
  refreshToken?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Farm, (farm) => farm.owner)
  farms: Farm[];

  @OneToMany(() => UserFarmAccess, (access) => access.user)
  farmAccess: UserFarmAccess[];
}
