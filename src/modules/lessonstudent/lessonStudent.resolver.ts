import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/role.decorator';
import { CurrentUser } from '../auth/user.decorator';
import { User } from 'src/entities/user.entity';
import {
  CreateLessonStudentInput,
  CreateLessonStudentOutput,
} from './lessonStudent.dto';
import { LessonStudentService } from './lessonStudent.servive';

@ApiTags('Lesson')
@Controller('/lessonStudent')
@ApiSecurity('admin')
export class LessonStudentResolver {
  constructor(private readonly lessonStudentService: LessonStudentService) {}
  @ApiOperation({
    summary: 'Create lesson student',
  })
  @Roles(['Any'])
  @Post('create')
  @ApiOkResponse({ type: CreateLessonStudentOutput })
  async createlesson(
    @CurrentUser() user: User,
    @Body() input: CreateLessonStudentInput,
  ): Promise<CreateLessonStudentOutput> {
    return this.lessonStudentService.createLessonStudent(user, input);
  }
}
