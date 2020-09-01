import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from 'src/core';
import { Space } from '../space/space.entity';
import { YN } from 'src/common';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';

@Entity({ name: 'DELIVERY_SPACE_OPTION' })
export class DeliverySpaceOption extends BaseEntity<DeliverySpaceOption> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'NO',
  })
  no: number;

  @Column({
    type: 'int',
    name: 'ADMIN_NO',
    nullable: false,
  })
  adminNo: number;

  @Column({
    type: 'varchar',
    name: 'DELIVERY_SPACE_OPTION_CODE',
    nullable: false,
  })
  deliverySpaceOptionCode: string;

  @Column({
    type: 'varchar',
    name: 'DELIVERY_SPACE_OPTION_NAME',
    nullable: true,
  })
  deliverySpaceOptionName?: string;

  @Column({
    type: 'text',
    name: 'DESC',
    nullable: true,
  })
  desc?: string;

  @Column({
    type: 'char',
    length: 1,
    name: 'SHOW_YN',
    default: YN.YES,
  })
  showYn?: YN;

  // Delivery space options.
  @ManyToMany(
    type => Space,
    space => space.deliverySpaceOptions,
  )
  @JoinTable({
    name: 'DELIVERY_SPACE_OPTION_SPACE_MAPPER',
    joinColumn: {
      name: 'DELIVERY_SPACE_NO',
    },
    inverseJoinColumn: {
      name: 'SPACE_NO',
    },
  })
  spaces?: Space[];

  @ManyToMany(
    type => DeliverySpace,
    deliverySpace => deliverySpace.deliverySpaceOptions,
  )
  @JoinTable({
    name: 'B2B_DELIVERY_SPACE_DELIVERY_OPTION_MAPPER',
    joinColumn: {
      name: 'DELIVERY_SPACE_OPTION_NO',
    },
    inverseJoinColumn: {
      name: 'DELIVERY_SPACE_NO',
    },
  })
  deliverySpaces?: DeliverySpace[];
}
