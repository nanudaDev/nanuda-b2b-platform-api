import { BaseMapperEntity, SPACE_TYPE } from 'src/core';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { Space } from '../space/space.entity';

@Entity({ name: 'B2B_FAVORITE_SPACE_MAPPER' })
export class FavoriteSpaceMapper extends BaseMapperEntity<FavoriteSpaceMapper> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'NANUDA_USER_NO',
    nullable: false,
  })
  nanudaUserNo: number;

  @Column({
    type: 'int',
    name: 'REFERENCE_NO',
    nullable: false,
  })
  deliverySpaceNo?: number;

  @Column({
    type: 'varchar',
    name: 'SPACE_TYPE_NO',
  })
  spaceTypeNo?: SPACE_TYPE;

  @OneToOne(type => NanudaUser)
  @JoinColumn({ name: 'NANUDA_USER_NO' })
  nanudaUser?: NanudaUser;

  @OneToOne(type => DeliverySpace)
  @JoinColumn({ name: 'REFERENCE_NO' })
  deliverySpace?: DeliverySpace;

  @OneToOne(type => Space)
  @JoinColumn({ name: 'REFERENCE_NO' })
  space?: Space;
}
