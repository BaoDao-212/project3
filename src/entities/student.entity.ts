import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'student' })
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @JoinColumn()
  @OneToOne((type) => User, (user) => user.id)
  user: User;

  @Column()
  @ApiProperty()
  class: string;

  @Column({ nullable: true, default: 0 })
  @ApiProperty()
  averageMark: number;
}
