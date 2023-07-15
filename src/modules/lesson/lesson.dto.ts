import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { Lesson, Theory, TypeLesson } from 'src/entities/lesson.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class CreateLessonInput {
  @ApiProperty({ description: 'course id of lesson' })
  @IsString()
  courseId: number;

  @ApiProperty({ description: 'language of this lesson' })
  name: string;

  @ApiProperty({ description: 'type answer of this lesson' })
  type: TypeLesson;

  @ApiProperty({
    description: 'theory of this lesson',
    type: Theory,
    isArray: true,
  })
  theory: Theory[];

  @ApiProperty({ description: 'description of this lesson' })
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  exercise: string;

  @ApiProperty()
  @IsString()
  inputString: string;

  @ApiProperty()
  @IsString()
  answer: string;
}
export class CreateLessonOutput extends CoreOutput {}
export class DeleteLessonOutput extends CoreOutput {}
export class DetailLessonOutput extends CoreOutput {
  @Type(() => Lesson)
  lesson?: Lesson;
}
