import { BaseDto, APPROVAL_STATUS } from 'src/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminCompanyUserApprovalDto extends BaseDto<
  AdminCompanyUserApprovalDto
> {
  constructor() {
    super();
  }

  @ApiProperty({ enum: APPROVAL_STATUS })
  @IsEnum(APPROVAL_STATUS)
  @Expose()
  companyUserStatus: APPROVAL_STATUS;
}
