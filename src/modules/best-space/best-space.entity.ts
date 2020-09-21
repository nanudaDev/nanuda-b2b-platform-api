import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseMapperEntity, SPACE_TYPE } from 'src/core';
import { YN } from 'src/common';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { Space } from '../space/space.entity';

@Entity({ name: 'BEST_SPACE_MAPPER' })
export class BestSpaceMapper extends BaseMapperEntity<BestSpaceMapper> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'SPACE_NO',
    nullable: false,
  })
  spaceNo: number;

  @Column({
    type: 'int',
    name: 'SPACE_TYPE_NO',
    nullable: false,
  })
  spaceTypeNo: SPACE_TYPE;

  @Column({
    type: 'char',
    name: 'SHOW_YN',
    default: YN.NO,
    nullable: false,
  })
  showYn?: YN;

  @OneToOne(type => DeliverySpace)
  @JoinColumn({ name: 'SPACE_NO' })
  deliverySpace?: DeliverySpace;

  @OneToOne(type => Space)
  @JoinColumn({ name: 'SPACE_NO' })
  space?: Space;
}
