import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from 'src/core';
import { AMENITY } from 'src/shared';
import { Space } from '../space/space.entity';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { Company } from '../company/company.entity';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';

@Entity({ name: 'AMENITY' })
export class Amenity extends BaseEntity<Amenity> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'AMENITY_NAME',
  })
  amenityName: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'AMENITY_CODE',
  })
  amenityCode: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'AMENITY_TYPE',
  })
  amenityType: AMENITY;

  @Column({
    type: 'int',
    nullable: true,
    name: 'SPACE_TYPE_NO',
  })
  spaceTypeNo: number;

  @ManyToMany(
    type => Space,
    space => space.amenities,
  )
  @JoinTable({
    name: 'AMENITY_SPACE_MAPPER',
    joinColumn: {
      name: 'AMENITY_NO',
    },
    inverseJoinColumn: {
      name: 'SPACE_NO',
    },
  })
  spaces?: Space[];

  @ManyToMany(
    type => DeliverySpace,
    deliverySpace => deliverySpace.amenities,
  )
  @JoinTable({
    name: 'B2B_DELIVERY_SPACE_AMENITY_MAPPER',
    joinColumn: {
      name: 'AMENITY_NO',
    },
    inverseJoinColumn: {
      name: 'DELIVERY_SPACE_NO',
    },
  })
  deliverySpaces?: DeliverySpace[];

  @ManyToMany(
    type => CompanyDistrict,
    companyDistrict => companyDistrict.amenities,
  )
  @JoinTable({
    name: 'B2B_COMPANY_DISTRICT_AMENITY_MAPPER',
    joinColumn: {
      name: 'AMENITY_NO',
    },
    inverseJoinColumn: {
      name: 'COMPANY_DISTRICT_NO',
    },
  })
  companyDistricts?: CompanyDistrict[];
}
