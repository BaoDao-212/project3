import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { CompileService } from './compile.servive';
import { CompileResolver } from './compile.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CompileService, CompileResolver],
  controllers: [CompileResolver],
})
export class CompileModule {}
