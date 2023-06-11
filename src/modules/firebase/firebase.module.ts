import { DynamicModule, Module } from '@nestjs/common';
import { FirebaseConfigOption } from './constants/constants';
import { FirebaseService } from './firebase.service';
import { FIREBASE_CONFIG_OPTIONS } from '../common/constants/constants';

@Module({})
export class FirebaseModule {
  static forRoot(options: FirebaseConfigOption): DynamicModule {
    return {
      module: FirebaseModule,
      global: true,
      providers: [
        {
          provide: FIREBASE_CONFIG_OPTIONS,
          useValue: options,
        },
        FirebaseService,
      ],
      exports: [FirebaseService],
    };
  }
}
