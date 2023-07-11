import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Course } from 'src/entities/Course.entity';
import { Repository, In } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Professor } from 'src/entities/professor.entity';
import {
  CreateCourseInput,
  CreateCourseOutput,
  DetailCourseOutput,
  ListCourseOutput,
  UpdateCourseInput,
} from './course.dto';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from '../common/output.dto';
import { Lesson } from 'src/entities/lesson.entity';
import { CourseStudent } from 'src/entities/contant/courseStudent';
import { LessonStudent } from 'src/entities/contant/lessonStudent';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(LessonStudent)
    private readonly lessonStudentRepo: Repository<LessonStudent>,
    @InjectRepository(CourseStudent)
    private readonly courseStudentRepo: Repository<CourseStudent>,
    @InjectRepository(Professor)
    private readonly professorRepo: Repository<Professor>,
  ) {}

  async createCourse(
    professor: User,
    input: CreateCourseInput,
  ): Promise<CreateCourseOutput> {
    try {
      const { description, language, name, numberLesson, time, image } = input;
      const course = await this.courseRepo.findOne({
        where: {
          name: name,
        },
      });
      const pro = await this.professorRepo.findOne({
        where: {
          user: {
            id: professor.id,
          },
        },
        relations: {
          user: true,
        },
      });
      if (!pro) return createError('Input', 'Professor không hợp lệ');
      if (course) return createError('Input', 'Khóa học này đã tồn tại');
      if (numberLesson < 0 || time < 0)
        return createError(
          'Input',
          'Số tiết học hoặc tổng số giờ học không hợp lệ',
        );
      const CourseH = this.courseRepo.create({
        name,
        description,
        language,
        professor: pro,
        time,
        numberLesson,
        image,
      });
      console.log(CourseH);

      await this.courseRepo.save(CourseH);

      return {
        ok: true,
        course: CourseH,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  //update khóa học
  async updateCourse(
    professor: User,
    input: UpdateCourseInput,
  ): Promise<CreateCourseOutput> {
    try {
      const { description, language, name, numberLesson, time, courseId } =
        input;
      const course = await this.courseRepo.findOne({
        where: {
          id: courseId,
        },
        relations: {
          professor: {
            user: true,
          },
        },
      });
      if (!course) return createError('Input', 'Khóa học này không tồn tại');
      if (course.professor.user.id != professor.id)
        return createError(
          'Lỗi truy cập',
          'Bạn không có quyền chỉnh sửa khóa học này',
        );
      if (numberLesson < 0 || time < 0)
        return createError(
          'Input',
          'Số tiết học hoặc tổng số giờ học không hợp lệ',
        );
      course.name = name;
      course.image = input.image;
      course.description = description;
      course.language = language;
      course.numberLesson = numberLesson;
      course.time = time;
      await this.courseRepo.save(course);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async listCourseProfessor(professor: User): Promise<ListCourseOutput> {
    try {
      const pro = await this.professorRepo.findOne({
        where: {
          user: {
            id: professor.id,
          },
        },
        relations: {
          user: true,
        },
      });
      if (!pro) return createError('Input', 'Professor không hợp lệ');
      const course = await this.courseRepo.find({
        where: {
          professor: {
            id: pro.id,
          },
        },
        relations: {
          lessons: true,
          professor: true,
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
  async listCourse(): Promise<ListCourseOutput> {
    try {
      const course = await this.courseRepo.find({
        relations: {
          professor: { user: true },
          lessons: true,
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
  async detailCourse(courseId: number): Promise<DetailCourseOutput> {
    try {
      const course = await this.courseRepo.findOne({
        where: { id: courseId },
        relations: {
          lessons: true,
          professor: { user: true },
        },
      });
      if (!course)
        return createError(
          'Truy cập không hợp lệ',
          'Khóa học này không tồn tại',
        );

      return {
        ok: true,
        course,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async deleteCourse(professor: User, courseId: number): Promise<CoreOutput> {
    try {
      const course = await this.courseRepo.findOne({
        where: { id: courseId },
        relations: {
          lessons: true,
          professor: { user: true },
        },
      });
      if (!course)
        return createError(
          'Truy cập không hợp lệ',
          'Khóa học này không tồn tại',
        );
      if (course.professor.user.id != professor.id)
        return createError(
          'Truy cập không hợp lệ',
          'Bạn không có quyền xóa khóa học này',
        );
      const lessonIDs = course.lessons.map((l) => l.id);
      console.log(lessonIDs);
      course.lessons = [];
      const lessons = await this.lessonRepo.find({
        where: {
          id: In(lessonIDs),
        },
      });
      console.log(lessons);
      const courseStudent = await this.courseStudentRepo.find({
        where: {
          course: {
            id: courseId,
          },
        },
        relations: { lessonStudents: true, course: true },
      });
      console.log(courseStudent);

      courseStudent.forEach(async (cs) => {
        cs.lessonStudents = [];
        cs.course = null;
        await this.courseStudentRepo.save(cs);
        const lessonStudent = await this.lessonStudentRepo.find({
          where: {
            courseStudent: {
              id: cs.id,
            },
          },
        });
        lessonStudent.forEach(async (ls) => {
          ls.courseStudent = null;
          await this.courseStudentRepo.delete({ id: ls.id });
        });
        await this.courseStudentRepo.delete({ id: cs.id });
      });
      lessons.forEach((l) => {
        l.course = null;
      });
      console.log(lessons);
      console.log(course);

      await this.lessonRepo.save(lessons);
      await this.courseRepo.save(course);
      await this.courseRepo.delete({ id: courseId });
      lessonIDs.forEach(async (id) => await this.lessonRepo.delete({ id: id }));

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
