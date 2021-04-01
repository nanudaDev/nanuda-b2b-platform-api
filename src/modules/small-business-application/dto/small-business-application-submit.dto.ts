import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
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

export class SmallBusinessApplicationSubmitDto
  extends BaseDto<SmallBusinessApplicationSubmitDto>
  implements Partial<SmallBusinessApplication> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsPhoneNumber('KR', { message: '옳바른 전화번호를 입력해주세요' })
  phone: string;

  @ApiProperty({ enum: SMALL_BUSINESS_APPLICATION })
  @IsNotEmpty()
  @IsEnum(SMALL_BUSINESS_APPLICATION)
  @Expose()
  appliedCategoryNo?: SMALL_BUSINESS_APPLICATION;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  address?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  dateOfBirth?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email?: string;

  @ApiProperty({ enum: YN })
  @IsNotEmpty()
  @Expose()
  @IsEnum(YN)
  @Default(YN.NO)
  isSavedYn?: YN;

  @ApiProperty({ enum: YN })
  @IsNotEmpty()
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
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  experience?: SmallBusinessApplicantExperience[];
}