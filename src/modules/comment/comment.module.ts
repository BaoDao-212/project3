import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { Comment } from 'src/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment, Post])],
  providers: [CommentResolver, CommentService],
  controllers: [CommentResolver],
})
export class CommentModule {}
