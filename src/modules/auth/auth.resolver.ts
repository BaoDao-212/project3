import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import {
  LoginInput,
  LoginOutput,
  NewAccessTokenInput,
  NewAccessTokenOutput,
  RegisterUserInput,
  RegisterUserOutput,
  ChangePasswordInput,
  ChangePasswordOutput,
} from './dto/auth.dto';
import { Roles } from './role.decorator';
import { CurrentUser } from './user.decorator';
import {
  ApiBasicAuth,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('/auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({
    summary: 'Register User',
  })
  @Post('register')
  @ApiOkResponse({ type: RegisterUserOutput })
  async registerUser(
    @Body() input: RegisterUserInput,
  ): Promise<RegisterUserOutput> {
    return this.authService.registerUser(input);
  }

  @ApiOperation({
    summary: 'Login User',
  })
  @Post('/login')
  @ApiOkResponse({ type: LoginOutput })
  async login(@Body() input: LoginInput): Promise<LoginOutput> {
    return this.authService.login(input);
  }

  @ApiOperation({
    summary: 'New Access Token User',
  })
  @Get('/new-token')
  @ApiOkResponse({ type: NewAccessTokenOutput })
  async newAccessToken(
    @Body() input: NewAccessTokenInput,
  ): Promise<NewAccessTokenOutput> {
    return this.authService.newAccessToken(input);
  }

  @ApiOperation({
    summary: 'New Access Token User',
  })
  @Post('change-password')
  @ApiOkResponse({ type: ChangePasswordOutput })
  @ApiSecurity('admin')
  @Roles(['Any'])
  async changePassword(
    @CurrentUser() user: User,
    @Body() input: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    console.log(user);
    return this.authService.changePassword(user, input);
  }
}
