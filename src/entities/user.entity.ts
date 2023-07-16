import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { compare, hash } from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  Column,
  Entity,
} from 'typeorm';
export enum Position {
  Admin = 'Admin',
  Student = 'Student',
  Professor = 'Professor',
}
@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ nullable: true })
  @ApiProperty()
  department?: string;

  @Column()
  @ApiProperty()
  name?: string;

  @Column({ unique: true })
  @ApiProperty()
  username: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column('enum', {
    enum: Position,
    default: Position.Student,
  })
  @ApiProperty()
  position?: Position;

  @Column({ nullable: true, default: '' })
  @ApiProperty()
  email?: string;


  @Column({ nullable: true, default: '' })
  @ApiProperty()
  phone?: string;

  // phương thức xử lí password
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;
    this.password = await hash(this.password, 12);
  }
  async checkPassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }
}
