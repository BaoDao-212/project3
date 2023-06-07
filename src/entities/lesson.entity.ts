import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Professor } from './professor.entity';
import { Course } from './course.entity';
export enum Type {
  MultipleChoice = 'MultipleChoice',
  Code = 'Code',
}
@Entity({ name: 'course' })
export class Lesson extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @ManyToOne((type) => Course, (course) => course.id)
  course: Course;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  type: Type;

  @Column({ nullable: true })
  @ApiProperty()
  description: string;

  @Column({ nullable: true })
  @ApiProperty()
  exercise: string;

  @Column({ nullable: true })
  @ApiProperty()
  answer: string;
}
