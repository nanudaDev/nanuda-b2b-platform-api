import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity, GENDER } from '../../core';
import { YN } from '../../common';

@Entity({ name: 'NANUDA_USER_UPDATE_HISTORY' })
export class NanudaUserUpdateHistory extends BaseEntity<
  NanudaUserUpdateHistory
> {
  constructor(partial?: any) {
    super(partial);
  }

  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'NO',
  })
  no: number;

  @Column({
    type: 'int',
    nullable: false,
    name: 'NANUDA_USER_NO',
  })
  nanudaUserNo: number;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'PHONE',
    length: 20,
  })
  phone: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 20,
    name: 'NAME',
  })
  name: string;

  @Column({
    type: 'char',
    default: YN.NO,
    length: 1,
    name: 'DEL_YN',
  })
  delYn: YN;

  @Column({
    type: 'char',
    default: YN.NO,
    length: 1,
    name: 'INFO_YN',
  })
  infoYn: YN;

  @Column({
    type: 'char',
    default: YN.YES,
    length: 1,
    name: 'SERVICE_YN',
  })
  serviceYn: YN;

  @Column({
    type: 'char',
    default: YN.NO,
    length: 1,
    name: 'MARKET_YN',
  })
  marketYn: YN;

  @Column({
    type: 'char',
    default: 1,
    name: 'REMAIN_VISIT_COUNT',
  })
  remainVisitCount: number;

  @Column({
    type: 'char',
    nullable: true,
    name: 'GENDER',
  })
  gender?: GENDER;
}
