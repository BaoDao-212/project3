import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from 'src/entities/professor.entity';
import { User } from 'src/entities/user.entity';
import { LessonStudentResolver } from './lessonStudent.resolver';
import { Course } from 'src/entities/course.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { LessonStudentService } from './lessonStudent.servive';
import { LessonStudent } from 'src/entities/contant/lessonStudent';
import { CompileResolver } from '../compile/compile.resolver';
import { CompileService } from '../compile/compile.servive';
import { CourseStudent } from 'src/entities/contant/courseStudent';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Professor,
      Course,
      Lesson,
      LessonStudent,
      CourseStudent,
    ]),
  ],
  providers: [
    LessonStudentResolver,
    LessonStudentService,
    CompileResolver,
    CompileService,
  ],
  controllers: [LessonStudentResolver],
})
export class LessonStudentModule {}
