import { ApiProperty } from '@nestjs/swagger';
import { IsString} from 'class-validator';
import { Lesson } from 'src/entities/lesson.entity';
import { Professor } from 'src/entities/professor.entity';
import { CoreOutput } from 'src/modules/common/output.dto';

export class CreateProfessorInput {
  @ApiProperty({ description: 'user' })
  @IsString()
  userId: number;

  @ApiProperty({ description: 'academic level' })
  @IsString()
  academicLevel: string;
}
export class CreateProfessorOutput extends CoreOutput {}


export class GetProfessorProfileOutput extends CoreOutput{
  @ApiProperty({ description: 'professor' })
  professor?: Professor;
}
export class ChangeProfessorProFileInPut{
  @ApiProperty({ description: 'new academicLevel' })
  @IsString()
  newAcademicLevel: string;
}
export class ChangeProfessorProFileOutput extends CoreOutput{
}

export class GetListLessonsOutput extends CoreOutput{
  @ApiProperty({ description: 'List Lesson' })
  lessons?: Lesson[];
}
export class GetListOutput extends CoreOutput{
  @ApiProperty({ description: 'List Professor' })
  professors?: Object[]
  // numbers?:number[];
}

export class GetDetailsProfessorOutput extends CoreOutput{
  @ApiProperty({ description: 'professor' })
  professor?: Professor;
  numbers?:number;
}