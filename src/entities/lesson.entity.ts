import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { IsBoolean, IsString } from 'class-validator';
import { Course } from './course.entity';
export enum Type {
  MultipleChoice = 'MultipleChoice',
  Code = 'Code',
}
export class Theory {
  @ApiProperty()
  @IsString()
  theory: string;

  @ApiProperty()
  @IsBoolean()
  isText: boolean;
}

@Entity({ name: 'lesson' })
export class Lesson extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @ManyToOne(() => Course, (course) => course.lessons)
  course: Course;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  type: Type;

  @Column({ type: 'jsonb', array: false, default: () => "'[]'" })
  @ApiProperty()
  theory: Array<Theory>;

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
