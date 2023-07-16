import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';

import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  deleteObject,
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  UploadMetadata,
} from 'firebase/storage';
import * as sharp from 'sharp';
import { v1 } from 'uuid';
import { FirebaseConfigOption } from './constants/constants';
import { FIREBASE_CONFIG_OPTIONS } from '../common/constants/constants';

@Injectable()
export class FirebaseService {
  private readonly firebaseApp: FirebaseApp;
  private readonly storage: FirebaseStorage;
  constructor(
    @Inject(FIREBASE_CONFIG_OPTIONS) configOption: FirebaseConfigOption,
  ) {
    const firebaseConfig = {
      apiKey: 'AIzaSyB9nRbQwcxKpHJ3ShmyWNoWkXspuwcqZ2s',
      authDomain: 'webblog-bk.firebaseapp.com',
      projectId: 'webblog-bk',
      storageBucket: 'webblog-bk.appspot.com',
      messagingSenderId: '167558770988',
      appId: '1:167558770988:web:25583d41a1a29e565d7c89',
      measurementId: 'G-W99PKR18WY',
    };
    this.firebaseApp = initializeApp(firebaseConfig);
    this.storage = getStorage(this.firebaseApp);
  }
  async uploadFile(file: Express.Multer.File, storagePath: string) {
    try {
      let storageName;
      let metatdata: UploadMetadata;
      let buffer;
      if (storagePath == 'image') {
        metatdata = {
          contentType: 'image/webp',
        };
        storageName = `${v1()}.webp`;
        buffer = await sharp(file.buffer)
          .webp({
            quality: 60,
          })
          .toBuffer();
      } else if (storagePath == 'video') {
        metatdata = {
          contentType: 'video/mp4',
        };
        storageName = `${v1()}.mp4`;
        buffer = file.buffer;
      }
      const storageRef = await ref(
        this.storage,
        `${storagePath}/${storageName}`,
      );
      if (buffer.byteLength > 50 * 1024 * 1024) {
        throw new ServiceUnavailableException(
          'Không thể tải file lên, Quá dung lượng cho phép',
        );
        return;
      }
      const result = await uploadBytes(storageRef, buffer, metatdata);
      const fileUrl = await getDownloadURL(result.ref);
      return {
        fileReference: {
          fileUrl,
          filePath: result.ref.fullPath,
        },
      };
    } catch (error) {
      throw new ServiceUnavailableException(
        'Không thể tải file lên, thử lại sau',
      );
    }
  }
  async uploadFiles(files: Express.Multer.File[], storagePath) {
    try {
      const results = await Promise.all(
        files.map((file) => this.uploadFile(file, storagePath)),
      );
      const fileReferences = results.map(
        ({ fileReference: { filePath, fileUrl } }) => ({ fileUrl, filePath }),
      );

      return {
        fileReferences,
      };
    } catch {
      throw new ServiceUnavailableException(
        'Không thể tải ảnh lên, thử lại sau',
      );
    }
  }
  async deleteFile(storagePathName: string) {
    try {
      const storageRef = ref(this.storage, storagePathName);
      await deleteObject(storageRef);
    } catch {
      throw new ServiceUnavailableException('Không thể xoá file, thử lại sau');
    }
  }
  async deleteFiles(storagePaths: string[]) {
    try {
      await Promise.all(storagePaths.map((p) => this.deleteFile(p)));
    } catch (err) {
      throw new ServiceUnavailableException('Không thể xoá file, thử lại sau');
    }
  }
}
