import { BaseDto } from '../../../core';
import { CodeManagement } from '../code-management.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { YN } from 'src/common';

export class AdminCodeManagementUpdateDto extends BaseDto<AdminCodeManagementUpdateDto> implements Partial<CodeManagement> {
    constructor(partial?: any) {
        super(partial)
    }

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    key?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    value?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    desc?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    category1?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    category2?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @Expose()
    orderBy?: number

    @ApiPropertyOptional({ enum: YN })
    @IsOptional()
    @IsEnum(YN)
    @IsNotEmpty()
    @Expose()
    delYn?: YN;
}