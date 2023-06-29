import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Language } from 'src/entities/course.entity';
import { CoreOutput } from 'src/modules/common/output.dto';
import { RunCodeOutput } from '../compile/compile.dto';

export class CreateLessonStudentInput {
  @ApiProperty({ description: 'course id of lesson' })
  @IsString()
  courseStudentId: number;

  @ApiProperty({ description: 'lesson id ' })
  @IsString()
  lessonId: number;
}
export class CreateLessonStudentOutput extends CoreOutput {}

export class UpdateLessonStudentInput {
  @ApiProperty({ description: 'code current id of lesson' })
  @IsString()
  codeCurrent: string;

  @ApiProperty({ description: 'lesson id ' })
  @IsString()
  lessonStudentId: number;
}
export class UpdateLessonStudentOutput extends CoreOutput {
  @ApiProperty({ description: 'error ' })
  @IsString()
  stderr?: string;

  @ApiProperty({ description: 'output ' })
  @IsString()
  stdout?: string;

  @ApiProperty({ description: 'exitCode ' })
  @IsString()
  exitCode?: number;

  @ApiProperty({ description: 'signal ' })
  @IsString()
  signal?: string;

  @ApiProperty({ description: 'memoryUsage ' })
  @IsString()
  memoryUsage?: string;

  @ApiProperty({ description: 'cpuUsage ' })
  @IsString()
  cpuUsage?: string;
}
