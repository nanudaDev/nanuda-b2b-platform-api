import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/core';

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
}
