import { BaseEntity, FOUNDER_CONSULT, B2B_FOUNDER_CONSULT } from 'src/core';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AVAILABLE_TIME, YN } from 'src/common';
import { Space } from '../space/space.entity';
import { Admin } from '../admin';
import { CodeManagement } from '../code-management/code-management.entity';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { CompanyUser } from '../company-user/company-user.entity';
import { FounderConsultManagement } from '../founder-consult-management/founder-consult-management.entity';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';

@Entity({ name: 'B2B_DELIVERY_FOUNDER_CONSULT' })
export class DeliveryFounderConsult extends BaseEntity<DeliveryFounderConsult> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'DELIVERY_SPACE_NO',
    nullable: false,
  })
  deliverySpaceNo: number;

  @Column({
    type: 'int',
    name: 'NANUDA_USER_NO',
    nullable: false,
  })
  nanudaUserNo: number;

  @Column({
    type: 'int',
    name: 'S_CONSULT_MANAGER',
  })
  spaceConsultManager?: number;

  @Column({
    type: 'varchar',
    name: 'STATUS',
    nullable: false,
    default: FOUNDER_CONSULT.F_NEW_REG,
  })
  status: FOUNDER_CONSULT;

  @Column({
    type: 'date',
    name: 'HOPE_DATE',
    nullable: true,
  })
  hopeDate?: Date;

  @Column({
    type: 'varchar',
    name: 'HOPE_TIME',
    nullable: false,
  })
  hopeTime: AVAILABLE_TIME;

  @Column({
    type: 'char',
    name: 'PURPOSE_USE',
    nullable: false,
    default: YN.NO,
  })
  purposeUse: YN;

  @Column({
    type: 'char',
    name: 'CHANGUP_EXP_YN',
    nullable: false,
    default: YN.NO,
  })
  changUpExpYn: YN;

  @Column({
    type: 'char',
    name: 'SPACE_OWN_YN',
    nullable: false,
    default: YN.NO,
  })
  spaceOwnYn: YN;

  @Column({
    type: 'text',
    name: 'S_CONSULT_ETC',
    nullable: true,
  })
  spaceConsultEtc?: string;

  @Column({
    type: 'date',
    name: 'CONFIRM_DATE',
    nullable: true,
  })
  confirmDate?: Date;

  @Column({
    type: 'char',
    name: 'VIEW_COUNT',
    nullable: false,
    default: YN.NO,
  })
  viewCount?: YN;

  @Column({
    type: 'varchar',
    name: 'HOPE_FOOD_CATEGORY',
    nullable: true,
  })
  hopeFoodCategory?: string;

  @Column({
    type: 'varchar',
    name: 'COMPANY_DECISION_STATUS',
    nullable: false,
    default: B2B_FOUNDER_CONSULT.B2B_F_NEW_REG,
  })
  companyDecisionStatus?: B2B_FOUNDER_CONSULT;

  @Column({
    type: 'int',
    name: 'COMPANY_USER_NO',
    comment: '열람한 사용자 아이디',
  })
  companyUserNo?: number;

  @Column({
    type: 'datetime',
    name: 'deliveredAt',
  })
  deliveredAt?: Date;

  @Column({
    type: 'timestamp',
    name: 'openedAt',
    nullable: true,
  })
  openedAt?: Date;

  @ManyToOne(type => Admin)
  @JoinColumn({ name: 'S_CONSULT_MANAGER' })
  admin?: Admin;

  @OneToOne(type => DeliverySpace)
  @JoinColumn({ name: 'DELIVERY_SPACE_NO' })
  deliverySpaces?: DeliverySpace;

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'STATUS', referencedColumnName: 'key' })
  codeManagement?: CodeManagement;

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'COMPANY_DECISION_STATUS', referencedColumnName: 'key' })
  companyDecisionStatusCode?: CodeManagement;

  // 가능한 시간
  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'HOPE_TIME', referencedColumnName: 'key' })
  availableTime?: CodeManagement;

  @ManyToOne(
    type => NanudaUser,
    nanudaUser => nanudaUser.founderConsults,
  )
  @JoinColumn({ name: 'NANUDA_USER_NO' })
  nanudaUser?: NanudaUser;

  @OneToOne(type => CompanyUser)
  @JoinColumn({ name: 'COMPANY_USER_NO' })
  companyUser?: CompanyUser;
}
