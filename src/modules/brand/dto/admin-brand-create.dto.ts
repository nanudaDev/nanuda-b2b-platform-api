import {
  BaseDto,
  STORE_COUNT,
  BRAND,
  DIFFICULTY,
  SPACE_TYPE,
  BRAND_TYPE,
} from 'src/core';
import { Brand } from '../brand.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { YN, Default } from 'src/common';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';

export class AdminBrandCreateDto extends BaseDto<AdminBrandCreateDto>
  implements Partial<Brand> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  nameKr: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameEng?: string;

  @ApiPropertyOptional({ enum: SPACE_TYPE })
  @IsOptional()
  @Expose()
  spaceTypeNo: SPACE_TYPE;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  desc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  categoryNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  urlPath?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  kioskNo?: number;

  @ApiPropertyOptional({ enum: BRAND_TYPE })
  @IsOptional()
  @IsEnum(BRAND_TYPE)
  @Expose()
  brandType?: BRAND_TYPE;

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

  @ApiPropertyOptional({ enum: DIFFICULTY })
  @IsOptional()
  @IsEnum(DIFFICULTY)
  @Expose()
  difficulty?: DIFFICULTY;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Default(YN.NO)
  @Expose()
  showYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @IsEnum(YN)
  @Default(YN.NO)
  @Expose()
  isRecommendedYn?: YN;

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
  @ValidateNested({ each: true })
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

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsOptional()
  @Expose()
  @Type(() => FileAttachmentDto)
  @IsArray()
  @ValidateNested({ each: true })
  mobileSideBanner?: FileAttachmentDto[];

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsOptional()
  @Expose()
  @Type(() => FileAttachmentDto)
  @IsArray()
  @ValidateNested({ each: true })
  mainMenuImage?: FileAttachmentDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsArray()
  brandKioskMapperNos?: number[];
}
