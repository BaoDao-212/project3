import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Theory, Type } from 'src/entities/lesson.entity';
import { Student } from 'src/entities/student.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class CreateLessonStudentInput {
  @ApiProperty({ description: 'course id of lesson' })
  @IsString()
  courseStudentId: number;
}
export class CreateLessonStudentOutput extends CoreOutput {}
