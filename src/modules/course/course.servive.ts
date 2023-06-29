import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Course } from 'src/entities/Course.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Professor } from 'src/entities/professor.entity';
import { ChangeCourseInput, ChangeCourseOutput, CreateCourseInput, CreateCourseOutput, GetInfoCourseOutput } from './course.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Professor)
    private readonly professorRepo: Repository<Professor>,
  ) {}

  async createCourse(
    professor: User,
    input: CreateCourseInput,
  ): Promise<CreateCourseOutput> {
    try {
      const { description, language, name, numberLesson, time } = input;
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
      });
      console.log(CourseH);

      await this.courseRepo.save(CourseH);
      console.log('12312312312312');

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async getInfoCourse(): Promise<GetInfoCourseOutput> {
    try {
      const courses = await this.courseRepo.find();
      return {
        ok: true,
        courses: courses,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async changeCourse(
    professor: User,
    input: ChangeCourseInput,
  ): Promise<ChangeCourseOutput> {
    try {
      const { description, language, name, numberLesson, time } = input;
      
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
        professor:{
          id:professor.id,
        }
        },
      });

      if(!course) return createError('Input','Không có khóa học nào');
      if (numberLesson < 0 || time < 0)
        return createError(
          'Input',
          'Số tiết học hoặc tổng số giờ học không hợp lệ',
        );
      
      course.name=name;
      course.numberLesson=numberLesson;
      course.time=time;
      course.language=language;
      course.description=description;
      await this.courseRepo.save(course);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
