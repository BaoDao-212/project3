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
      const { code, language, inputArray, inputString } = input;
      const t = encodeURIComponent(
        `#include <stdio.h>
        int main() {
            int a=0, b=0, sum;
            sum = a + b;
            printf("Tổng hai số là: %d\\n", sum);
            return 0;
        }
        `,
      );
      console.log(t);
      let res;
      const decodedCode = decodeURIComponent(code);
      if (language === Language.C) {
        res = await c.runSource(decodeURIComponent(t));
      } else if (language === Language.Cpp) {
        res = await cpp.runSource(decodedCode);
      } else if (language === Language.Python) {
        res = await python.runSource(decodedCode);
      } else if (language === Language.Java) {
        res = await java.runSource(decodedCode);
      }
      console.log(res);

      return {
        ok: true,
        cpuUsage: res.cpuUsage,
        exitCode: res.exitCode,
        memoryUsage: res.memoryUsage,
        signal: res.signal,
        stderr: res.stderr,
        stdout: res.stdout.replace(/\r?\n$/, ''),
      };
    } catch (error) {
      return;
      // return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
