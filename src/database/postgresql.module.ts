import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { CourseStudent } from 'src/entities/contant/courseStudent';
import { LessonStudent } from 'src/entities/contant/lessonStudent';
import { Course } from 'src/entities/course.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { Post } from 'src/entities/post.entity';
import { Professor } from 'src/entities/professor.entity';
import { Student } from 'src/entities/student.entity';
import { User } from 'src/entities/user.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.production`, '.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'webcode',
      entities: [
        User,
        Student,
        Professor,
        Lesson,
        Course,
        CourseStudent,
        LessonStudent,
        Comment,
        Post,
      ],
      synchronize: true,
      ...(process.env.NODE_ENV === 'production'
        ? {
            ssl: true,
            extra: {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            },
          }
        : {}),
    }),
  ],
})
export class DatabaseModule {}
