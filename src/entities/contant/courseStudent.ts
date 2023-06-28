import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Course } from '../course.entity';
import { Student } from '../student.entity';
import { BaseEntity } from '../base.entity';
import { LessonStudent } from './lessonStudent';

@Entity({ name: 'course student' })
export class CourseStudent extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @ManyToOne(() => Course, (pro) => pro.id)
  course: Course;

  @ApiProperty()
  @JoinColumn()
  @OneToOne(() => Student, (student) => student.id)
  student: Student;

  @ApiProperty()
  @OneToMany(
    () => LessonStudent,
    (lessonStudents) => lessonStudents.courseStudent,
  )
  lessonStudents: LessonStudent[];
  @Column()
  @ApiProperty()
  numberCompleteLesson: number;

  @Column({ nullable: true })
  @ApiProperty()
  time: number;
}
