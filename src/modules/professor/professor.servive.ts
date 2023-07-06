import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { createError } from '../common/utils/createError';
import { Professor } from 'src/entities/professor.entity';
import {  ChangeProfessorProFileInPut, CreateProfessorInput, CreateProfessorOutput, GetListLessonsOutput, GetProfessorProfileOutput } from './professor.dto';
import { Student } from 'src/entities/student.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { Course } from 'src/entities/course.entity';

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepo: Repository<User>,
    @InjectRepository(Lesson) 
    private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(Professor)
    private readonly professorRepo: Repository<Professor>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
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
async getListLessonsByCourseName(courseId:number,input: User):Promise <GetListLessonsOutput>{
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
    // const {courseName}=courseName1
    const professor=await this.professorRepo.findOne({
      where: {
       id : input.id
      },
      relations: {
        user: true,
      },
    })
    const course = await this.courseRepo.find({
      where:{
        professor:{
          id: input.id
        },
        id:courseId,
      },
      relations:{professor:true,lessons:true}
    });
    const lessons=await this.lessonRepo.find({
      where:{
        course:{
          id:courseId,
        }
      },
      relations:{
        course:true,
      }
    })
  return {
      ok: true,
      lessons:lessons,
    };
  }
} catch (error) {
  console.log(error);
    return createError('Server', 'Lỗi server, thử lại sau');
}
}
}
