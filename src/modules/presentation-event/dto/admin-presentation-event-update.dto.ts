import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  ValidateNested,
} from 'class-validator';
import { Default } from 'src/common';
import { BaseDto, PRESENTATION_EVENT_TYPE } from 'src/core';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';
import { PresentationEvent } from '../presentation-event.entity';

export class AdminPresentationEventUpdateeDto
  extends BaseDto<AdminPresentationEventUpdateeDto>
  implements Partial<PresentationEvent> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  desc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  postEventDesc?: string;

  @ApiPropertyOptional({ enum: PRESENTATION_EVENT_TYPE })
  @IsEnum(PRESENTATION_EVENT_TYPE, { each: true })
  @IsOptional()
  @Default(PRESENTATION_EVENT_TYPE.COMMON_EVENT)
  @Expose()
  eventType?: PRESENTATION_EVENT_TYPE;

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @Type(() => FileAttachmentDto)
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Expose()
  image?: FileAttachmentDto[];

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @Type(() => FileAttachmentDto)
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Expose()
  mobileImage?: FileAttachmentDto[];

  @ApiPropertyOptional()
  @ArrayMinSize(1)
  @IsOptional()
  @IsArray()
  @Expose()
  schedule: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @Default('서울 서초구 서초대로77길 55 에이프로스퀘어 7층')
  address: string;

  @ApiPropertyOptional()
  @IsPhoneNumber('KR', { message: '전화번호를 제대로 입력해주세요.' })
  @IsOptional()
  @Default('02-556-5777')
  @Expose()
  contactPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  presentationDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  lat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  lon?: string;
}
