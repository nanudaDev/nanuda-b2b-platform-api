import { YN } from 'src/common';
import { BaseEntity } from 'src/core';
import { Admin } from 'src/modules/admin';
import { CompanyUser } from 'src/modules/company-user/company-user.entity';
import { DeliveryFounderConsult } from 'src/modules/delivery-founder-consult/delivery-founder-consult.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'B2B_DELIVERY_FOUNDER_CONSULT_REPLY' })
export class DeliveryFounderConsultReply extends BaseEntity<
  DeliveryFounderConsultReply
> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'DELIVERY_FOUNDER_CONSULT_NO',
  })
  deliveryFounderConsultNo: number;

  @Column({
    type: 'int',
    name: 'ADMIN_NO',
  })
  adminNo?: number;

  @Column({
    type: 'int',
    name: 'COMPANY_USER_NO',
  })
  companyUserNo?: number;

  @Column({
    name: 'IS_UPDATED_YN',
    default: YN.NO,
    type: 'char',
  })
  isUpdatedYn?: YN;

  @Column({
    type: 'text',
    name: 'DESC',
  })
  desc: string;

  @OneToOne(type => CompanyUser)
  @JoinColumn({ name: 'COMPANY_USER_NO' })
  companyUser?: CompanyUser;

  @OneToOne(type => Admin)
  @JoinColumn({ name: 'ADMIN_NO' })
  admin?: Admin;

  @OneToOne(type => DeliveryFounderConsult)
  @JoinColumn({ name: 'DELIVERY_FOUNDER_CONSULT_NO' })
  deliveryFounderConsult?: DeliveryFounderConsult;
}
