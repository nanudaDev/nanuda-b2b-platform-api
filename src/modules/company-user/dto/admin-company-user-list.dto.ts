import { CompanyUserListDto } from './company-user-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { YN } from 'src/common';
import { IsEnum, IsObject, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminCompanyUserListDto extends CompanyUserListDto {
  @ApiPropertyOptional({ enum: YN })
  @IsEnum(YN)
  @IsOptional()
  @Expose()
  delYn?: YN;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNameKr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNameEng?: string;
}
