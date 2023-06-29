import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { CreateUserInput, CreateUserOutput } from './student.dto';
import { Student } from 'src/entities/student.entity';
import { Professor } from 'src/entities/professor.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Professor)
    private readonly professorRepo: Repository<Professor>,
  ) {}

  async createUser(input: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const { userId } = input;
      const user = await this.userRepo.findOne({
        where: {
          id: userId,
        },
      });
      if (!user) return createError('Input', 'Người dùng này không tồn tại');
      const student = await this.studentRepo.findOne({
        where: {
          user: { id: userId },
        },
        relations: {
          user: true,
        },
      });
      const professor = await this.professorRepo.findOne({
        where: {
          user: { id: userId },
        },
        relations: {
          user: true,
        },
      });
      if (professor)
        return createError(
          'Input',
          'User này đã được cấp quyền Professor trước đó',
        );
      if (student) return createError('Input', 'Student này đã tồn tại');
      const userH = this.studentRepo.create({
        averageMark: 0,
        class: input.class,
        user,
      });
      await this.studentRepo.save(userH);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
 

}
