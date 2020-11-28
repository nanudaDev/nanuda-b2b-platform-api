import { YN } from 'src/common';
import { B2B_EVENT_TYPE, BaseEntity } from 'src/core';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CodeManagement } from '../code-management/code-management.entity';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { Company } from '../company/company.entity';

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
    type: 'varchar',
    name: 'TITLE',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    name: 'DISPLAY_TITLE',
  })
  displayTitle?: string;

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
    type: 'char',
    name: 'SHOW_YN',
    default: YN.NO,
  })
  showYn?: YN.NO;

  @Column({
    type: 'datetime',
    name: 'START_DATE',
  })
  started?: Date;

  @Column({
    type: 'datetime',
    name: 'END_DATE',
  })
  ended?: Date;

  @ManyToMany(
    type => CompanyDistrict,
    district => district.promotions,
  )
  @JoinTable({
    name: 'B2B_COMPANY_DISTRICT_PROMOTION_MAPPER',
    joinColumn: {
      name: 'PROMOTION_NO',
    },
    inverseJoinColumn: {
      name: 'COMPANY_DISTRICT_NO',
    },
  })
  companyDistricts?: CompanyDistrict[];

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'PROMOTION_TYPE', referencedColumnName: 'key' })
  promotionTypeCode?: CodeManagement;

  @ManyToMany(
    type => Company,
    company => company.promotions,
  )
  @JoinTable({
    name: 'B2B_COMPANY_DISTRICT_PROMOTION_MAPPER',
    joinColumn: { name: 'PROMOTION_NO' },
    inverseJoinColumn: { name: 'COMPANY_NO' },
  })
  company?: Company;

  isExpired?: YN;
}
