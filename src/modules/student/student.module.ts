import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { StudentResolver } from './student.resolver';
import { StudentService } from './student.servive';
import { Student } from 'src/entities/student.entity';
import { Professor } from 'src/entities/professor.entity';
import { CourseStudent } from 'src/entities/contant/courseStudent';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student, Professor,CourseStudent])],
  providers: [StudentService, StudentResolver],
  controllers: [StudentResolver],
})
export class StudentModule {}
