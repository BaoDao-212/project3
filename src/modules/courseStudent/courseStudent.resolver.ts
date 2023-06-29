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
import { CourseStudentService } from './courseStudent.servive';

import {
  CreateCourseStudentInput,
  CreateCourseStudentOutput,
} from './courseStudent.dto';

@ApiTags('CourseStudent')
@Controller('/courseStudent')
@ApiSecurity('admin')
export class CourseStudentResolver {
  constructor(private readonly courseStudentService: CourseStudentService) {}
  @ApiOperation({
    summary: 'Create couse student',
  })
  @Roles(['Any'])
  @Post('create')
  @ApiOkResponse({ type: CreateCourseStudentOutput })
  async createLesson(
    @CurrentUser() user: User,
    @Body() input: CreateCourseStudentInput,
  ): Promise<CreateCourseStudentOutput> {
    return this.courseStudentService.createCourseStudent(user, input);
  }
  // @ApiOperation({
  //   summary: 'Update lesson student',
  // })
  // @Roles(['Any'])
  // @Post('change')
  // @ApiOkResponse({ type: UpdateLessonStudentOutput })
  // async updateLesson(
  //   @CurrentUser() user: User,
  //   @Body() input: UpdateLessonStudentInput,
  // ): Promise<CreateLessonStudentOutput> {
  //   return this.lessonStudentService.updateLessonStudent(user, input);
  // }
}
