import { ApiParam, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from 'src/core';

export class MessageFloatingPopulationDto {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  hdongName: string;
}
