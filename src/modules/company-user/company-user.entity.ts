import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import {
  BaseEntity,
  BaseUser,
  COMPANY_USER,
  APPROVAL_STATUS,
  ADMIN_USER,
} from '../../core';
import { UserType } from '../auth';
import { Company } from '../company/company.entity';
import { YN } from 'src/common';
import { Exclude, Expose, classToPlain } from 'class-transformer';
import { CompanyUserUpdateHistory } from '../company-user-update-history/company-user-update-history.entity';
import { CodeManagement } from '../code-management/code-management.entity';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { FileAttachmentDto } from '../file-upload/dto';

@Entity({ name: 'B2B_COMPANY_USER' })
export class CompanyUser extends BaseUser {
  @Exclude({ toPlainOnly: true })
  @Column({
    type: 'varchar',
    name: 'PASSWORD',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'int',
    nullable: true,
    name: 'ADMIN_NO',
  })
  adminNo?: number;

  @Column({
    type: 'int',
    nullable: true,
    name: 'COMPANY_ADMIN_NO',
  })
  companyAdminNo?: number;

  @Column({
    type: 'varchar',
    name: 'EMAIL',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'int',
    name: 'COMPANY_NO',
    nullable: false,
  })
  companyNo: number;

  @Column({
    type: 'varchar',
    name: 'COMPANY_ADMIN_ROLE',
    default: COMPANY_USER.NORMAL_COMPANY_USER,
    nullable: false,
  })
  authCode: COMPANY_USER;

  @Column({
    type: 'char',
    default: YN.NO,
    nullable: false,
    name: 'PASSWORD_CHANGED_YN',
  })
  passwordChangedYn?: YN;

  @Column({
    type: 'varchar',
    name: 'COMPANY_USER_STATUS',
    default: APPROVAL_STATUS.NEED_APPROVAL,
  })
  companyUserStatus: APPROVAL_STATUS;

  @Column({
    type: 'datetime',
    name: 'LAST_LOGIN_AT',
    nullable: true,
  })
  lastLoginAt?: Date;

  @Column({
    type: 'json',
    nullable: true,
    name: 'ATTACHMENTS',
  })
  attachments?: FileAttachmentDto[];

  //   need to update to UserType
  // no database column.
  get userType(): UserType {
    return UserType.COMPANY_USER;
  }

  companyStatus?: APPROVAL_STATUS;

  //   many to one for company
  @ManyToOne(
    type => Company,
    company => company.companyUsers,
  )
  //   join column으로 반드시 묶기
  @JoinColumn({ name: 'COMPANY_NO' })
  company: Company;

  @OneToMany(
    type => CompanyUserUpdateHistory,
    companyUserUpdateHistory => companyUserUpdateHistory.companyUser,
  )
  companyUserUpdateHistories?: CompanyUserUpdateHistory[];

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'COMPANY_USER_STATUS', referencedColumnName: 'key' })
  codeManagement?: CodeManagement;

  @OneToMany(
    type => DeliverySpace,
    deliverySpace => deliverySpace.companyUser,
  )
  deliverySpaces?: DeliverySpace[];

  // toPlain for password removal
  toJSON() {
    return classToPlain(this);
  }
}
