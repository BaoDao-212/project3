import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CoreOutput } from 'src/modules/common/output.dto';

export class CreateCourseStudentInput {
  @ApiProperty({ description: 'course id of lesson' })
  @IsString()
  courseId: number;
}
export class CreateCourseStudentOutput extends CoreOutput {}

export class UpdateCourseStudentInput {
  @ApiProperty({ description: 'code current id of lesson' })
  @IsString()
  codeCurrent: string;

  @ApiProperty({ description: 'lesson id ' })
  @IsString()
  courseStudentId: number;
}
export class UpdateCourseStudentOutput extends CoreOutput {
  @ApiProperty({ description: 'error ' })
  @IsString()
  stderr: string;

  @ApiProperty({ description: 'output ' })
  @IsString()
  stdout: string;

  @ApiProperty({ description: 'exitCode ' })
  @IsString()
  exitCode: number;

  @ApiProperty({ description: 'signal ' })
  @IsString()
  signal: string;

  @ApiProperty({ description: 'memoryUsage ' })
  @IsString()
  memoryUsage: string;

  @ApiProperty({ description: 'cpuUsage ' })
  @IsString()
  cpuUsage: string;
}
