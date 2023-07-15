import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserInput, CreateUserOutput, GetInfoStudent } from './student.dto';
import { StudentService } from './student.servive';
import { Roles } from '../auth/role.decorator';
import { User } from 'src/entities/user.entity';
import { CurrentUser } from '../auth/user.decorator';

@ApiTags('Student')
@Controller('/student')
@ApiSecurity('admin')
export class StudentResolver {
  constructor(private readonly StudentService: StudentService) { }

  @ApiOperation({
    summary: 'Get Info student',
  })
  @Roles(['Any']) //Any
  @Get('profile')
  @ApiOkResponse({ type: GetInfoStudent })
  async getInfo(@CurrentUser() input: User): Promise<CreateUserOutput> {
    return this.StudentService.getInfo(input);
  }

  @ApiOperation({
    summary: 'Create User',
  })
  @Roles(['Any']) //Any
  @Post('create')
  @ApiOkResponse({ type: CreateUserOutput })
  async registerUser(
    @Body() input: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.StudentService.createUser(input);
  }
  // async xoasinhvien(@Body() input )
}
