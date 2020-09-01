import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { BaseMapperEntity } from 'src/core';

@Entity({ name: 'B2B_DELIVERY_SPACE_AMENITY_MAPPER' })
export class DeliverySpaceAmenityMapper extends BaseMapperEntity<
  DeliverySpaceAmenityMapper
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
    name: 'COMPANY_USER_NO',
  })
  companyUserNo?: number;

  @Column({
    type: 'int',
    name: 'ADMIN_NO',
  })
  adminNo?: number;

  @Column({
    type: 'int',
    name: 'AMENITY_NO',
    nullable: false,
  })
  amenityNo: number;
}
