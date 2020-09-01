import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity, APPROVAL_STATUS } from 'src/core';
import { CompanyUpdateRefusalReason } from './company-update-refusal-reason.class';
import { Company } from '../company/company.entity';
import { FileAttachmentDto } from '../file-upload/dto';

@Entity({ name: 'B2B_COMPANY_UPDATE_HISTORY' })
export class CompanyUpdateHistory extends BaseEntity<CompanyUpdateHistory> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'NO',
  })
  no: number;

  @Column({
    type: 'int',
    name: 'COMPANY_NO',
    nullable: false,
  })
  companyNo: number;

  @Column({
    name: 'ADDRESS',
    type: 'varchar',
  })
  address: string;

  @Column({
    type: 'varchar',
    name: 'EMAIL',
  })
  email?: string;

  @Column({
    type: 'varchar',
    name: 'POPULATION',
  })
  population?: string;

  @Column({
    type: 'varchar',
    name: 'FAX',
  })
  fax?: string;

  @Column({
    type: 'varchar',
    name: 'PHONE',
    nullable: false,
  })
  phone?: string;

  @Column({
    type: 'varchar',
    name: 'NAME_KR',
    nullable: false,
  })
  nameKr: string;

  @Column({
    type: 'varchar',
    name: 'NAME_ENG',
  })
  nameEng?: string;

  @Column({
    type: 'varchar',
    name: 'CEO_KR',
  })
  ceoKr?: string;

  @Column({
    type: 'varchar',
    name: 'CEO_ENG',
  })
  ceoEng?: string;

  @Column({
    type: 'varchar',
    name: 'BUSINESS_NO',
  })
  businessNo?: string;

  @Column({
    type: 'json',
    name: 'LOGO',
    default: () => '(json_array())',
  })
  logo?: FileAttachmentDto[];

  @Column({
    type: 'varchar',
    name: 'WEBSITE',
  })
  website?: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'COMPANY_STATUS',
  })
  companyStatus: APPROVAL_STATUS;

  @Column({
    type: 'json',
    nullable: true,
    name: 'REFUSAL_REASONS',
  })
  refusalReasons?: CompanyUpdateRefusalReason;

  @Column({
    type: 'text',
    nullable: true,
    name: 'REFUSAL_ETC',
  })
  refusalDesc?: string;

  @ManyToOne(
    type => Company,
    company => company.companyUpdateHistories,
  )
  @JoinColumn({ name: 'COMPANY_NO' })
  company?: Company;
}
