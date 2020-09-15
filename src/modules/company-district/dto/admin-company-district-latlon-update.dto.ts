import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminCompanyDistrictLatLonDto {
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
}
