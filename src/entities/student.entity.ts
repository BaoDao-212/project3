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
import { IsNumber, IsString } from 'class-validator';

@Entity({ name: 'student' })
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @JoinColumn()
  @OneToOne(() => User, (user) => user.id)
  user: User;

  @Column()
  @ApiProperty()
  @IsString()
  class: string;

  @Column({ nullable: true, default: 0 })
  @ApiProperty()
  @IsNumber()
  averageMark: number;
}
