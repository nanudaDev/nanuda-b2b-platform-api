import { BaseEntity } from 'src/core';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyDistrict } from '../company-district/company-district.entity';

@Entity({ name: 'B2B_COMPANY_DISTRICT_REVENUE_RECORD' })
export class CompanyDistrictRevenueRecord extends BaseEntity<
  CompanyDistrictRevenueRecord
> {
  @PrimaryGeneratedColumn({ name: 'NO', type: 'int', unsigned: true })
  no: number;

  @Column({ name: 'MAX_REVENUE', type: 'int', default: 0 })
  maxRevenue: number;

  @Column({ name: 'MIN_REVENUE', type: 'int', default: 0 })
  minRevenue: number;

  @Column({ name: 'YEAR', type: 'varchar', nullable: false })
  year: string;

  @Column({ name: 'MONTH', type: 'varchar', nullable: false })
  month: string;

  @Column({
    name: 'COMPANY_DISTRICT_NO',
    type: 'int',
    nullable: false,
    unsigned: true,
  })
  companyDistrictNo: number;

  // NATE TODO: COMPANY DISTRICT RELATIONS MANY TO ONE
  // Many to one
  // One to Many
  // One to one
  // Many to Many

  @ManyToOne(
    type => CompanyDistrict,
    companyDistrict => companyDistrict.revenueRecords,
  )
  @JoinColumn({ name: 'COMPANY_DISTRICT_NO' })
  companyDistrict?: CompanyDistrict;
}
