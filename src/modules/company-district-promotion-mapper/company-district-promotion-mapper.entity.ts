import { BaseMapperEntity } from 'src/core';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'B2B_COMPANY_DISTRICT_PROMOTION_MAPPER' })
export class CompanyDistrictPromotionMapper extends BaseMapperEntity<
  CompanyDistrictPromotionMapper
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
  companyNo?: number;

  @Column({
    type: 'int',
    name: 'COMPANY_DISTRICT_NO',
    nullable: false,
  })
  companyDistrictNo?: number;

  @Column({
    type: 'int',
    name: 'PROMOTION_NO',
    nullable: false,
  })
  promotionNo?: number;
}
