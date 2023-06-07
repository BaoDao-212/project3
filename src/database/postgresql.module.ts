import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from 'src/entities/professor.entity';
import { Student } from 'src/entities/student.entity';
import { User } from 'src/entities/user.entity';
import { StudentModule } from 'src/modules/student/student.module';
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
      entities: [User, Student, Professor],
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
