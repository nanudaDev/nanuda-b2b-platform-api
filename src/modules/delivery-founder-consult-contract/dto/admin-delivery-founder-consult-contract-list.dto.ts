import { DeliveryFounderConsultContractListDto } from './delivery-founder-consult-contract-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class AdminDeliveryFounderConsultContractListDto extends DeliveryFounderConsultContractListDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyNo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  companyName?: string;
}
