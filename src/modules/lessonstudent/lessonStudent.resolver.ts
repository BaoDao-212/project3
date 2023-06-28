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
  UpdateLessonStudentInput,
  UpdateLessonStudentOutput,
} from './lessonStudent.dto';
import { LessonStudentService } from './lessonStudent.servive';

@ApiTags('LessonStudent')
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
  async createLesson(
    @CurrentUser() user: User,
    @Body() input: CreateLessonStudentInput,
  ): Promise<CreateLessonStudentOutput> {
    return this.lessonStudentService.createLessonStudent(user, input);
  }
  @ApiOperation({
    summary: 'Update lesson student',
  })
  @Roles(['Any'])
  @Post('change')
  @ApiOkResponse({ type: UpdateLessonStudentOutput })
  async updateLesson(
    @CurrentUser() user: User,
    @Body() input: UpdateLessonStudentInput,
  ): Promise<CreateLessonStudentOutput> {
    return this.lessonStudentService.updateLessonStudent(user, input);
  }
}
