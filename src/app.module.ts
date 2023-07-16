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
import { CourseModule } from './modules/course/course.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { UploadModule } from './modules/upload/upload.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { LessonStudentModule } from './modules/lessonstudent/lessonStudent.module';
import { CourseStudentModule } from './modules/courseStudent/courseStudent.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [getConfiguration],
    }),
    FirebaseModule.forRoot({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      appId: process.env.FIREBASE_APP_ID,
    }),
    DatabaseModule,
    AuthModule,
    StudentModule,
    ProfessorModule,
    UserModule,
    CompileModule,
    CourseModule,
    LessonModule,
    UploadModule,
    LessonStudentModule,
    CourseStudentModule,
    UserModule,
    PostModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
