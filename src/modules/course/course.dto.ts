import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { Course, Language } from 'src/entities/course.entity';
import { CoreOutput } from 'src/modules/common/output.dto';
import { StoredFile } from '../upload/object/StoredFile';

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
