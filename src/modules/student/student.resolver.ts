import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  GetDeTailsOutput,
} from './student.dto';
import { StudentService } from './student.servive';
import { Roles } from '../auth/role.decorator';
import { User } from 'src/entities/user.entity';
import { CurrentUser } from '../auth/user.decorator';

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
    return this.studentService.listStudent();
    return this.studentService.listStudent();
  }
  // async xoasinhvien(@Body() input )

  @ApiOperation({
    summary: 'Get details student by Id',
  })
  @Roles(['Admin']) //Any
  @Get('/details-student/:Id/admin') // Use the courseName as a parameter in the URL
  @ApiOkResponse({ type: GetDeTailsOutput }) // Assuming the Lesson interface from the ProfessorService
  async getDetails(@Param('Id') Id: number, @CurrentUser() input: User) {
    return this.studentService.getDetails(Id, input);
  }
}
