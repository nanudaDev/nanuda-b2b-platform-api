import { BaseDto } from 'src/core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminQuestionCreateDto extends BaseDto<AdminQuestionCreateDto> {}
