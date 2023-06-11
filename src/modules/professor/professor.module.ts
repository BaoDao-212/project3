import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from 'src/entities/professor.entity';
import { User } from 'src/entities/user.entity';
import { ProfessorResolver } from './professor.resolver';
import { ProfessorService } from './professor.servive';
import { Student } from 'src/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Professor, Student])],
  providers: [ProfessorResolver, ProfessorService],
  controllers: [ProfessorResolver],
})
export class ProfessorModule {}
