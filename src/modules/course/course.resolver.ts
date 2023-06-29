import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/role.decorator';
import { CourseService } from './course.servive';
import { ChangeCourseInput, ChangeCourseOutput, CreateCourseInput, CreateCourseOutput, GetInfoCourseOutput } from './course.dto';
import { CurrentUser } from '../auth/user.decorator';
import { User } from 'src/entities/user.entity';

@ApiTags('Course')
@Controller('/course')
@ApiSecurity('admin')
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}
  @ApiOperation({
    summary: 'Create Course',
  })
  @Roles(['Professor'])
  @Post('create')
  @ApiOkResponse({ type: CreateCourseOutput })
  async createCourse(
    @CurrentUser() user: User,
    @Body() input: CreateCourseInput,
  ): Promise<CreateCourseOutput> {
    return this.courseService.createCourse(user, input);
  }

  @ApiOperation({
    summary: 'Get list Course',
  })
  @Roles(['Any'])
  @Get('list-course')
  @ApiOkResponse({ type: GetInfoCourseOutput })
  async getInfoCourse(
  ): Promise<GetInfoCourseOutput> {
    return this.courseService.getInfoCourse();
  }

  @ApiOperation({
    summary: 'Change Course',
  })
  @Roles(['Professor'])
  @Post('change')
  @ApiOkResponse({ type: ChangeCourseOutput })
  async changeCourse(
    @CurrentUser() user: User,
    @Body() input: ChangeCourseInput,
  ) {
    return this.courseService.changeCourse(user,input);
  }
}

