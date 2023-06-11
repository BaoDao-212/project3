import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/role.decorator';
import { CreateLessonOutput, CreateLessonInput } from './lesson.dto';
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
}
