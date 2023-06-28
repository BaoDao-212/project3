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
  UpdateLessonStudentInput,
} from './lessonStudent.dto';
import { CourseStudent } from 'src/entities/contant/courseStudent';
import { LessonStudent } from 'src/entities/contant/lessonStudent';
import { CompileService } from '../compile/compile.servive';

@Injectable()
export class LessonStudentService {
  constructor(
    @InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(LessonStudent)
    private readonly lessonStudentRepo: Repository<LessonStudent>,
    @InjectRepository(CourseStudent)
    private readonly courseStudentRepo: Repository<CourseStudent>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Professor)
    private readonly professorRepo: Repository<Professor>,
    private readonly compileService: CompileService,
  ) {}

  async createLessonStudent(
    student: User,
    input: CreateLessonStudentInput,
  ): Promise<CreateLessonStudentOutput> {
    try {
      const { courseStudentId, lessonId } = input;
      const courseStudent = await this.courseStudentRepo.findOne({
        where: {
          id: courseStudentId,
        },
        relations: {
          student: {
            user: true,
          },
          course: true,
        },
      });
      if (!courseStudent)
        return createError(
          'Input',
          'Lỗi truy cập, bạn chưa đăng kí khóa học này',
        );
      if (courseStudent.student.user.id != student.id)
        return createError('Input', 'Lỗi truy cập, vui lòng thử lại');
      const lesson = await this.lessonRepo.findOne({
        where: {
          id: lessonId,
        },
        relations: {
          course: true,
        },
      });
      if (!lesson)
        return createError('Input', 'Bài học này không còn tồn tại nữa');
      if (lesson.course.id != courseStudent.course.id)
        return createError('Input', 'Lỗi thao tác không hợp lệ');
      const lessonStudent = await this.lessonStudentRepo.create({
        codeCurrent: '',
        lesson,
        courseStudent,
      });
      this.lessonStudentRepo.save(lessonStudent);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async updateLessonStudent(
    student: User,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inputUpdate: UpdateLessonStudentInput,
  ): Promise<CreateLessonStudentOutput> {
    try {
      const { codeCurrent, lessonStudentId } = inputUpdate;
      const LessonStudent = await this.lessonStudentRepo.findOne({
        where: {
          id: lessonStudentId,
        },
      });
      if (!LessonStudent)
        return createError(
          'Input',
          'Lỗi truy cập, bạn chưa đăng kí khóa học này',
        );
      if (LessonStudent.courseStudent.student.user.id != student.id)
        return createError('Input', 'Lỗi truy cập, vui lòng thử lại');
      const language = LessonStudent.lesson.course.language;
      const input = LessonStudent.lesson.input;
      const output = this.compileService.runCode({
        inputString: input,
        language,
        code: codeCurrent,
      });
      console.log(output);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
