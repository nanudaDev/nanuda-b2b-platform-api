import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { BaseEntity, INQUIRY } from '../../core';
import { YN } from 'src/common';
import { Admin } from '../admin';
import { CompanyUser } from '../company-user/company-user.entity';
import { Company } from '../company/company.entity';
import { CodeManagement } from '../code-management/code-management.entity';

@Entity({ name: 'B2B_INQUIRY' })
export class Inquiry extends BaseEntity<Inquiry> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'ADMIN_NO',
  })
  adminNo?: number;

  @Column({
    type: 'int',
    name: 'COMPANY_NO',
  })
  companyNo?: number;

  @Column({
    type: 'int',
    name: 'COMPANY_USER_NO',
  })
  companyUserNo: number;

  @Column({
    type: 'int',
    name: 'INQUIRY_NO',
  })
  inquiryNo?: number;

  @Column({
    type: 'char',
    length: 1,
    name: 'IS_INQUIRY_REPLY',
    default: () => YN.NO,
  })
  isInquiryReply?: YN;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'INQUIRY_TYPE',
  })
  inquiryType: INQUIRY;

  @Column({
    type: 'varchar',
    name: 'TITLE',
  })
  title?: string;

  @Column({
    type: 'text',
    nullable: false,
    name: 'CONTENT',
  })
  content: string;

  @Column({
    type: 'char',
    default: YN.NO,
    name: 'IS_EDITED',
  })
  isEdited?: YN;

  @Column({
    type: 'char',
    default: YN.NO,
    name: 'IS_CLOSED',
  })
  isClosed?: YN;

  @ManyToOne(type => Admin)
  @JoinColumn({ name: 'ADMIN_NO' })
  admin?: Admin;

  @ManyToOne(type => CompanyUser)
  @JoinColumn({ name: 'COMPANY_USER_NO' })
  companyUser?: CompanyUser;

  @ManyToOne(type => Company)
  @JoinColumn({ name: 'COMPANY_NO' })
  company?: Company;

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'INQUIRY_TYPE', referencedColumnName: 'key' })
  codeManagement?: CodeManagement;
}
