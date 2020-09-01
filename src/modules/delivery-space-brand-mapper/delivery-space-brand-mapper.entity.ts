import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseMapperEntity } from 'src/core';

@Entity({ name: 'B2B_DELIVERY_SPACE_BRAND_MAPPER' })
export class DeliverySpaceBrandMapper extends BaseMapperEntity<
  DeliverySpaceBrandMapper
> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'DELIVERY_SPACE_NO',
  })
  deliverySpaceNo: number;

  @Column({
    type: 'int',
    name: 'BRAND_NO',
  })
  brandNo: number;
}
