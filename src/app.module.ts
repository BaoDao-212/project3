import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/postgresql.module';
import { AuthModule } from './modules/auth/auth.module';
import { getConfiguration } from './modules/common/config/config';
import { StudentModule } from './modules/student/student.module';
import { ProfessorModule } from './modules/professor/professor.module';
import { UserModule } from './modules/user/user.module';
import { CompileModule } from './modules/compile/compile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [getConfiguration],
    }),
    DatabaseModule,
    AuthModule,
    StudentModule,
    ProfessorModule,
    UserModule,
    CompileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
