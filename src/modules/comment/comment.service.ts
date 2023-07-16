import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Comment } from 'src/entities/comment.entity';
import { Repository, In } from 'typeorm';
import { createError } from '../common/utils/createError';
import {
  CreateCommentInput,
  CreateCommentOutput,
  DeleteCommentInput,
  DeleteCommentOutput,
  ListCommentPostInput,
  ListCommentPostOutput,
  UpdateCommentInput,
  UpdateCommentOutput,
} from './comment.dto';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createComment(
    owner: User,
    input: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    try {
      const { contentComment, postId, file } = input;
      const post = await this.postRepo.findOne({
        where: {
          id: postId,
        },
      });
      if (!post) return createError('Input', 'Không tồn tại bài đăng này nữa');
      const CommentH = this.commentRepo.create({
        contentComment,
        file,
        owner,
        post,
      });

      console.log(CommentH);

      await this.commentRepo.save(CommentH);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async deleteComment(
    owner: User,
    commentId: number,
  ): Promise<DeleteCommentOutput> {
    try {
      const comment = await this.commentRepo.findOne({
        where: { id: commentId },
        relations: {
          owner: true,
          post: true,
        },
      });
      const post = await this.postRepo.findOne({
        where: {
          id: comment.post.id,
        },
        relations: { comments: true, owner: true },
      });
      if (owner.id != post.owner.id && comment.owner.id !== owner.id)
        return createError(
          'Input',
          'Bạn không có quyền xóa bình luận của người khác',
        );

      if (!comment)
        return createError('Input', 'Bình luận này không còn tồn tại');
      console.log(comment.post);
      if (!post) return createError('Input', 'Lỗi truy cập không hợp lệ');
      post.comments = post.comments.filter((com) => com.id !== comment.id);
      await this.postRepo.save(post);
      const data = await this.commentRepo.delete({ id: comment.id });
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  //thay đổi bình luận
  async updateComment(
    owner: User,
    input: UpdateCommentInput,
  ): Promise<UpdateCommentOutput> {
    try {
      const { commentId, contentComment, file } = input;
      const comment = await this.commentRepo.findOne({
        where: { id: commentId },
        relations: {
          owner: true,
        },
      });
      if (comment.owner !== owner)
        return createError(
          'Input',
          'Bạn không có quyền xóa bình luận của người khác',
        );
      let userTags: User[];

      if (!comment)
        return createError('Input', 'Bình luận này không còn tồn tại');
      comment.contentComment = contentComment;
      comment.file = file;
      await this.commentRepo.save(comment);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  //xem tất cả bình luận của một bài viết
  async listCommentUser(
    owner: User,
    input: ListCommentPostInput,
  ): Promise<ListCommentPostOutput> {
    try {
      const post = await this.postRepo.findOne({
        where: {
          id: input.postId,
        },
      });
      if (!post)
        return createError(
          'Input',
          'Lỗi truy cập, bài viết này không còn tồn tại',
        );
      const comments = await this.commentRepo.find({
        where: {
          post: {
            id: input.postId,
          },
        },
        relations: {
          owner: true,
          post: true,
        },
        order: {
          createdAt: 'ASC',
        },
      });
      return {
        ok: true,
        comments,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
