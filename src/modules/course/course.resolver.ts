import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/role.decorator';
import { CourseService } from './course.servive';
import {
  CreateCourseInput,
  CreateCourseOutput,
  DetailCourseOutput,
  ListCourseOutput,
  ListOverviewNotitiaWebOutput,
  UpdateCourseInput,
  UpdateCourseOutput,
} from './course.dto';
import { CurrentUser } from '../auth/user.decorator';
import { User } from 'src/entities/user.entity';
import { CoreOutput } from '../common/output.dto';
import { ListCourseStudentOutput } from '../courseStudent/courseStudent.dto';

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
    summary: 'List Course of Professor',
  })
  @Roles(['Professor'])
  @Get('/professor/list')
  @ApiOkResponse({ type: ListCourseOutput })
  async listCourseProfessor(
    @CurrentUser() user: User,
  ): Promise<ListCourseOutput> {
    return this.courseService.listCourseProfessor(user);
  }
  @ApiOperation({
    summary: 'List Course ',
  })
  @Roles(['Any'])
  @Get('/list')
  @ApiOkResponse({ type: ListCourseOutput })
  async listCourse(): Promise<ListCourseOutput> {
    return this.courseService.listCourse();
  }
  @ApiOperation({
    summary: 'Detail course ',
  })
  @ApiOperation({
    summary: 'Top List Course ',
  })
  @Roles(['Professor', 'Admin'])
  @Get('/stats/list/:id')
  @ApiOkResponse({ type: ListCourseStudentOutput })
  async listCourseStats(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ListCourseStudentOutput> {
    return this.courseService.listOverviewNotitiaCourse(id, user);
  }
  @ApiOperation({
    summary: 'Detail course ',
  })
  @Roles(['Any'])
  @Get('detail/:id')
  @ApiOkResponse({ type: DetailCourseOutput })
  async detailCourse(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DetailCourseOutput> {
    return this.courseService.detailCourse(id);
  }
  @ApiOperation({
    summary: 'Delete course',
  })
  @Roles(['Professor'])
  @Delete('delete/:id')
  @ApiOkResponse({ type: CoreOutput })
  async deleteCourse(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CoreOutput> {
    return this.courseService.deleteCourse(user, id);
  }
  @ApiOperation({
    summary: 'Update course',
  })
  @Roles(['Professor'])
  @Put('update')
  @ApiOkResponse({ type: UpdateCourseOutput })
  async updateCourse(
    @CurrentUser() user: User,
    @Body() input: UpdateCourseInput,
  ): Promise<UpdateCourseOutput> {
    return this.courseService.updateCourse(user, input);
  }
  @ApiOperation({
    summary: 'list Overview Notitia Web',
  })
  @Roles(['Any'])
  @Get('overview')
  @ApiOkResponse({ type: ListOverviewNotitiaWebOutput })
  async listOverviewNotitiaWeb(): Promise<ListOverviewNotitiaWebOutput> {
    return this.courseService.listOverviewNotitiaWeb();
  }
}
