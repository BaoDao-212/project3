import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Professor } from './professor.entity';
export enum Language {
  Cpp = 'Cpp',
  C = 'C',
  Java = 'Java',
  Python = 'Python',
}
@Entity({ name: 'course' })
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @JoinColumn()
  @OneToOne((type) => Professor, (pro) => pro.id)
  professor: Professor;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  language: Language;

  @Column({ nullable: true })
  @ApiProperty()
  description: string;
}
