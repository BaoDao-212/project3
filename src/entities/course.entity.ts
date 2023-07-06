import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from './base.entity';

import {

  PrimaryGeneratedColumn,

  Column,

  Entity,

  OneToOne,

  ManyToOne,

  JoinColumn,

  OneToMany,

} from 'typeorm';

import { Professor } from './professor.entity';

import { Lesson } from './lesson.entity';

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

  @ManyToOne(() => Professor, (pro) => pro.id)

  professor: Professor;




  @ApiProperty()

  @OneToMany(() => Lesson, (lesson) => lesson.course)

  lessons?: Lesson[];




  @Column()

  @ApiProperty()

  name: string;




  @Column({ nullable: true })

  @ApiProperty()

  language: Language;


  @Column({ type: 'jsonb', array: false, default: () => "'[]'" })
  @ApiProperty()
  description: object[];


  @Column({ nullable: true })

  @ApiProperty()

  numberLesson: number;




  @Column({ nullable: true })

  @ApiProperty()

  time: number;

}