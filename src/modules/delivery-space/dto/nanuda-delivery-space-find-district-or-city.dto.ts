import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { LOCATION_TYPE } from 'src/common';
import { BaseDto } from 'src/core';

export class NanudaDeliverySpaceFindDistrictOrCityDto extends BaseDto<
  NanudaDeliverySpaceFindDistrictOrCityDto
> {
  @ApiProperty({ enum: LOCATION_TYPE })
  @IsEnum(LOCATION_TYPE)
  @IsNotEmpty()
  @Expose()
  locationType: LOCATION_TYPE;
}
