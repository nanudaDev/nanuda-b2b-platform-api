import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseMapperEntity } from 'src/core';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';

@Entity({ name: 'B2B_DELIVERY_FOUNDER_CONSULT_CONTRACT_HISTORY' })
export class DeliveryFounderConsultContractHistory extends BaseMapperEntity<
  DeliveryFounderConsultContractHistory
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
    deliverySpace => deliverySpace.previousContracts,
  )
  @JoinColumn({ name: 'DELIVERY_SPACE_NO' })
  deliverySpace?: DeliverySpace;
}
