import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Language } from 'src/entities/course.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class RunCodeInput {
  @ApiProperty({ description: 'inputString ' })
  @IsString()
  inputString?: string;

  @ApiProperty({ description: 'inputArray ' })
  inputArray?: number[];

  @ApiProperty({ description: 'code of student request ' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'academic level' })
  language: Language;
}
export class RunCodeOutput extends CoreOutput {
  @ApiProperty({ description: 'error ' })
  @IsString()
  stderr?: string;

  @ApiProperty({ description: 'error ' })
  @IsString()
  errorType?: string;

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
