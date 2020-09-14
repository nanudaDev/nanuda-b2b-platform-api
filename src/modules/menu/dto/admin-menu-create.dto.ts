import { BaseDto } from 'src/core';
import { Menu } from '../menu.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { type } from 'os';
import { FileAttachmentDto } from 'src/modules/file-upload/dto';
import { YN, Default } from 'src/common';

export class AdminMenuCreateDto extends BaseDto<AdminMenuCreateDto>
  implements Partial<Menu> {
  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  nameKr: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  nameEng?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  brandNo: number;

  @ApiPropertyOptional({ type: [FileAttachmentDto] })
  @IsArray()
  @IsOptional()
  @Type(() => FileAttachmentDto)
  @ValidateNested({ each: true })
  @Expose()
  images?: FileAttachmentDto[];

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @Default(YN.NO)
  @IsEnum(YN)
  mainYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @Default(YN.NO)
  @IsEnum(YN)
  showYn?: YN;

  @ApiPropertyOptional({ enum: YN })
  @IsOptional()
  @Expose()
  @Default(YN.NO)
  @IsEnum(YN)
  delYn?: YN;
}
