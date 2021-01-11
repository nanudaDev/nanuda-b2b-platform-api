import { BaseEntity, BaseMapperEntity } from 'src/core';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeliverySpaceNndOpRecord } from '../delivery-space-nnd-op-record/delivery-space-nnd-op-record.entity';

@Entity({ name: 'B2B_DELIVERY_SPACE_NND_BRAND_OP_RECORD' })
export class DeliverySpaceNndBrandOpRecord extends BaseMapperEntity<
  DeliverySpaceNndBrandOpRecord
> {
  @PrimaryGeneratedColumn({
    name: 'NO',
    type: 'int',
    unsigned: true,
  })
  no: number;

  @Column({
    name: 'BRAND_NO',
    type: 'int',
  })
  brandNo: number;

  @Column({
    name: 'NND_OP_RECORD_NO',
    type: 'int',
  })
  nndOpRecordNo: number;

  @ManyToOne(
    type => DeliverySpaceNndOpRecord,
    nndRecord => nndRecord.nndBrandOpRecord,
  )
  @JoinColumn({ name: 'NND_OP_RECORD_NO' })
  nndOpRecord?: DeliverySpaceNndOpRecord;
}
