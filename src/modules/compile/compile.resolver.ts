import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/role.decorator';
import { CompileService } from './compile.servive';

import { RunCodeInput, RunCodeOutput } from './compile.dto';

@ApiTags('Compiler')
@Controller('/compiler')
// @ApiSecurity('admin')
export class CompileResolver {
  constructor(private readonly compileService: CompileService) {}
  @ApiOperation({
    summary: 'Run Code',
  })
  // @Roles(['Any'])
  @Post('/run')
  @ApiOkResponse({ type: RunCodeOutput })
  async createProfessor(@Body() input: RunCodeInput): Promise<RunCodeOutput> {
    return this.compileService.runCode(input);
  }
}
