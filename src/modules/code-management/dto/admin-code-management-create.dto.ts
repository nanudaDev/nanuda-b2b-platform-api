import { Expose } from 'class-transformer';
import { BaseDto } from '../../../core';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CodeManagement } from '../code-management.entity';
import { Default, YN } from '../../../common';
import { IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export class AdminCodeManagementCreateDto extends BaseDto<AdminCodeManagementCreateDto> implements Partial<CodeManagement>{
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    key: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    value: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    desc?: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    category1: string;

    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    category2: string;

    @ApiProperty({ enum: YN, enumName: 'YN' })
    @Default(YN.NO)
    @IsEnum(YN)
    @Expose()
    delYn: YN;
}