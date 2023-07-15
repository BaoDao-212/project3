import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { Course, Language } from 'src/entities/course.entity';
import { CoreOutput } from 'src/modules/common/output.dto';
import { StoredFile } from '../upload/object/StoredFile';
import { CourseStudent } from 'src/entities/contant/courseStudent';

export class CreateCourseInput {
  @ApiProperty({ description: 'name of course' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'language of this course' })
  @IsString()
  language: Language;

  @ApiProperty({ description: 'content of this post' })
  description: object[];

  @ApiProperty({ description: 'time of this course (hours)' })
  @IsNumber()
  time: number;

  @ApiProperty({ description: 'avatar of course' })
  image: object;

  @ApiProperty({ description: 'number lesson of this course (lesson)' })
  @IsString()
  numberLesson: number;
}
export class UpdateCourseInput {
  @ApiProperty({ description: 'id of course' })
  courseId: number;

  @ApiProperty({ description: 'name of course' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'language of this course' })
  @IsString()
  language: Language;

  @ApiProperty({ description: 'content of this post' })
  description: object[];

  @ApiProperty({ description: 'time of this course (hours)' })
  @IsNumber()
  time: number;

  @ApiProperty({ description: 'number lesson of this course (lesson)' })
  @IsString()
  numberLesson: number;

  @ApiProperty({ description: 'image of this course ' })
  image: StoredFile;
}
export class UpdateCourseOutput extends CoreOutput {}
export class CreateCourseOutput extends CoreOutput {
  @ApiProperty({
    description: 'number lesson of this course (lesson)',
    type: Course,
  })
  course?: Course;
}
export class ListCourseOutput extends CoreOutput {
  @ApiProperty({
    description: 'list course of this course',
    type: Course,
  })
  course?: Course[];
}
// chi tiết khóa học của người dùng
export class DetailCourseOutput extends CoreOutput {
  @ApiProperty({
    description: 'detail course of this course (lesson)',
    type: Course,
  })
  @Type(() => Course)
  course?: Course;
}
// chi tiết khóa học của người dùng
export class ListOverviewNotitiaWebOutput extends CoreOutput {
  @ApiProperty({
    description: 'danh sach bài làm tốt nhất',
  })
  courseStudent?: CourseStudent[];
  @ApiProperty({
    description: 'danh sach bài làm tốt nhất',
  })
  course?: Course[];
  @ApiProperty({
    description: 'số khóa học',
  })
  numberCourse?: number;
  @ApiProperty({
    description: 'số sinh viên',
  })
  numberStudent?: number;
  @ApiProperty({
    description: 'số sinh viên mới đăng kí trong tháng này',
  })
  numberNewStudent?: number;
  @ApiProperty({
    description: 'số khóa học  đã được đăng kí',
  })
  numberCourseStudent?: number;
  @ApiProperty({
    description: 'số khóa học  đã được đăng kí mới trong tháng này',
  })
  numberNewCourseStudent?: number;
  @ApiProperty({
    description: 'số tiết học đã được đăng kí',
  })
  numberLesson?: number;
  @ApiProperty({
    description: 'số tiết học  đã được đăng kí mới trong tháng này',
  })
  numberNewLesson?: number;
}
