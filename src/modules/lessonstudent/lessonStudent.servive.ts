import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Professor } from 'src/entities/professor.entity';
import { User } from 'src/entities/user.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { Course } from 'src/entities/course.entity';
import {
  CreateLessonStudentInput,
  CreateLessonStudentOutput,
} from './lessonStudent.dto';
import { CourseStudent } from 'src/entities/contant/courseStudent';

@Injectable()
export class LessonStudentService {
  constructor(
    @InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(CourseStudent)
    private readonly courseStudentRepo: Repository<CourseStudent>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Professor)
    private readonly professorRepo: Repository<Professor>,
  ) {}

  async createLessonStudent(
    student: User,
    input: CreateLessonStudentInput,
  ): Promise<CreateLessonStudentOutput> {
    try {
      const { courseStudentId } = input;
      const courseStudent = await this.courseStudentRepo.findOne({
        where: {
          id: courseStudentId,
        },
      });
      if (courseStudent) return createError('Input', 'Lỗi truy cập');

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
