import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CoreOutput } from 'src/modules/common/output.dto';
import { StoredFile } from '../upload/object/StoredFile';
import { Comment } from 'src/entities/comment.entity';

export class CreateCommentInput {
  @ApiProperty({ description: 'post id of this comment' })
  @IsNumber()
  postId: number;

  @ApiProperty({ description: 'content of this Comment' })
  @IsString()
  contentComment: string;

  @ApiProperty({
    description: 'limit user can see this Comment of this comment',
    type: [StoredFile],
  })
  @ValidateNested()
  @IsOptional()
  file?: Array<StoredFile>;
}
export class CreateCommentOutput extends CoreOutput {}
//xóa bình luận
export class DeleteCommentInput {
  @ApiProperty({ description: 'comment id  of post delete' })
  commentId: number;
}
export class DeleteCommentOutput extends CoreOutput {}
//thay đổi bình luận
export class UpdateCommentInput {
  @ApiProperty({ description: 'comment id  of post update' })
  @IsNumber()
  commentId: number;

  @ApiProperty({ description: 'content of this Comment' })
  @IsString()
  contentComment?: string;

  @ApiProperty({
    description: 'limit user can see this Comment of this comment',
    type: [StoredFile],
  })
  @ValidateNested()
  @IsOptional()
  file?: Array<StoredFile>;
}
export class UpdateCommentOutput extends CoreOutput {}
//xem đanh sách bình luận của bài viết
export class ListCommentPostInput {
  @ApiProperty({ description: 'post id  of post to show comment' })
  @IsNumber()
  postId: number;
}
export class ListCommentPostOutput extends CoreOutput {
  @ApiProperty({ description: 'list comment output' })
  comments?: Comment[];
}
