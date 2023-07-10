import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { RunCodeInput, RunCodeOutput } from './compile.dto';
import { Language } from 'src/entities/course.entity';
import { cpp, java, python, c } from 'compile-run';
@Injectable()
export class CompileService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async runCode(input: RunCodeInput): Promise<RunCodeOutput> {
    try {
      const { code, language, inputString } = input;

      let res;
      const decodedCode = decodeURIComponent(code);
      console.log(decodedCode);
      console.log(input);

      if (language === Language.C) {
        res = await c.runSource(decodedCode, { stdin: inputString });
      } else if (language === Language.Cpp) {
        res = await cpp.runSource(decodedCode, { stdin: inputString });
      } else if (language === Language.Python) {
        res = await python.runSource(decodedCode, { stdin: inputString });
      } else if (language === Language.Java) {
        res = await java.runSource(decodedCode, { stdin: inputString });
      }
      console.log(res);

      return {
        ok: true,
        cpuUsage: res.cpuUsage,
        exitCode: res.exitCode,
        memoryUsage: res.memoryUsage,
        signal: res.signal,
        stderr: res.stderr,
        errorType: res.errorType,
        stdout: res.stdout.replace(/\r?\n$/, ''),
      };
    } catch (error) {
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
