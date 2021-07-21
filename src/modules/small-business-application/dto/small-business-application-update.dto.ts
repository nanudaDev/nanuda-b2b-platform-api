import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Part } from 'aws-sdk/clients/s3';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  ValidateNested,
} from 'class-validator';
import { Default, YN } from 'src/common';
import { BaseDto, SMALL_BUSINESS_APPLICATION } from 'src/core';
import { SmallBusinessApplicantExperience } from '../small-business-applicant-experience.class';
import { SmallBusinessApplication } from '../small-business-application.entity';
import * as errors from 'src/locales/kr/errors.json';

export class SmallBusinessApplicationUpdateDto
  extends BaseDto<SmallBusinessApplicationUpdateDto>
  implements Partial<SmallBusinessApplication> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsPhoneNumber('KR', { message: errors.phone.isValid })
  phone: string;

  @ApiPropertyOptional({ enum: SMALL_BUSINESS_APPLICATION })
  @IsOptional()
  @IsEnum(SMALL_BUSINESS_APPLICATION)
  @Expose()
  appliedCategoryNo?: SMALL_BUSINESS_APPLICATION;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @Expose()
  email?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  @Default(YN.NO)
  isSavedYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  @Default(YN.NO)
  isCompleteYn?: YN;

  @ApiPropertyOptional({ type: [SmallBusinessApplicantExperience] })
  @IsOptional()
  @Type(() => SmallBusinessApplicantExperience)
  @IsArray()
  @ValidateNested({ each: true })
  @Expose()
  experience?: SmallBusinessApplicantExperience[];
}
