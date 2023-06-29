import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/role.decorator';
import {  ChangeProfessorProFileInPut, ChangeProfessorProFileOutput, CreateProfessorInput, CreateProfessorOutput, GetProfessorProfileOutput } from './professor.dto';
import { ProfessorService } from './professor.servive';
import { User } from 'src/entities/user.entity';
import { CurrentUser } from '../auth/user.decorator';

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
}
