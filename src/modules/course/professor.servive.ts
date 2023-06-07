import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Professor } from 'src/entities/professor.entity';
import { Student } from 'src/entities/student.entity';
import {
  CreateProfessorInput,
  CreateProfessorOutput,
} from '../professor/professor.dto';

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Professor)
    private readonly professorRepo: Repository<Professor>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async createUser(
    input: CreateProfessorInput,
  ): Promise<CreateProfessorOutput> {
    try {
      const { userId, academicLevel } = input;
      const user = await this.userRepo.findOne({
        where: {
          id: userId,
        },
      });
      if (!user) return createError('Input', 'Người dùng này không tồn tại');
      const professor = await this.professorRepo.findOne({
        where: {
          user: { id: userId },
        },
        relations: {
          user: true,
        },
      });
      const student = await this.studentRepo.findOne({
        where: {
          user: { id: userId },
        },
        relations: {
          user: true,
        },
      });
      if (student)
        return createError(
          'Input',
          'User này đã được cấp quyền Student trước đó ',
        );
      if (professor) return createError('Input', 'Professor này đã tồn tại');
      const userH = this.professorRepo.create({
        user,
        academicLevel,
      });

      await this.professorRepo.save(userH);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
