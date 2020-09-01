import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { BaseDto, BaseEntity } from 'src/core';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';

@Entity({ name: 'B2B_DELIVERY_FOUNDER_CONSULT_CONTRACT' })
export class DeliveryFounderConsultContract extends BaseEntity<
  DeliveryFounderConsultContract
> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'COMPANY_NO',
    nullable: false,
  })
  companyNo: number;

  @Column({
    type: 'int',
    name: 'NANUDA_USER_NO',
    nullable: false,
  })
  nanudaUserNo: number;

  @Column({
    type: 'int',
    name: 'DELIVERY_SPACE_NO',
  })
  deliverySpaceNo: number;

  @Column({
    type: 'int',
    name: 'COMPANY_DISTRICT_NO',
  })
  companyDistrictNo: number;

  @Column({
    type: 'int',
    name: 'DELIVERY_FOUNDER_CONSULT_NO',
  })
  deliveryFounderConsultNo: number;

  @ManyToOne(
    type => DeliverySpace,
    deliverySpace => deliverySpace.contracts,
  )
  @JoinColumn({ name: 'DELIVERY_SPACE_NO' })
  deliverySpace?: DeliverySpace;

  @ManyToOne(
    type => NanudaUser,
    nanudaUser => nanudaUser.deliveryFounderConsultContracts,
  )
  @JoinColumn({ name: 'NANUDA_USER_NO' })
  nanudaUser?: NanudaUser;
}
