import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Theory, Type } from 'src/entities/lesson.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class CreateLessonInput {
  @ApiProperty({ description: 'course id of lesson' })
  @IsString()
  courseId: number;

  @ApiProperty({ description: 'language of this lesson' })
  name: string;

  @ApiProperty({ description: 'type answer of this lesson' })
  type: Type;

  @ApiProperty({ description: 'theory of this lesson' })
  theory: Theory[];

  @ApiProperty({ description: 'description of this lesson' })
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  exercise: string;

  @ApiProperty()
  @IsString()
  answer: string;
}
export class CreateLessonOutput extends CoreOutput {}
