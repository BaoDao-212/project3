import {
  Body,
  Controller,
  Delete,
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
import {
  CreateLessonOutput,
  CreateLessonInput,
  DetailLessonOutput,
  DeleteLessonOutput,
} from './lesson.dto';
import { CurrentUser } from '../auth/user.decorator';
import { User } from 'src/entities/user.entity';
import { LessonService } from './lesson.servive';

@ApiTags('Lesson')
@Controller('/lesson')
@ApiSecurity('admin')
export class LessonResolver {
  constructor(private readonly lessonService: LessonService) {}
  @ApiOperation({
    summary: 'Create lesson',
  })
  @Roles(['Professor'])
  @Post('create')
  @ApiOkResponse({ type: CreateLessonOutput })
  async createlesson(
    @CurrentUser() user: User,
    @Body() input: CreateLessonInput,
  ): Promise<CreateLessonOutput> {
    return this.lessonService.createLesson(user, input);
  }
  @ApiOperation({
    summary: 'Detail lesson ',
  })
  @Roles(['Any'])
  @Get('detail/:id')
  @ApiOkResponse({ type: DetailLessonOutput })
  async detailLesson(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DetailLessonOutput> {
    return this.lessonService.detailLesson(id);
  }
  @ApiOperation({
    summary: 'Delete lesson ',
  })
  @Roles(['Professor'])
  @Delete('delete/:id')
  @ApiOkResponse({ type: DeleteLessonOutput })
  async deleteLesson(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteLessonOutput> {
    return this.lessonService.deleteLesson(user, id);
  }
}
