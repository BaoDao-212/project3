import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/user.decorator';
import { User } from 'src/entities/user.entity';
import { PostService } from './post.service';
import {
  CreatePostInput,
  CreatePostOutput,
  DeletePostInput,
  DeletePostOutput,
  ListPostOfLessonInput,
  ListPostOfLessonOutput,
  ListPublicPostOutput,
  UpdatePostInput,
  UpdatePostOutput,
} from './post.dto';
import { Roles } from '../auth/role.decorator';

@ApiTags('Post')
@Controller('/post')
export class PostResolver {
  constructor(private readonly postService: PostService) {}
  @ApiOperation({
    summary: 'Create Post',
  })
  @Post('create')
  @Roles(['Any'])
  @ApiSecurity('admin')
  @ApiOkResponse({ type: CreatePostOutput })
  async createPost(
    @CurrentUser() user: User,
    @Body() input: CreatePostInput,
  ): Promise<CreatePostOutput> {
    console.log(input.file);

    return this.postService.createPost(user, input);
  }
  @ApiOperation({
    summary: 'Delete Post',
  })
  @Delete('delete')
  @Roles(['Any'])
  @ApiSecurity('admin')
  @ApiOkResponse({ type: DeletePostOutput })
  async deletePost(
    @CurrentUser() user: User,
    @Body() input: DeletePostInput,
  ): Promise<DeletePostOutput> {
    return this.postService.deletePost(user, input);
  }

  @ApiOperation({
    summary: 'Update Post',
  })
  @Roles(['Any'])
  @Put('update')
  @ApiSecurity('admin')
  @ApiOkResponse({ type: UpdatePostOutput })
  async updatePost(
    @CurrentUser() user: User,
    @Body() input: UpdatePostInput,
  ): Promise<UpdatePostOutput> {
    return this.postService.updatePost(user, input);
  }
  // xem list bài đăng công khai
  @ApiOperation({
    summary: 'List Post',
  })
  @Roles(['Any'])
  @ApiSecurity('admin')
  @Get('list')
  @ApiOkResponse({ type: ListPublicPostOutput })
  async listpublicPost(): Promise<ListPublicPostOutput> {
    return this.postService.listPublicPost();
  }
  // xem list bài đăng công khai của một cá nhân khi vào trang cá nhân của người đó
  @ApiOperation({
    summary: 'List Post',
  })
  @Roles(['Any'])
  @ApiSecurity('admin')
  @Get('lesson/list/:id')
  @ApiOkResponse({ type: ListPostOfLessonOutput })
  async listpublicUserPost(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ListPostOfLessonOutput> {
    return this.postService.listPostOfLesson(user, id);
  }
}
