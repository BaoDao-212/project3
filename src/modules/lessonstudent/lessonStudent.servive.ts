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
  DetailLessonStudentOutput,
  UpdateLessonStudentInput,
  UpdateLessonStudentOutput,
} from './lessonStudent.dto';
import { CourseStudent } from 'src/entities/contant/courseStudent';
import { LessonStudent, Status } from 'src/entities/contant/lessonStudent';
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
      // kiểm tra xem lesson này đã được người dùng này đăng kí trước đó hay chưa
      const lessonStudentCheck = await this.lessonStudentRepo.findOne({
        where: {
          lesson: {
            id: lessonId,
          },
          courseStudent: {
            id: courseStudentId,
          },
        },
      });
      if (lessonStudentCheck)
        return createError(
          'Input',
          'Lỗi thao tác, bài học này đã được hoàn thiện vào trước đó',
        );
      const courseStudent = await this.courseStudentRepo.findOne({
        where: {
          id: courseStudentId,
        },
        relations: {
          course: true,
          student: { user: true },
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
    inputUpdate: UpdateLessonStudentInput,
  ): Promise<UpdateLessonStudentOutput> {
    try {
      const { codeCurrent, lessonStudentId } = inputUpdate;
      console.log(inputUpdate);
      const LessonStudent = await this.lessonStudentRepo.findOne({
        where: {
          id: lessonStudentId,
        },
        relations: {
          courseStudent: {
            student: { user: true },
          },
          lesson: {
            course: true,
          },
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
      const output = await this.compileService.runCode({
        inputString: input,
        language,
        code: codeCurrent,
      });

      const {
        cpuUsage,
        exitCode,
        memoryUsage,
        ok,
        signal,
        stderr,
        stdout,
        error,
      } = output;
      if (stdout == LessonStudent.lesson.answer) {
        LessonStudent.status = Status.Correct;
      } else {
        LessonStudent.status = Status.Wrong;
      }
      LessonStudent.codeCurrent = codeCurrent;
      await this.lessonStudentRepo.save(LessonStudent);
      return {
        ok: true,
        cpuUsage,
        exitCode,
        memoryUsage,
        signal,
        stderr,
        stdout,
        error,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // xem chi  tiết khóa học cho người dùng
  async detailLessonStudent(
    student: User,
    idLessonStudent: number,
  ): Promise<DetailLessonStudentOutput> {
    try {
      const lessonStudent = await this.lessonStudentRepo.findOne({
        where: {
          id: idLessonStudent,
        },
        relations: {
          lesson: {
            course: {
              professor: true,
            },
          },
          courseStudent: {
            student: { user: true },
          },
        },
      });
      if (!lessonStudent)
        return createError('Input', 'Yêu cầu này không hợp lệ');
      if (lessonStudent.courseStudent.student.user.id !== student.id)
        return createError('Lỗi truy cập', 'Truy cập không hợp lệ ');

      return {
        ok: true,
        lessonStudent,
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
