import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { COMPANY_USER, APPROVAL_STATUS, BaseEntity } from 'src/core';
import { CompanyUserUpdateRefusalReason } from './company-user-update-refusal.class';
import { CompanyUser } from '../company-user/company-user.entity';
import { FileAttachmentDto } from '../file-upload/dto';

@Entity({ name: 'B2B_COMPANY_USER_UPDATE_HISTORY' })
export class CompanyUserUpdateHistory extends BaseEntity<
  CompanyUserUpdateHistory
> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    length: 12,
    nullable: false,
    unique: true,
    name: 'PHONE',
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'NAME',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    name: 'EMAIL',
    nullable: false,
  })
  email: string;

  @Column({
    type: 'int',
    name: 'COMPANY_NO',
    nullable: false,
  })
  companyNo: number;

  @Column({
    type: 'int',
    name: 'COMPANY_USER_NO',
    nullable: false,
  })
  companyUserNo: number;

  @Column({
    type: 'varchar',
    name: 'COMPANY_ADMIN_ROLE',
    default: COMPANY_USER.NORMAL_COMPANY_USER,
    nullable: false,
  })
  authCode: COMPANY_USER;

  @Column({
    type: 'varchar',
    name: 'COMPANY_USER_STATUS',
    default: APPROVAL_STATUS.NEED_APPROVAL,
  })
  companyUserStatus: APPROVAL_STATUS;

  @Column({
    type: 'json',
    nullable: true,
    name: 'REFUSAL_REASONS',
  })
  refusalReasons?: CompanyUserUpdateRefusalReason;

  @Column({
    type: 'text',
    nullable: true,
    name: 'REFUSAL_DESC',
  })
  refusalDesc?: string;

  @Column({
    type: 'json',
    nullable: true,
    name: 'ATTACHMENTS',
  })
  attachments?: FileAttachmentDto[];

  @ManyToOne(
    type => CompanyUser,
    companyUser => companyUser.companyUserUpdateHistories,
  )
  @JoinColumn({ name: 'COMPANY_USER_NO' })
  companyUser?: CompanyUser;
}
