import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsIP, IsOptional, MinLength } from 'class-validator';
import { BaseDto } from 'src/core';
import { AttendeesOnline } from '../attendees-online.entity';

export class NanudaAttendeesOnlineCreateDto
  extends BaseDto<NanudaAttendeesOnlineCreateDto>
  implements Partial<AttendeesOnline> {
  @ApiProperty()
  @IsOptional()
  @Expose()
  name: string;

  @ApiProperty()
  @IsOptional()
  @Expose()
  @MinLength(11)
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @Expose()
  presentationDate?: Date | string;

  @ApiProperty()
  @IsOptional()
  @Expose()
  eventTime: string;

  @ApiProperty()
  @IsOptional()
  @Expose()
  eventNo: number;

  @ApiPropertyOptional()
  @IsIP()
  @IsOptional()
  @Expose()
  requestIp?: string;
}
