import { BaseDto } from 'src/core';
import { CompanyDistrict } from '../company-district.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';

export class CompanyDistrictUpdateDto extends BaseDto<CompanyDistrictUpdateDto>
  implements Partial<CompanyDistrict> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameKr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameEng?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  amenityIds?: number[];

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsOptional()
  @Expose()
  @Type(() => FileAttachmentDto)
  @IsArray()
  @ValidateNested()
  image?: FileAttachmentDto[];
}
