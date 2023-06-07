import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateUserInput, CreateUserOutput } from './student.dto';
import { StudentService } from './student.servive';
import { Roles } from '../auth/role.decorator';

@ApiTags('Student')
@Controller('/student')
@ApiSecurity('admin')
export class StudentResolver {
  constructor(private readonly StudentService: StudentService) {}
  @ApiOperation({
    summary: 'Create User',
  })
  @Roles(['Any'])
  @Post('create')
  @ApiOkResponse({ type: CreateUserOutput })
  async registerUser(
    @Body() input: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.StudentService.createUser(input);
  }
}
