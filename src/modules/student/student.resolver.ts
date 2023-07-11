import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateUserInput,
  CreateUserOutput,
  ListStudentOutput,
} from './student.dto';
import { StudentService } from './student.servive';
import { Roles } from '../auth/role.decorator';

@ApiTags('Student')
@Controller('/student')
@ApiSecurity('admin')
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}
  @ApiOperation({
    summary: 'Create User',
  })
  @Roles(['Any']) //Any
  @Post('create')
  @ApiOkResponse({ type: CreateUserOutput })
  async registerUser(
    @Body() input: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.studentService.createUser(input);
  }
  @ApiOperation({
    summary: 'list student',
  })
  @Roles(['Professor', 'Admin']) //Any
  @Get('list')
  @ApiOkResponse({ type: ListStudentOutput })
  async listStudent(): Promise<ListStudentOutput> {
    return this.StudentService.listStudent();
  }
  // async xoasinhvien(@Body() input )
  
 
}
