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

@Entity({ name: 'professor' })
export class Professor extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @JoinColumn()
  @OneToOne((type) => User, (user) => user.id)
  user: User;

  @Column()
  @ApiProperty()
  academicLevel: string;
}
