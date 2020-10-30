import { BaseDto, SPACE_TYPE, STORE_COUNT, BRAND, DIFFICULTY } from 'src/core';
import { Brand } from '../brand.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { YN, Default } from 'src/common';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';
import { Type } from 'class-transformer';

export class AdminBrandUpdateDto extends BaseDto<AdminBrandUpdateDto>
  implements Partial<Brand> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameKr: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameEng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  categoryNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  desc?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  isRecommendedYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  showYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Expose()
  delYn?: YN;

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsOptional()
  @Expose()
  @Type(() => FileAttachmentDto)
  @IsArray()
  @ValidateNested()
  logo?: FileAttachmentDto[];

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsOptional()
  @Expose()
  @Type(() => FileAttachmentDto)
  @IsArray()
  @ValidateNested({ each: true })
  mainBanner?: FileAttachmentDto[];

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsOptional()
  @Expose()
  @Type(() => FileAttachmentDto)
  @IsArray()
  @ValidateNested({ each: true })
  sideBanner?: FileAttachmentDto[];

  @ApiPropertyOptional({ enum: STORE_COUNT })
  @IsEnum(STORE_COUNT)
  @IsOptional()
  @Expose()
  storeCount?: STORE_COUNT;

  @ApiPropertyOptional({ enum: BRAND })
  @IsOptional()
  @IsEnum(BRAND)
  @Expose()
  cost?: BRAND;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  urlPath?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  kioskNo?: number;

  @ApiPropertyOptional({ enum: DIFFICULTY })
  @IsOptional()
  @IsEnum(DIFFICULTY)
  @Expose()
  difficulty?: DIFFICULTY;

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsOptional()
  @Expose()
  @Type(() => FileAttachmentDto)
  @IsArray()
  @ValidateNested()
  mainMenuImage?: FileAttachmentDto[];

  @ApiPropertyOptional({ enum: SPACE_TYPE })
  @IsOptional()
  @Expose()
  spaceTypeNo?: SPACE_TYPE;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsArray()
  brandKioskMapperNos?: number[];
}
