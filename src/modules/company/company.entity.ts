import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  OneToOne,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from 'src/core';
import { COMPANY, APPROVAL_STATUS } from 'src/shared';
import { Admin } from '../admin';
import { CompanyUser } from '../company-user/company-user.entity';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { CodeManagement } from '../code-management/code-management.entity';
import { CompanyUpdateRefusalReason } from '../company-update-history/company-update-refusal-reason.class';
import { CompanyUpdateHistory } from '../company-update-history/company-update-history.entity';
import { CompanyPricing } from '../company-pricing/company-pricing.entity';
import { FileAttachmentDto } from '../file-upload/dto';
import { CompanyDistrictPromotion } from '../company-district-promotion/company-district-promotion.entity';

@Entity({ name: 'COMPANY' })
export class Company extends BaseEntity<Company> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'NO',
  })
  no: number;

  @Column('varchar', {
    length: 45,
    nullable: false,
    name: 'COMPANY_TYPE',
    default: COMPANY.OTHER_COMPANY,
  })
  companyType: COMPANY;

  @Column('int', {
    nullable: false,
    name: 'ADMIN_NO',
  })
  adminNo: number;

  @Column('int', {
    nullable: true,
    name: 'MANAGER_NO',
  })
  managerNo?: number;

  @Column('varchar', {
    nullable: false,
    length: 45,
    name: 'NAME_KR',
  })
  nameKr: string;

  @Column('varchar', {
    nullable: true,
    length: 45,
    name: 'NAME_ENG',
  })
  nameEng?: string;

  @Column('varchar', {
    nullable: false,
    length: 45,
    name: 'CEO_KR',
  })
  ceoKr: string;

  @Column('varchar', {
    nullable: true,
    length: 45,
    name: 'CEO_ENG',
  })
  ceoEng?: string;

  @Column('varchar', {
    nullable: true,
    name: 'POPULATION',
  })
  population?: string;

  @Column('varchar', {
    nullable: true,
    name: 'ADDRESS',
  })
  address?: string;

  @Column('varchar', {
    nullable: true,
    name: 'BUSINESS_NO',
  })
  businessNo?: string;

  @Column('varchar', {
    nullable: true,
    name: 'FAX',
  })
  fax?: string;

  @Column('varchar', {
    nullable: true,
    name: 'PHONE',
  })
  phone?: string;

  @Column('varchar', {
    nullable: true,
    name: 'EMAIL',
  })
  email?: string;

  @Column('varchar', {
    nullable: true,
    name: 'WEBSITE',
  })
  website?: string;

  @Column('varchar', {
    nullable: false,
    default: APPROVAL_STATUS.NEED_APPROVAL,
    name: 'COMPANY_STATUS',
  })
  companyStatus: APPROVAL_STATUS;

  @Column({
    type: 'json',
    name: 'LOGO',
  })
  logo?: FileAttachmentDto[];

  @ManyToOne(type => Admin)
  @JoinColumn({ name: 'MANAGER_NO' })
  admin?: Admin;

  // one to many for companies
  @OneToMany(
    type => CompanyUser,
    companyUser => companyUser.company,
  )
  companyUsers?: Promise<CompanyUser[]>;

  @OneToMany(
    type => CompanyDistrict,
    companyDistrict => companyDistrict.company,
  )
  companyDistricts?: CompanyDistrict[];

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'COMPANY_STATUS', referencedColumnName: 'key' })
  codeManagement?: CodeManagement;

  @OneToMany(
    type => CompanyUpdateHistory,
    companyUpdateHistory => companyUpdateHistory.company,
  )
  companyUpdateHistories?: CompanyUpdateHistory[];

  @ManyToMany(
    type => CompanyPricing,
    companyPricing => companyPricing.companies,
  )
  @JoinTable({
    name: 'B2B_COMPANY_PRICING_MAPPER',
    joinColumn: {
      name: 'COMPANY_NO',
    },
    inverseJoinColumn: {
      name: 'COMPANY_PRICING_NO',
    },
  })
  pricing?: CompanyPricing[];

  @ManyToMany(
    type => CompanyDistrictPromotion,
    promotion => promotion.company,
  )
  @JoinTable({
    name: 'B2B_COMPANY_DISTRICT_PROMOTION_MAPPER',
    joinColumn: {
      name: 'COMPANY_NO',
    },
    inverseJoinColumn: {
      name: 'PROMOTION_NO',
    },
  })
  promotions?: CompanyDistrictPromotion[];
}
