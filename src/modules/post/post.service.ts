import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, Between, In } from 'typeorm';
import { createError } from '../common/utils/createError';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import {
  CreatePostInput,
  CreatePostOutput,
  DeletePostInput,
  DeletePostOutput,
  ListPostOfLessonOutput,
  ListPublicPostOutput,
  NumberPostComment,
  UpdatePostInput,
  UpdatePostOutput,
} from './post.dto';
import { Comment } from 'src/entities/comment.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { Course } from 'src/entities/course.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>,
  ) {}

  async createPost(
    owner: User,
    input: CreatePostInput,
  ): Promise<CreatePostOutput> {
    try {
      const { content, file, lessonId } = input;
      const lesson = await this.lessonRepo.findOne({
        where: {
          id: lessonId,
        },
      });
      if (!lesson) return createError('Input', 'Lesson does not exist');
      await this.postRepo.save(
        this.postRepo.create({
          content,
          file,
          owner,
          lesson,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }

  async deletePost(
    owner: User,
    input: DeletePostInput,
  ): Promise<DeletePostOutput> {
    try {
      const { postId } = input;
      const post = await this.postRepo.findOne({
        where: { id: postId },
        relations: {
          comments: true,
          owner: true,
        },
      });
      console.log(post);

      console.log(post?.owner?.id);
      console.log(owner?.id);

      if (post?.owner?.id != owner?.id)
        return createError('Input', 'Yêu cầu không hợp lệ');
      const comments = await this.commentRepo.find({
        where: { post: { id: postId } },
        relations: {
          post: true,
        },
      });
      await this.commentRepo.remove(comments);
      if (!post) return createError('Input', 'Bài viết này không còn tồn tại');
      await this.postRepo.remove(post);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  //thay đổi bài đăng
  async updatePost(
    owner: User,
    input: UpdatePostInput,
  ): Promise<UpdatePostOutput> {
    try {
      const { postId, content, file } = input;
      const post = await this.postRepo.findOne({
        where: { id: postId },
        relations: {
          comments: true,
          owner: true,
        },
      });
      if (post.owner.id !== owner.id)
        return createError(
          'Input',
          'Bạn không có quyền cập nhật bài đăng của người khác',
        );

      if (!post) return createError('Input', 'Bài đăng này không còn tồn tại');
      post.content = content;
      post.file = file;
      await this.postRepo.save(post);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  //danh sach bai dang cong khai
  async listPostCourse(courseId: number): Promise<ListPublicPostOutput> {
    try {
      // Calculate date 10 days ago
      const now = new Date();
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
      const course = await this.courseRepo.findOne({
        where: {
          id: courseId,
        },
        relations: { lessons: true },
      });
      if (!course)
        return createError(
          'Input',
          'Không thể xem chi tiết bài đăng của khóa học không tồn tại',
        );
      const lessonId = course.lessons.map((l) => l.id);
      const posts = await this.postRepo.find({
        where: {
          createdAt: Between(tenDaysAgo, now), // Use Between operator to filter posts created within the last 10 days
          lesson: { id: In(lessonId) },
        },
        relations: {
          owner: true,
          comments: {
            owner: true,
          },
          lesson: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      return {
        ok: true,
        posts,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  // xem danh sách bài viết công khai của người khác
  async listPostOfLesson(
    owner: User,
    lessonId: number,
  ): Promise<ListPostOfLessonOutput> {
    try {
      const posts = await this.postRepo.find({
        where: {
          lesson: { id: lessonId },
        },
        relations: {
          owner: true,
          comments: {
            owner: true,
          },
          lesson: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      return {
        ok: true,
        posts,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
  async numberNewPost(lessonId: number): Promise<NumberPostComment> {
    try {
      const now = new Date();
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

      const [posts, numberPost] = await this.postRepo.findAndCount({
        where: {
          createdAt: Between(tenDaysAgo, now), // Use Between operator to filter posts created within the last 10 days
          lesson: {
            id: lessonId,
          },
        },
        relations: {
          lesson: true,
          owner: true,
          comments: {
            owner: true,
          },
        },
      });
      let numberComment = 0;
      posts.forEach((post) => (numberComment += post.comments.length));
      return {
        ok: true,
        numberPost,
        numberComment,
      };
    } catch (error) {
      console.log(error);
      return createError('Server', 'Lỗi server, thử lại sau');
    }
  }
}
