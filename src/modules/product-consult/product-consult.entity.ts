import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from 'src/core';
import { PRODUCT_CONSULT, SPACE_TYPE } from 'src/shared';
import { YN, AVAILABLE_TIME } from 'src/common';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { Admin } from '../admin';
import { CodeManagement } from '../code-management/code-management.entity';
import { AddressInfo } from '../address-info/address-info.entity';
import { SpaceType } from '../space-type/space-type.entity';

@Entity({ name: 'PRODUCT_CONSULT' })
export class ProductConsult extends BaseEntity<ProductConsult> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'NO',
  })
  no: number;

  @Column('int', {
    nullable: false,
    name: 'NANUDA_USER_NO',
  })
  nanudaUserNo: number;

  @Column('varchar', {
    nullable: true,
    default: PRODUCT_CONSULT.P_NEW_REG,
    name: 'STATUS',
  })
  status?: PRODUCT_CONSULT;

  @Column('int', {
    nullable: true,
    name: 'P_CONSULT_MANAGER',
  })
  pConsultManager?: number;

  @Column('int', {
    nullable: true,
    name: 'PRODUCT_ID',
  })
  productId?: number;

  @Column('datetime', {
    nullable: true,
    name: 'CONFIRM_DATE',
  })
  confirmDate?: Date;

  @Column('datetime', {
    nullable: false,
    name: 'HOPE_DATE',
  })
  hopeDate?: Date;

  @Column('varchar', {
    length: 10,
    nullable: true,
    name: 'HOPE_TIME',
  })
  hopeTime?: AVAILABLE_TIME;

  @Column('char', {
    length: 1,
    default: YN.NO,
    name: 'CHANGUP_EXP_YN',
  })
  changUpExpYn?: YN;

  @Column('text', {
    nullable: true,
    name: 'P_CONSULT_ETC',
  })
  pConsultEtc?: string;

  @Column('int', {
    default: 0,
    nullable: false,
    name: 'SPACE_TYPE_NO',
  })
  spaceTypeNo?: SPACE_TYPE;

  @Column({
    type: 'varchar',
    name: 'NON_USER_NAME',
  })
  nonUserName?: string;

  @Column({
    type: 'varchar',
    name: 'NON_USER_PHONE',
  })
  nonUserPhone?: string;

  @ManyToOne(
    type => NanudaUser,
    nanudaUser => nanudaUser.productConsults,
  )
  @JoinColumn({ name: 'NANUDA_USER_NO' })
  nanudaUser?: NanudaUser;

  @ManyToOne(type => Admin)
  @JoinColumn({ name: 'P_CONSULT_MANAGER' })
  admin?: Admin;

  @ManyToOne(type => CodeManagement)
  @JoinColumn({ name: 'STATUS', referencedColumnName: 'key' })
  codeManagement?: CodeManagement;

  @OneToOne(type => AddressInfo)
  @JoinColumn({ name: 'ADDRESS_CODE', referencedColumnName: 'addressCode' })
  addressInfo?: Promise<AddressInfo>;

  // 가능한 시간
  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'HOPE_TIME', referencedColumnName: 'key' })
  availableTime?: CodeManagement;

  @OneToOne(type => SpaceType)
  @JoinColumn({ name: 'SPACE_TYPE_NO' })
  spaceType?: SpaceType;
}
