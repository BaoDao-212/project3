import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class RegisterUserInput {
  @ApiProperty({ description: 'username' })
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiProperty({ description: 'username' })
  @IsString()
  @MinLength(1)
  username?: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  @MinLength(1)
  password: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  @MinLength(1)
  confirmPassword: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  @ApiProperty()
  email?: string;
  @ApiProperty({ description: 'position' })
  @IsString()
  @ApiProperty()
  position?: string;
}

export class RegisterUserOutput extends CoreOutput {}
export class ListUserOutput extends CoreOutput {
  @ApiProperty({ description: 'list user' })
  users?: User[];
}

export class LoginInput {
  @ApiProperty({ description: 'username' })
  @IsString()
  @MinLength(1)
  username: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  @MinLength(1)
  password: string;
}

export class LoginOutput extends CoreOutput {
  @ApiProperty({ description: 'JWT身份Token' })
  accessToken?: string;
}

export class NewAccessTokenInput {
  @ApiProperty({ description: 'old access token' })
  accessToken: string;
}
export class NewAccessTokenOutput extends CoreOutput {
  @ApiProperty({ description: 'new access token' })
  accessToken?: string;
}

export class ChangePasswordInput {
  @ApiProperty({ description: 'old password' })
  oldPassword: string;
  @ApiProperty({ description: 'new password' })
  newPassword: string;
  @ApiProperty({ description: 'confirm new password' })
  confirmNewPassword: string;
}

export class ChangePasswordOutput extends CoreOutput {}
export class ForgotPasswordInput {
  @ApiProperty({ description: 'username' })
  @IsString()
  name?: string;
  @ApiProperty({ description: 'email' })
  @IsString()
  email?: string;
}
export class ForgotPasswordOutput extends CoreOutput {}
