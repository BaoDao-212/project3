import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Professor } from 'src/entities/professor.entity';
import {
  CreateLessonInput,
  CreateLessonOutput,
  DeleteLessonOutput,
  DetailLessonOutput,
} from './lesson.dto';
import { User } from 'src/entities/user.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { Course } from 'src/entities/course.entity';
import { LessonStudent } from 'src/entities/contant/lessonStudent';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(LessonStudent)
    private readonly lessonStudentRepo: Repository<LessonStudent>,
    @InjectRepository(Professor)
    private readonly professorRepo: Repository<Professor>,
  ) {}

  async createLesson(
    professor: User,
    input: CreateLessonInput,
  ): Promise<CreateLessonOutput> {
    try {
      const {
        answer,
        courseId,
        description,
        exercise,
        name,
        theory,
        type,
        inputString,
      } = input;
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
          input: inputString,
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
  async detailLesson(lessonId: number): Promise<DetailLessonOutput> {
    try {
      console.log(lessonId);

      const lesson = await this.lessonRepo.findOne({
        where: { id: lessonId },
        relations: {
          course: {
            professor: { user: true },
          },
        },
      });
      if (!lesson)
        return createError(
          'Truy cập không hợp lệ',
          'Bài học này không tồn tại',
        );
      return {
        ok: true,
        lesson,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async deleteLesson(
    professor: User,
    lessonId: number,
  ): Promise<DeleteLessonOutput> {
    try {
      const lesson = await this.lessonRepo.findOne({
        where: { id: lessonId },
        relations: {
          // course: {
          //   professor: { user: true },
          // },
        },
      });
      if (!lesson)
        return createError(
          'Truy cập không hợp lệ',
          'Bài học này không tồn tại',
        );
      const lessonStudent = await this.lessonStudentRepo.find({
        where: {
          lesson: {
            id: lessonId,
          },
        },
      });
      lessonStudent.forEach(async (ls) => {
        await this.lessonStudentRepo.delete({ id: ls.id });
      });
      if (lesson.course.professor.user.id != professor.id)
        return createError(
          'Truy cập không hợp lệ',
          'Bạn không có quyền xóa bài học này',
        );
      const course = await this.courseRepo.findOne({
        where: {
          id: lesson.course.id,
        },
      });
      course.lessons = course.lessons.filter((l) => l.id !== lessonId);
      await this.courseRepo.save(course);
      await this.lessonRepo.delete({ id: lessonId });
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
