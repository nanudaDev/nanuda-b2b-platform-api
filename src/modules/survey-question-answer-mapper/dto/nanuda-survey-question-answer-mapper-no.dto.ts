import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Default } from 'src/common';
import { ExpandOperator } from 'rxjs/internal/operators/expand';
import { Expose } from 'class-transformer';

export class SurveyQuestionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Default(1)
  @Expose()
  questionNo?: number;
}
