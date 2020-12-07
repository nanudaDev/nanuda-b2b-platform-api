import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class EditedMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  message: string;
}
