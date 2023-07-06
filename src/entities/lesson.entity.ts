import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Course } from './course.entity';
import { StoredFile } from 'src/modules/upload/object/StoredFile';
import { Type } from 'class-transformer';
export enum TypeLesson {
  MultipleChoice = 'MultipleChoice',
  Code = 'Code',
}
export enum TypeTheory {
  Text = 'Text',
  Media = 'Media',
  HighLightCode = 'HighLightCode',
}
export class Theory {
  @ApiProperty()
  theory: string|object;

  @ApiProperty({ enum: TypeTheory, default: TypeTheory.Text })
  typeTheory: TypeTheory;
}

@Entity({ name: 'lesson' })
export class Lesson extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @ManyToOne(() => Course, (course) => course.lessons)
  course: Course;

  @Column()
  @ApiProperty()
  @IsString()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  @IsString()
  type: TypeLesson;

  @Column({ type: 'jsonb', array: false, default: () => "'[]'" })
  @ApiProperty()
  @Type(() => Theory)
  theory: Array<Theory>;

  @Column({ nullable: true })
  @ApiProperty()
  @IsString()
  description: string;

  @Column({ nullable: true })
  @ApiProperty()
  @IsString()
  input?: string;

  @Column({ nullable: true })
  @ApiProperty()
  @IsString()
  exercise: string;

  @Column({ nullable: true })
  @ApiProperty()
  @IsString()
  answer: string;

  @ApiProperty()
  @Column({ type: 'jsonb', array: false, default: () => "'[]'" })
  @ValidateNested()
  @IsOptional()
  @Type(() => StoredFile)
  file?: Array<StoredFile>;
}
