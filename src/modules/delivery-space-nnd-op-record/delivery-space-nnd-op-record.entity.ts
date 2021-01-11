import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/core';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { DeliverySpaceNndBrandOpRecord } from '../delivery-space-nnd-brand-op-record/delivery-space-nnd-brand-op-record.entity';

@Entity({ name: 'B2B_DELIVERY_SPACE_NND_OP_RECORD' })
export class DeliverySpaceNndOpRecord extends BaseEntity<
  DeliverySpaceNndOpRecord
> {
  @PrimaryGeneratedColumn({
    name: 'NO',
    type: 'int',
    unsigned: true,
  })
  no: number;

  @Column({
    name: 'DELIVERY_SPACE_NO',
    type: 'int',
  })
  deliverySpaceNo: number;

  @Column({
    type: 'datetime',
    name: 'START_DATE',
  })
  started?: Date;

  @Column({
    type: 'datetime',
    name: 'END_DATE',
  })
  ended?: Date;

  @ManyToOne(
    type => DeliverySpace,
    deliverySpace => deliverySpace.nndOpRecord,
  )
  @JoinColumn({ name: 'DELIVERY_SPACE_NO' })
  deliverySpace?: DeliverySpace;

  @OneToMany(
    type => DeliverySpaceNndBrandOpRecord,
    nndBrandRecord => nndBrandRecord.nndOpRecord,
  )
  nndBrandOpRecord?: DeliverySpaceNndBrandOpRecord;
}
