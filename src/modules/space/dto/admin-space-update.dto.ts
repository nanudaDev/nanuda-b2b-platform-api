import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { YN } from 'src/common';
import { BaseDto, SPACE } from 'src/core';
import { Space } from '../space.entity';

export class AdminSpaceUpdateDto extends BaseDto<AdminSpaceUpdateDto>
  implements Partial<Space> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  size?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  showYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @IsEnum(YN)
  delYn?: YN;

  @ApiPropertyOptional({ enum: SPACE })
  @IsOptional()
  @Expose()
  @IsEnum(SPACE)
  status?: SPACE;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  showName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  floor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  seat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  bFireball?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  sFireball?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  deposit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  monthlyFee?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  monthlyRent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  expiryDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  etc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  rentalType?: SPACE.TIME | SPACE.ALL | SPACE.KITCHEN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  rentalContent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  rentalFee?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  rentalStartDate?: Date;
}
