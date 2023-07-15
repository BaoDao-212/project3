import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from 'src/entities/professor.entity';
import { User } from 'src/entities/user.entity';
import { LessonResolver } from './lesson.resolver';
import { LessonService } from './lesson.servive';
import { Course } from 'src/entities/course.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { LessonStudent } from 'src/entities/contant/lessonStudent';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Professor, Course, Lesson, LessonStudent]),
  ],
  providers: [LessonResolver, LessonService],
  controllers: [LessonResolver],
})
export class LessonModule {}
