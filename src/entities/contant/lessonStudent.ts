import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { CourseStudent } from './courseStudent';
import { Lesson } from '../lesson.entity';
import { IsString } from 'class-validator';
export enum Status {
  Correct = 'Correct',
  Wrong = 'Wrong',
  New = 'New',
}

@Entity({ name: 'lesson student' })
export class LessonStudent extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @ManyToOne(
    () => CourseStudent,
    (courseStudent) => courseStudent.lessonStudents,
  )
  courseStudent: CourseStudent;

  @Column()
  @ApiProperty()
  codeCurrent: string;

  @ApiProperty()
  @JoinColumn()
  @OneToOne(() => Lesson, (lesson) => lesson.id)
  lesson: Lesson;

  @Column({ default: Status.New })
  @ApiProperty()
  @IsString()
  status: Status;
}
