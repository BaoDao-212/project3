import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { Post } from 'src/entities/post.entity';
import { Comment } from 'src/entities/comment.entity';
import { Lesson } from 'src/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Comment, Lesson])],
  providers: [PostResolver, PostService],
  controllers: [PostResolver],
})
export class PostModule {}
