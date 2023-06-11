import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Professor } from 'src/entities/professor.entity';
import { CreateLessonInput, CreateLessonOutput } from './lesson.dto';
import { User } from 'src/entities/user.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { Course } from 'src/entities/course.entity';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Professor)
    private readonly professorRepo: Repository<Professor>,
  ) {}

  async createLesson(
    professor: User,
    input: CreateLessonInput,
  ): Promise<CreateLessonOutput> {
    try {
      const { answer, courseId, description, exercise, name, theory, type } =
        input;
      const lesson = await this.lessonRepo.findOne({
        where: {
          name: name,
        },
      });
      if (lesson) return createError('Input', 'Bài học này đã tồn tại');
      const pro = await this.professorRepo.findOne({
        where: {
          user: {
            id: professor.id,
          },
        },
      });
      if (!pro) return createError('Input', 'Professor không hợp lệ');
      const course = await this.courseRepo.findOne({
        where: {
          id: courseId,
        },
        relations: {
          professor: true,
          lessons: true,
        },
      });
      if (!course) return createError('Input', 'Khóa học không hợp lệ');
      if ((await course.professor.id) !== pro.id)
        return createError(
          'Input',
          'Bạn không có quyền thêm tiết học cho khóa học này',
        );

      await this.lessonRepo.save(
        this.lessonRepo.create({
          answer,
          description,
          exercise,
          theory,
          name,
          type,
          course,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
