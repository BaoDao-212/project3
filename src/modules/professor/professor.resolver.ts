import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/role.decorator';
import {  ChangeProfessorProFileInPut, ChangeProfessorProFileOutput, CreateProfessorInput, CreateProfessorOutput, GetListLessonsOutput, GetListOutput, GetProfessorProfileOutput } from './professor.dto';
import { ProfessorService } from './professor.servive';
import { User } from 'src/entities/user.entity';
import { CurrentUser } from '../auth/user.decorator';
import { Lesson } from 'src/entities/lesson.entity';
import { GetDeTailsOutput } from '../student/student.dto';

@ApiTags('Professor')
@Controller('/professor')
@ApiSecurity('admin')
export class ProfessorResolver {
  constructor(private readonly professorService: ProfessorService) {}
  @ApiOperation({
    summary: 'Create Professor',
  })
  @Roles(['Any'])
  @Post('create')
  @ApiOkResponse({ type: CreateProfessorOutput })
  async createProfessor(
    @Body() input: CreateProfessorInput,
  ): Promise<CreateProfessorOutput> {
    return this.professorService.createUser(input);
  }
  @ApiOperation({
    summary: 'Profile professor',
  })
  @Roles(['Professor'])
  @Get('profile')
  @ApiOkResponse({ type: GetProfessorProfileOutput })
  async getInfo(@CurrentUser() input: User) {
    return this.professorService.getProfessorProfile(input);
  }
  
  @ApiOperation({
    summary: 'Change Profile professor',
  })
  @Roles(['Professor'])
  @Post('/change-profile')
  @ApiOkResponse({ type: ChangeProfessorProFileOutput })
  async changechangeProfileProfessorProfile(
    @CurrentUser() user: User,
    @Body() input: ChangeProfessorProFileInPut,
  ) {
    return this.professorService.changeProfileProfessor(user,input);
  }
  @ApiOperation({
    summary: 'Get the list of lessons for a course by course name',
  })
  @Roles(['Professor'])
  @Get('/:courseId/list-lessons') // Use the courseName as a parameter in the URL
  @ApiOkResponse({ type: GetListLessonsOutput}) // Assuming the Lesson interface from the ProfessorService
  async getListLessonsByCourseName(
    @Param('courseId') courseId: number,
    @CurrentUser() input: User
  ){
    return this.professorService.getListLessonsByCourseName(courseId,input);
  }

  @ApiOperation({
    summary: 'Get list Professor',
  })
  @Roles(['Admin'])
  @Get('/list/admin') // Use the courseName as a parameter in the URL
  @ApiOkResponse({ type: GetListOutput}) 
  async getListProfessor(
    
  ){
    return this.professorService.getListProfessor();
  }

  @ApiOperation({
    summary: 'Get Details Professor',
  })
  @Roles(['Admin'])
  @Get('/details-professor/:id/admin') // Use the courseName as a parameter in the URL
  @ApiOkResponse({ type: GetDeTailsOutput}) 
  async getDetails(
    @Param('id') id: number,
    @CurrentUser() input: User
  ){
    return this.professorService.getDetails(id,input);
  }

}

