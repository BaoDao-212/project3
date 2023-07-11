import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from 'src/entities/professor.entity';
import { User } from 'src/entities/user.entity';
import { CourseResolver } from './course.resolver';
import { CourseService } from './course.servive';
import { Course } from 'src/entities/course.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { CourseStudent } from 'src/entities/contant/courseStudent';
import { LessonStudent } from 'src/entities/contant/lessonStudent';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Professor,
      Course,
      Lesson,
      CourseStudent,
      LessonStudent,
    ]),
  ],
  providers: [CourseResolver, CourseService],
  controllers: [CourseResolver],
})
export class CourseModule {}
