import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.servive';
import { Roles } from '../auth/role.decorator';
import { CurrentUser } from '../auth/user.decorator';
import { User } from 'src/entities/user.entity';
import {
  ChangePasswordInput,
  ChangePersonalInfoInput,
  ChangePasswordOutput,
  ChangePersonalInfoOutput,
  GetInfoOutput,
} from './user.dto';

@ApiTags('Account')
@Controller('/account')
@ApiSecurity('admin')
export class UserResolver {
  constructor(private readonly userService: UserService) { }
  @ApiOperation({
    summary: 'info user',
  })
  @Roles(['Any'])
  @Get('info')
  @ApiOkResponse({ type: GetInfoOutput })
  async getInfo(@CurrentUser() input: User) {
    console.log(input);
    return this.userService.getInfo(input);
  }

  @Roles(['Any'])
  @Put('/change-profile')
  @ApiOkResponse({ type: ChangePersonalInfoOutput })
  async changePersonalInfo(
    @CurrentUser() user: User,
    @Body() input: ChangePersonalInfoInput,
  ) {
    return this.userService.changePersonalInfo(user, input);
  }

  @Roles(['Any'])
  @Post('/change-password')
  @ApiOkResponse({ type: ChangePasswordOutput })
  async changePassword(
    @CurrentUser() user: User,
    @Body() input: ChangePasswordInput,
  ) {
    return this.userService.changePassword(user, input);
  }
}
