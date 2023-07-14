import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { CreateUserInput, CreateUserOutput, GetDeTailsOutput } from './student.dto';
import { Student } from 'src/entities/student.entity';
import { Professor } from 'src/entities/professor.entity';
import { CourseStudent } from 'src/entities/contant/courseStudent';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Professor)
    private readonly professorRepo: Repository<Professor>,
    @InjectRepository(CourseStudent)
    private readonly courseStudentRepo: Repository<CourseStudent>,
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
 
  async getDetails(Id:number,input:User): Promise<GetDeTailsOutput> {
    try {
      const user=await this.userRepo.findOne({
        where:{
          id:input.id,
        },
      })
      if(user.position==='Admin'){
             const student=await this.studentRepo.findOne({
              where:{
                id:Id,
              },
              relations:{
                user:true,
              }
             }) 
             const numbers=await this.courseStudentRepo.count({
              where:{
                student:{
                  user:{
                    id:Id,
                  }
                }
              }
             })    
              return {
                ok: true,
                student,
                numbers,
              };      
      }
      else{
        return createError('Input', 'Lỗi server, thử lại sau');
      }

      
  }catch (error) {
    console.log(error);
    return createError('Server', 'Lỗi server, thử lại sau');
  }
}
}
