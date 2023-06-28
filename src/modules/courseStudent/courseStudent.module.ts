import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from 'src/entities/professor.entity';
import { User } from 'src/entities/user.entity';
import { Course } from 'src/entities/course.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { LessonStudent } from 'src/entities/contant/lessonStudent';
import { CompileResolver } from '../compile/compile.resolver';
import { CompileService } from '../compile/compile.servive';
import { CourseStudent } from 'src/entities/contant/courseStudent';
import { CourseStudentResolver } from './courseStudent.resolver';
import { CourseStudentService } from './courseStudent.servive';
import { Student } from 'src/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Professor,
      Course,
      Lesson,
      Student,
      LessonStudent,
      CourseStudent,
    ]),
  ],
  providers: [
    CourseStudentResolver,
    CourseStudentService,
    CompileResolver,
    CompileService,
  ],
  controllers: [CourseStudentResolver],
})
export class CourseStudentModule {}
