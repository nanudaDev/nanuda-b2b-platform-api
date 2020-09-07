import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity, SPACE } from 'src/core';
import { YN } from 'src/common';
import { FounderConsult } from '../founder-consult/founder-consult.entity';
import { DeliveryFounderConsult } from '../delivery-founder-consult/delivery-founder-consult.entity';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { DeliveryFounderConsultContract } from '../delivery-founder-consult-contract/delivery-founder-consult-contract.entity';
import { Amenity } from '../amenity/amenity.entity';
import { FileAttachmentDto } from '../file-upload/dto/file-upload.dto';
import { DeliverySpaceOption } from '../delivery-space-option/delivery-space-option.entity';
import { CompanyUser } from '../company-user/company-user.entity';
import { FileUpload } from '../file-upload/file-upload.entity';
import { DeliveryFounderConsultContractHistory } from '../delivery-founder-consult-contract-history/delivery-founder-consult-contract-history.entity';
import { Brand } from '../brand/brand.entity';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';

@Entity({ name: 'B2B_DELIVERY_SPACE' })
export class DeliverySpace extends BaseEntity<DeliverySpace> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'TYPE_NAME',
    nullable: false,
  })
  typeName: string;

  @Column({
    type: 'int',
    name: 'ADMIN_NO',
  })
  adminNo?: number;

  @Column({
    type: 'int',
    name: 'COMPANY_USER_NO',
  })
  companyUserNo?: number;

  @Column({
    type: 'int',
    name: 'COMPANY_DISTRICT_NO',
  })
  companyDistrictNo?: number;

  @Column('varchar', {
    length: 100,
    name: 'BUILDING_NAME',
  })
  buildingName?: string;

  @Column({
    name: 'SIZE',
    type: 'int',
  })
  size?: number;

  @Column({
    name: 'IMAGES',
    type: 'json',
    default: () => '(json_array())',
  })
  images?: FileAttachmentDto[];

  @Column({
    type: 'int',
    name: 'QUANTITY',
    default: 1,
  })
  quantity: number;

  @Column('varchar', {
    name: 'DEPOSIT',
  })
  deposit?: string;

  @Column('varchar', {
    name: 'MONTHLY_UTILITY_FEE',
  })
  monthlyUtilityFee?: string;

  @Column('varchar', {
    name: 'MONTHLY_RENT_FEE',
  })
  monthlyRentFee?: string;

  @Column('char', {
    length: 1,
    name: 'SHOW_YN',
    nullable: false,
    default: YN.NO,
  })
  showYn?: YN;

  @Column('char', {
    length: 1,
    name: 'DEL_YN',
    nullable: false,
    default: YN.NO,
  })
  delYn?: YN;

  // no database
  remainingCount?: number;

  // no database
  likedCount?: number;

  @ManyToOne(
    type => CompanyUser,
    companyUser => companyUser.deliverySpaces,
  )
  @JoinColumn({ name: 'COMPANY_USER_NO' })
  companyUser?: CompanyUser;

  @ManyToMany(
    type => Amenity,
    amenities => amenities.deliverySpaces,
  )
  @JoinTable({
    name: 'B2B_DELIVERY_SPACE_AMENITY_MAPPER',
    joinColumn: {
      name: 'DELIVERY_SPACE_NO',
    },
    inverseJoinColumn: {
      name: 'AMENITY_NO',
    },
  })
  amenities?: Amenity[];

  @ManyToMany(
    type => DeliverySpaceOption,
    deliverySpaceOption => deliverySpaceOption.deliverySpaces,
  )
  @JoinTable({
    name: 'B2B_DELIVERY_SPACE_DELIVERY_OPTION_MAPPER',
    joinColumn: {
      name: 'DELIVERY_SPACE_NO',
    },
    inverseJoinColumn: {
      name: 'DELIVERY_SPACE_OPTION_NO',
    },
  })
  deliverySpaceOptions?: DeliverySpaceOption[];

  @ManyToOne(
    type => CompanyDistrict,
    companyDistrict => companyDistrict.deliverySpaces,
  )
  @JoinColumn({ name: 'COMPANY_DISTRICT_NO' })
  companyDistrict?: CompanyDistrict;

  @OneToMany(
    type => DeliveryFounderConsult,
    deliveryFounderConsult => deliveryFounderConsult.deliverySpaces,
  )
  deliveryFounderConsults?: DeliveryFounderConsult[];

  @OneToMany(
    type => DeliveryFounderConsultContract,
    contract => contract.deliverySpace,
  )
  contracts?: DeliveryFounderConsultContract[];

  @OneToMany(
    type => DeliveryFounderConsultContractHistory,
    previousContracts => previousContracts.deliverySpace,
  )
  previousContracts?: DeliveryFounderConsultContractHistory[];

  @ManyToMany(
    type => Brand,
    brand => brand.deliverySpaces,
  )
  @JoinTable({
    name: 'B2B_DELIVERY_SPACE_BRAND_MAPPER',
    joinColumn: {
      name: 'DELIVERY_SPACE_NO',
    },
    inverseJoinColumn: {
      name: 'BRAND_NO',
    },
  })
  brands?: Brand[];

  @ManyToMany(
    type => NanudaUser,
    nanudaUser => nanudaUser.favoriteDeliverySpaces,
  )
  @JoinTable({
    name: 'B2B_FAVORITE_SPACE_MAPPER',
    joinColumn: { name: 'REFERENCE_NO' },
    inverseJoinColumn: { name: 'NANUDA_USER' },
  })
  nanudaUsers?: NanudaUser[];
}
