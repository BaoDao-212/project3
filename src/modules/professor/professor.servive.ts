import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Professor } from 'src/entities/professor.entity';
import {  ChangeProfessorProFileInPut, CreateProfessorInput, CreateProfessorOutput, GetProfessorProfileOutput } from './professor.dto';
import { Student } from 'src/entities/student.entity';

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepo: Repository<User>,
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
  async getProfessorProfile(input: User): Promise<GetProfessorProfileOutput> {
    try {
      const user1= this.userRepo.findOne({
        where: {
          id: input.id,
        },
      });
      if (!user1) return createError('Input', 'Người dùng không hợp lệ');
      
      if (input.position==="Student")
        return createError(
          'Input',
          'User này là Student',
        );
      if(input.position==="Professor"){
        const professor=await this.professorRepo.findOne({
          where: {
           id : input.id
          },
          relations: {
            user: true,
          },
        })
      return {
          ok: true,
          professor: professor,
        };
      }
      // const professor = this.userRepo.findOne({
      //   where: {
      //     position:inpu
      //   },
      // });
      // if (!professor) return createError('Input', 'Người dùng không hợp lệ');
      
  }catch (error) {
    console.log(error);
    return createError('Server', 'Lỗi server, thử lại sau');
  }
}
async changeProfileProfessor(
    currentUser: User,
    input: ChangeProfessorProFileInPut,
){
  try {
  const { newAcademicLevel} = input;
    const professor = await this.professorRepo.findOne({
        where: { 
          id: currentUser.id
        }
      });
      if(!professor) return createError("Input","Người dùng không hợp lệ");
      if(professor){
        professor.academicLevel=newAcademicLevel;
        await this.professorRepo.save(professor);
      return {
        ok: true,
      };
      }
    }catch(error){
      return createError('Server', 'Lỗi server, thử lại sau');
    }
}
}