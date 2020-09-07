import {
  Entity,
  Column,
  OneToMany,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseUser } from '../../core/base-user.entity';
import { YN } from 'src/common';
import { UserType } from '../auth';
import { NANUDA_USER, GENDER } from 'src/shared';
import { FounderConsult } from '../founder-consult/founder-consult.entity';
import { CodeManagement } from '../code-management/code-management.entity';
import { Space } from '../space/space.entity';
import { DeliveryFounderConsultContract } from '../delivery-founder-consult-contract/delivery-founder-consult-contract.entity';
import { ProductConsult } from '../product-consult/product-consult.entity';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
@Entity({ name: 'NANUDA_USER' })
export class NanudaUser extends BaseUser {
  @Column({
    type: 'char',
    length: 1,
    nullable: true,
    default: YN.NO,
    name: 'INFO_YN',
  })
  infoYn?: string;

  @Column({
    type: 'char',
    length: 1,
    nullable: true,
    default: YN.YES,
    name: 'SERVICE_YN',
  })
  serviceYn?: string;

  @Column({
    type: 'char',
    length: 1,
    nullable: true,
    default: YN.NO,
    name: 'MARKET_YN',
  })
  marketYn?: string;

  // What is this column for???
  @Column({
    type: 'int',
    nullable: true,
    name: 'REMAIN_VISIT_COUNT',
    default: 1,
  })
  remainVisitCount?: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'LAST_LOGIN_AT',
  })
  lastLoginAt?: Date;

  @Column({
    type: 'char',
    nullable: true,
    name: 'GENDER',
  })
  gender?: GENDER;

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'GENDER', referencedColumnName: 'key' })
  genderInfo?: CodeManagement;

  @OneToMany(
    type => FounderConsult,
    founderConsult => founderConsult.nanudaUser,
  )
  founderConsults?: FounderConsult[];

  @OneToMany(
    type => Space,
    space => space.nanudaUser,
  )
  spaces?: Space[];

  @OneToMany(
    type => DeliveryFounderConsultContract,
    contracts => contracts.nanudaUser,
  )
  deliveryFounderConsultContracts?: DeliveryFounderConsultContract[];

  @OneToMany(
    type => ProductConsult,
    productConsults => productConsults.nanudaUser,
  )
  productConsults?: ProductConsult[];

  @ManyToMany(
    type => DeliverySpace,
    deliverySpace => deliverySpace.favoritedUsers,
  )
  @JoinTable({
    name: 'B2B_FAVORITE_SPACE_MAPPER',
    joinColumn: {
      name: 'NANUDA_USER_NO',
    },
    inverseJoinColumn: {
      name: 'REFERENCE_NO',
    },
  })
  favoriteDeliverySpaces?: DeliverySpace[];
}
