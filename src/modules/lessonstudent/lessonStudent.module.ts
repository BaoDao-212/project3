import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from 'src/entities/professor.entity';
import { User } from 'src/entities/user.entity';
import { LessonStudentResolver } from './lessonStudent.resolver';
import { Course } from 'src/entities/course.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { LessonStudentService } from './lessonStudent.servive';

@Module({
  imports: [TypeOrmModule.forFeature([User, Professor, Course, Lesson])],
  providers: [LessonStudentResolver, LessonStudentService],
  controllers: [LessonStudentResolver],
})
export class LessonModule {}
