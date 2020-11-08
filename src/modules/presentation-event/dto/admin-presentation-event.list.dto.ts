import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Default, ORDER_BY_VALUE } from 'src/common';
import { BaseDto, PRESENTATION_EVENT_TYPE } from 'src/core';
import { PresentationEvent } from '../presentation-event.entity';

export class AdminPresentationEventListDto
  extends BaseDto<AdminPresentationEventListDto>
  implements Partial<PresentationEvent> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  title?: string;

  @ApiPropertyOptional({ enum: PRESENTATION_EVENT_TYPE, isArray: true })
  @IsEnum(PRESENTATION_EVENT_TYPE, { each: true })
  @IsOptional()
  @Expose()
  eventType?: PRESENTATION_EVENT_TYPE;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  attendeesName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  attendeesPhone?: string;

  @ApiPropertyOptional({ enum: ORDER_BY_VALUE })
  @IsEnum(ORDER_BY_VALUE, { each: true })
  @IsOptional()
  @Default(ORDER_BY_VALUE.DESC)
  @Expose()
  orderByNo?: ORDER_BY_VALUE;
}
