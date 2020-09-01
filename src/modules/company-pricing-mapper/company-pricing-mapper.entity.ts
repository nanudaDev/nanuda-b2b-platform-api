import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseMapperEntity } from 'src/core';

@Entity({ name: 'B2B_COMPANY_PRICING_MAPPER' })
export class CompanyPricingMapper extends BaseMapperEntity<
  CompanyPricingMapper
> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'COMPANY_NO',
    nullable: false,
  })
  companyNo: number;

  @Column({
    type: 'int',
    name: 'COMPANY_PRICING_NO',
    nullable: false,
  })
  companyPricingNo: number;
}
