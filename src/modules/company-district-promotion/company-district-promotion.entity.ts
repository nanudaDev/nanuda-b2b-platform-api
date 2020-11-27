import { B2B_EVENT_TYPE, BaseEntity } from 'src/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'B2B_COMPANY_DISTRICT_PROMOTION' })
export class CompanyDistrictPromotion extends BaseEntity<
  CompanyDistrictPromotion
> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'COMPANY_DISTRICT_NO',
    nullable: false,
  })
  companyDistrictNo: number;

  @Column({
    type: 'varchar',
    name: 'TITLE',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    name: 'DESC',
  })
  desc?: string;

  @Column({
    type: 'varchar',
    name: 'PROMOTION_TYPE',
  })
  promotionType?: B2B_EVENT_TYPE;

  @Column({
    type: 'datetime',
    name: 'START_DATE',
  })
  started?: Date;

  @Column({
    type: 'datetime',
    name: 'END_DATE',
  })
  endDate?: Date;
}
