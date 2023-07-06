import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from 'src/entities/professor.entity';
import { User } from 'src/entities/user.entity';
import { ProfessorResolver } from './professor.resolver';
import { ProfessorService } from './professor.servive';
import { Student } from 'src/entities/student.entity';
import { Course } from 'src/entities/course.entity';
import { Lesson } from 'src/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Professor, Student,Course,Lesson])],
  providers: [ProfessorResolver, ProfessorService],
  controllers: [ProfessorResolver],
})
export class ProfessorModule {}
