import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
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
