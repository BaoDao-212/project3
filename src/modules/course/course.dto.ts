import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Course, Language } from 'src/entities/course.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

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

  @ApiProperty({ description: 'number lesson of this course (lesson)' })
  @IsString()
  numberLesson: number;
}
export class CreateCourseOutput extends CoreOutput {

  @ApiProperty({

    description: 'number lesson of this course (lesson)',

    type: Course,

  })

  course?: Course;

}

export class GetInfoCourseOutput extends CoreOutput{
  @ApiProperty({description:"List of course"})
  courses?:Course[];
}

export class ChangeCourseInput{
  @ApiProperty({ description: 'name of course' })
  @IsString()
  name: string;
  @ApiProperty({ description: 'language of this course' })
  @IsString()
  language: Language;

  @ApiProperty({ description: 'description of this course' })
  @IsString()
  description: object[];

  @ApiProperty({ description: 'time of this course (hours)' })
  @IsNumber()
  time: number;

  @ApiProperty({ description: 'number lesson of this course (lesson)' })
  @IsString()
  numberLesson: number;
}

export class ChangeCourseOutput extends CoreOutput {}
export class ListCourseOutput extends CoreOutput {

  @ApiProperty({

    description: 'list course of this course',

    type: Course,

  })

  course?: Course[];

}