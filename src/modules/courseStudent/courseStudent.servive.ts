import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Professor } from 'src/entities/professor.entity';
import { User } from 'src/entities/user.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { Course } from 'src/entities/course.entity';
import {
  CreateCourseStudentInput,
  CreateCourseStudentOutput,
  DetailCourseStudentOutput,
  ListCourseStudentOfProfessorOutput,
  ListCourseStudentOutput,
} from './courseStudent.dto';
import { CourseStudent } from 'src/entities/contant/courseStudent';
import { LessonStudent, Status } from 'src/entities/contant/lessonStudent';
import { CompileService } from '../compile/compile.servive';
import { Student } from 'src/entities/student.entity';

@Injectable()
export class CourseStudentService {
  constructor(
    @InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(LessonStudent)
    private readonly lessonStudentRepo: Repository<LessonStudent>,
    @InjectRepository(CourseStudent)
    private readonly courseStudentRepo: Repository<CourseStudent>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Professor)
    private readonly professorRepo: Repository<Professor>,
    private readonly compileService: CompileService,
  ) {}

  async createCourseStudent(
    studentUser: User,
    input: CreateCourseStudentInput,
  ): Promise<CreateCourseStudentOutput> {
    try {
      const { courseId } = input;
      // kiểm tra khóa học này có tồn tại nữa không
      const course = await this.courseRepo.findOne({
        where: {
          id: courseId,
        },
      });
      if (!course)
        return createError('Input', 'Lỗi truy cập, Khóa học này không tồn tại');
      // kiểm tra khóa học này đã được đăng kí bởi người dùng này hay chưa
      const courseStudent = await this.courseStudentRepo.findOne({
        where: {
          course: {
            id: courseId,
          },
          student: {
            user: {
              id: studentUser.id,
            },
          },
        },
      });
      if (courseStudent)
        return createError('Input', 'Khóa học này đã được đăng ký trước đó');
      const student = await this.studentRepo.findOne({
        where: {
          user: {
            id: studentUser.id,
          },
        },
        relations: {
          user: true,
        },
      });
      if (!student)
        return createError(
          'Input',
          'Bạn chưa được cấp quyền Student, Vui lòng liên hệ quản trị viên',
        );
      const newCourseStudent = await this.courseStudentRepo.create({
        course,
        numberCompleteLesson: 0,
        student,
      });
      this.courseStudentRepo.save(newCourseStudent);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async listCourseStudent(studentUser: User): Promise<ListCourseStudentOutput> {
    try {
      // kiểm tra khóa học này có tồn tại nữa không
      const course = await this.courseStudentRepo.find({
        where: {
          student: { user: { id: studentUser.id } },
        },
        relations: {
          lessonStudents: { lesson: true },
          student: { user: true },
          course: { professor: { user: true }, lessons: true },
        },
      });

      return {
        ok: true,
        course,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async listCourseStudentOfProfessor(
    studentId: number,
  ): Promise<ListCourseStudentOfProfessorOutput> {
    try {
      const student = await this.studentRepo.findOne({
        where: {
          id: studentId,
        },
      });
      if (!student)
        return createError('Access Error', 'Please try again later');
      // kiểm tra khóa học này có tồn tại nữa không
      const course = await this.courseStudentRepo.find({
        where: {
          student: { id: studentId },
        },
        relations: {
          lessonStudents: { lesson: true },
          course: { lessons: true },
        },
      });
      const courseData = course.map((course) => {
        return {
          name: course.course.name,
          language: course.course.language,
          numberCorrectAnswer: course.lessonStudents.filter(
            (ls) => ls.status == Status.Correct,
          ).length,
          numberWrongAnswer: course.lessonStudents.filter(
            (ls) => ls.status == Status.Wrong,
          ).length,
          numberNewAnswer:
            course.course.lessons.length -
            course.lessonStudents.filter((ls) => ls.status == Status.Correct)
              .length -
            course.lessonStudents.filter((ls) => ls.status == Status.Wrong)
              .length,
        };
      });
      return {
        ok: true,
        courseData,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async detailCourseStudent(
    studentUser: User,
    courseId: number,
  ): Promise<DetailCourseStudentOutput> {
    try {
      // kiểm tra khóa học này có tồn tại nữa không
      const course = await this.courseStudentRepo.findOne({
        where: {
          student: { user: { id: studentUser.id } },
          course: { id: courseId },
        },
        relations: {
          student: { user: true },
          course: { professor: { user: true }, lessons: true },
          lessonStudents: { lesson: true },
        },
      });

      return {
        ok: true,
        course,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // async updateLessonStudent(
  //   student: User,
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   inputUpdate: UpdateLessonStudentInput,
  // ): Promise<CreateLessonStudentOutput> {
  //   try {
  //     const { codeCurrent, lessonStudentId } = inputUpdate;
  //     const LessonStudent = await this.lessonStudentRepo.findOne({
  //       where: {
  //         id: lessonStudentId,
  //       },
  //     });
  //     if (!LessonStudent)
  //       return createError(
  //         'Input',
  //         'Lỗi truy cập, bạn chưa đăng kí khóa học này',
  //       );
  //     if (LessonStudent.courseStudent.student.user.id != student.id)
  //       return createError('Input', 'Lỗi truy cập, vui lòng thử lại');
  //     const language = LessonStudent.lesson.course.language;
  //     const input = LessonStudent.lesson.input;
  //     const output = this.compileService.runCode({
  //       inputString: input,
  //       language,
  //       code: codeCurrent,
  //     });
  //     console.log(output);
  //     return {
  //       ok: true,
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     return createError('Server', 'Lỗi server, thử lại sau');
  //   }
  // }
}
