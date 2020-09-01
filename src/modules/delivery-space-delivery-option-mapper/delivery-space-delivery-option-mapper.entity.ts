import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseMapperEntity } from 'src/core';

@Entity({ name: 'B2B_DELIVERY_SPACE_DELIVERY_OPTION_MAPPER' })
export class DeliverySpaceDeliveryOptionMapper extends BaseMapperEntity<
  DeliverySpaceDeliveryOptionMapper
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
    nullable: false,
  })
  deliverySpaceNo: number;

  @Column({
    type: 'int',
    name: 'DELIVERY_SPACE_OPTION_NO',
    nullable: false,
  })
  deliverySpaceOptionNo: number;

  @Column({
    type: 'int',
    name: 'COMPANY_USER_NO',
  })
  companyUserNo?: number;

  @Column({
    type: 'int',
    name: 'ADMIN_NO',
  })
  adminNo?: number;
}
