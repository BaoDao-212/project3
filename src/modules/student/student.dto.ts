import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Student } from 'src/entities/student.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class CreateUserInput {
  @ApiProperty({ description: 'user' })
  @IsString()
  userId: number;

  @ApiProperty({ description: 'username' })
  @IsString()
  class: string;
}
export class CreateUserOutput extends CoreOutput {}

export class GetDeTailsOutput extends CoreOutput {
  @ApiProperty({ description: 'Details Student' })
  student?: Student;
}