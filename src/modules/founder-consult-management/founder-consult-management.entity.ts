import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from 'src/core';
import { FounderConsult } from '../founder-consult/founder-consult.entity';
import { CompanyUser } from '../company-user/company-user.entity';

@Entity({ name: 'B2B_DELIVERY_FOUNDER_CONSULT_MANAGEMENT' })
export class FounderConsultManagement extends BaseEntity<
  FounderConsultManagement
> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'text',
    name: 'MEMO',
    nullable: false,
  })
  memo: string;

  @Column({
    type: 'int',
    name: 'FOUNDER_CONSULT_NO',
    nullable: false,
  })
  founderConsultNo: number;

  @Column({
    type: 'int',
    name: 'COMPANY_USER_NO',
    nullable: false,
  })
  companyUserNo: number;

  @ManyToOne(
    type => FounderConsult,
    founderConsult => founderConsult.founderConsultManagements,
  )
  @JoinColumn({ name: 'FOUNDER_CONSULT_NO' })
  founderConsult?: FounderConsult;

  @OneToOne(type => CompanyUser)
  @JoinColumn({ name: 'COMPANY_USER_NO' })
  companyUser?: CompanyUser;
}
