import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
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
}
