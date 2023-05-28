import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
export class CustomError {
  @ApiProperty({ description: 'main reason' })
  @IsString()
  mainReason: string;

  @ApiProperty({ description: 'message' })
  @IsString()
  message: string;
}

export class CoreOutput {
  @ApiProperty({ description: 'oke' })
  @Type(() => Boolean)
  ok: boolean;

  @ApiProperty({ description: 'error object' })
  @Type(() => CustomError)
  error?: CustomError;
}
