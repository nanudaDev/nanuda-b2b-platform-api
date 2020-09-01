import { BaseDto, INQUIRY } from 'src/core';
import { Inquiry } from '../inquiry.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';

export class InquiryCreateDto extends BaseDto<InquiryCreateDto>
  implements Partial<Inquiry> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  content: string;

  @ApiProperty({ enum: INQUIRY })
  @IsEnum(INQUIRY)
  @IsNotEmpty()
  @Expose()
  inquiryType: INQUIRY;
}
