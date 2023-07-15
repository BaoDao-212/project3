import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { Student } from 'src/entities/student.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class GetInfoStudent extends CoreOutput {
  @ApiProperty({ description: 'student' })
  student?: Student;
}

export class CreateUserInput {
  @ApiProperty({ description: 'user' })
  @IsString()
  userId: number;

  @ApiProperty({ description: 'username' })
  @IsString()
  class: string;
}

export class UpdateStudent {
  @ApiProperty({ description: 'user' })
  @IsString()
  userId: number;

  @ApiProperty({ description: 'username' })
  @IsString()
  user: string;
}

export class CreateUserOutput extends CoreOutput { }
