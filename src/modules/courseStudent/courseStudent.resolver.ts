import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
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
  DetailCourseStudentOutput,
  ListCourseStudentOfProfessorOutput,
  ListCourseStudentOutput,
} from './courseStudent.dto';

@ApiTags('CourseStudent')
@Controller('/courseStudent')
@ApiSecurity('admin')
export class CourseStudentResolver {
  constructor(private readonly courseStudentService: CourseStudentService) {}
  @ApiOperation({
    summary: 'Create couse student',
  })
  @Roles(['Student'])
  @Post('create')
  @ApiOkResponse({ type: CreateCourseStudentOutput })
  async createCourseStudent(
    @CurrentUser() user: User,
    @Body() input: CreateCourseStudentInput,
  ): Promise<CreateCourseStudentOutput> {
    return this.courseStudentService.createCourseStudent(user, input);
  }
  @ApiOperation({
    summary: 'list couse student',
  })
  @Roles(['Student'])
  @Get('list')
  @ApiOkResponse({ type: ListCourseStudentOutput })
  async listCourseStudent(
    @CurrentUser() user: User,
  ): Promise<ListCourseStudentOutput> {
    return this.courseStudentService.listCourseStudent(user);
  }
  @ApiOperation({
    summary: 'list couse student for professor',
  })
  @Roles(['Professor'])
  @Get('/list-course-student/:id')
  @ApiOkResponse({ type: ListCourseStudentOfProfessorOutput })
  async listCourseStudentOfProfessor(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ListCourseStudentOfProfessorOutput> {
    return this.courseStudentService.listCourseStudentOfProfessor(id);
  }
  @ApiOperation({
    summary: 'Create couse student',
  })
  @Roles(['Student'])
  @Get('detail/:id')
  @ApiOkResponse({ type: DetailCourseStudentOutput })
  async detailsCourseStudent(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DetailCourseStudentOutput> {
    return this.courseStudentService.detailCourseStudent(user, id);
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
