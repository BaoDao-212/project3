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
import {
  CreateLessonStudentInput,
  CreateLessonStudentOutput,
  DetailLessonStudentOutput,
  ListLessonStudentOutput,
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
  async updateLessonStudent(
    @CurrentUser() user: User,
    @Body() input: UpdateLessonStudentInput,
  ): Promise<CreateLessonStudentOutput> {
    return this.lessonStudentService.updateLessonStudent(user, input);
  }
  @ApiOperation({
    summary: 'Detail lesson student',
  })
  @Roles(['Any'])
  @Get('detail/:id')
  @ApiOkResponse({ type: DetailLessonStudentOutput })
  async detailLessonStudent(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DetailLessonStudentOutput> {
    return this.lessonStudentService.detailLessonStudent(user, id);
  }
  @ApiOperation({
    summary: 'List Lesson Student',
  })
  @Roles(['Student'])
  @Get('list/:id')
  @ApiOkResponse({ type: ListLessonStudentOutput })
  async listLessonStudent(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ListLessonStudentOutput> {
    return this.lessonStudentService.listLessonStudent(user, id);
  }
}
