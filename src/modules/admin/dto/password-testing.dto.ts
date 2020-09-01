import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PasswordTestDto {
  @ApiProperty()
  @Expose()
  password: string;
}
