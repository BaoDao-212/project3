import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StoredFile {
  @ApiProperty({ description: 'file Url' })
  @IsString()
  fileUrl: string;

  @ApiProperty({ description: 'file Path' })
  @IsString()
  filePath: string;
}
