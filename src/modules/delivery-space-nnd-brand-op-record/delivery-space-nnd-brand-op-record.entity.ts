import { YN } from 'src/common';
import { BaseEntity, BaseMapperEntity } from 'src/core';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Brand } from '../brand/brand.entity';
import { DeliverySpaceNndOpRecord } from '../delivery-space-nnd-op-record/delivery-space-nnd-op-record.entity';

@Entity({ name: 'B2B_DELIVERY_SPACE_NND_OP_BRAND_RECORD' })
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

  @Column({
    name: 'IS_OPERATED_YN',
    type: 'char',
    default: YN.NO,
  })
  isOperatedYn: YN;

  @ManyToOne(
    type => DeliverySpaceNndOpRecord,
    nndRecord => nndRecord.nndBrandOpRecord,
  )
  @JoinColumn({ name: 'NND_OP_RECORD_NO' })
  nndOpRecord?: DeliverySpaceNndOpRecord;

  @OneToOne(type => Brand)
  @JoinColumn({ name: 'BRAND_NO' })
  brand?: Brand;
}
