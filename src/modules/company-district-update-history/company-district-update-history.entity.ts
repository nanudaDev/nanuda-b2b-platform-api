import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity, APPROVAL_STATUS } from 'src/core';
import { CompanyDistrictUpdateRefusalReason } from './company-district-update-refusal.class';

@Entity({ name: 'B2B_COMPANY_DISTRICT_UPDATE_HISTORY' })
export class CompanyDistrictUpdateHistory extends BaseEntity<
  CompanyDistrictUpdateHistory
> {
  @PrimaryGeneratedColumn({
    name: 'NO',
    type: 'int',
    unsigned: true,
  })
  no: number;

  @Column({
    name: 'NAME_KR',
    type: 'varchar',
    nullable: false,
  })
  nameKr: string;

  @Column({
    name: 'NAME_ENG',
    type: 'varchar',
  })
  nameEng?: string;

  @Column({
    type: 'int',
    name: 'COMPANY_NO',
    nullable: false,
  })
  companyNo: number;

  @Column({
    type: 'int',
    name: 'COMPANY_DISTRICT_NO',
    nullable: false,
  })
  companyDistrictNo: number;

  @Column('varchar', {
    name: 'COMPANY_DISTRICT_STATUS',
    nullable: false,
  })
  companyDistrictStatus: APPROVAL_STATUS;

  @Column({
    type: 'json',
    name: 'REFUSAL_REASON',
  })
  refusalReasons: CompanyDistrictUpdateRefusalReason;

  @Column({
    type: 'text',
    name: 'REFUSAL_DESC',
  })
  refusalDesc?: string;

  @Column({
    type: 'text',
    name: 'ADDRESS',
  })
  address?: string;
}
