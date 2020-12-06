import { BaseMapperEntity } from 'src/core';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';

@Entity({ name: 'B2B_DELIVERY_FOUNDER_CONSULT_RECORD' })
export class DeliveryFounderConsultRecord extends BaseMapperEntity<
  DeliveryFounderConsultRecord
> {
  @PrimaryGeneratedColumn({
    name: 'NO',
    type: 'int',
    unsigned: true,
  })
  no: number;

  @Column({
    name: 'DELIVERY_FOUNDER_CONSULT_NO',
    type: 'int',
  })
  deliveryFounderConsultNo: number;

  @Column({
    name: 'PREV_DELIVERY_SPACE_NO',
    type: 'int',
  })
  prevDeliverySpaceNo: number;

  @Column({
    name: 'NEW_DELIVERY_SPACE_NO',
    type: 'int',
  })
  newDeliverySpaceNo: number;

  @Column({
    name: 'ADMIN_NO',
    type: 'int',
  })
  adminNo: number;

  @OneToOne(type => DeliverySpace)
  @JoinColumn({ name: 'PREV_DELIVERY_SPACE_NO' })
  prevDeliverySpace?: DeliverySpace;

  @OneToOne(type => DeliverySpace)
  @JoinColumn({ name: 'NEW_DELIVERY_SPACE_NO' })
  newDeliverySpace?: DeliverySpace;
}
