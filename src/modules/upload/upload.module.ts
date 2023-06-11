import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  imports: [FirebaseModule],
})
export class UploadModule {}
