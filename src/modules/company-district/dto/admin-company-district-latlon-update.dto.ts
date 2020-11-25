import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { Default } from 'src/common';
import { CompanyDistrict } from '../company-district.entity';

export class AdminCompanyDistrictLatLonDto implements Partial<CompanyDistrict> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  lat: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  lon: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  region1DepthName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  region2DepthName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  region3DepthName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  hCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  bCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @Default(1000)
  radius?: number;
}
