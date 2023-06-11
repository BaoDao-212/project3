import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/role.decorator';
import { CreateProfessorInput, CreateProfessorOutput } from './professor.dto';
import { ProfessorService } from './professor.servive';

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
}
