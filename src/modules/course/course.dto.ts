import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { CoreOutput } from 'src/modules/common/output.dto';

export class CreateCourseInput {
  @ApiProperty({ description: 'user' })
  @IsString()
  userId: number;

  @ApiProperty({ description: 'academic level' })
  @IsString()
  academicLevel: string;
}
export class CreateCourseOutput extends CoreOutput {}
