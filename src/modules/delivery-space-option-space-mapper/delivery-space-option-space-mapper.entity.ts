import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from 'src/core';
import { Space } from '../space/space.entity';

@Entity({ name: 'DELIVERY_SPACE_OPTION_SPACE_MAPPER' })
export class DeliverySpaceOptionSpaceMapper extends BaseEntity<
  DeliverySpaceOptionSpaceMapper
> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'DELIVERY_SPACE_OPTION_NO',
    nullable: false,
  })
  deliverySpaceOptionNo: number;

  @Column({
    type: 'int',
    name: 'SPACE_NO',
    nullable: false,
  })
  spaceNo: number;
}
