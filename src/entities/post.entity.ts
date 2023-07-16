import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { User } from './user.entity';
import { StoredFile } from 'src/modules/upload/object/StoredFile';
import { Comment } from 'src/entities/comment.entity';
import { Lesson } from './lesson.entity';

@Entity({ name: 'Post' })
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  owner: User;

  @ApiProperty()
  @ManyToOne(() => Lesson, (lesson) => lesson.id)
  @JoinColumn()
  lesson: Lesson;

  @ApiProperty()
  @OneToMany(() => Comment, (comment) => comment.post, { nullable: true })
  comments?: Comment[];

  @Column({ type: 'jsonb', array: false, default: () => "'[]'" })
  @ApiProperty()
  content: object[];

  @ApiProperty()
  @Column({ type: 'jsonb', array: false, default: () => "'[]'" })
  @ValidateNested()
  @IsOptional()
  file?: Array<StoredFile>;
}
