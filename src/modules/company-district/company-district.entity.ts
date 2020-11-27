import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity, APPROVAL_STATUS } from 'src/core';
import { Company } from '../company/company.entity';
import { Space } from '../space/space.entity';
import { CompanyDistrictUpdateHistory } from '../company-district-update-history/company-district-update-history.entity';
import { CodeManagement } from '../code-management/code-management.entity';
import { Amenity } from '../amenity/amenity.entity';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { FileAttachmentDto } from '../file-upload/dto';
import { CompanyDistrictPromotion } from '../company-district-promotion/company-district-promotion.entity';

@Entity({ name: 'COMPANY_DISTRICT' })
export class CompanyDistrict extends BaseEntity<CompanyDistrict> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'NO',
  })
  no: number;

  @Column('int', {
    nullable: false,
    name: 'COMPANY_NO',
  })
  companyNo: number;

  @Column('varchar', {
    nullable: false,
    name: 'NAME_KR',
    length: 45,
  })
  nameKr: string;

  @Column('varchar', {
    nullable: true,
    name: 'NAME_ENG',
    length: 45,
  })
  nameEng?: string;

  @Column({
    type: 'json',
    name: 'IMAGE',
  })
  image?: FileAttachmentDto[];

  @Column('varchar', {
    name: 'ADDRESS',
    length: 500,
    nullable: false,
  })
  address: string;

  @Column({
    type: 'varchar',
    name: 'REGION_1DEPTH_NAME',
  })
  region1DepthName?: string;

  @Column({
    type: 'varchar',
    name: 'REGION_2DEPTH_NAME',
  })
  region2DepthName?: string;

  @Column({
    type: 'varchar',
    name: 'REGION_3DEPTH_NAME',
  })
  region3DepthName?: string;

  @Column('varchar', {
    length: 20,
    name: 'SPACE_SCORE',
    nullable: true,
  })
  spaceScore?: string;

  @Column('varchar', {
    length: 20,
    name: 'ANALYSIS_SCORE',
    nullable: true,
  })
  analysisScore?: string;

  @Column('varchar', {
    length: 20,
    name: 'KB_SCORE',
    nullable: true,
  })
  kbScore?: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    name: 'LAT',
  })
  lat?: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
    name: 'LON',
  })
  lon?: string;

  @Column({
    name: 'H_CODE',
    type: 'varchar',
  })
  hCode?: string;

  @Column({
    name: 'B_CODE',
    type: 'varchar',
  })
  bCode?: string;

  @Column('varchar', {
    name: 'COMPANY_DISTRICT_STATUS',
    default: APPROVAL_STATUS.NEED_APPROVAL,
    nullable: false,
  })
  companyDistrictStatus: APPROVAL_STATUS;

  @Column('json', {
    name: 'VICINITY_INFO',
  })
  vicinityInfo?: object;

  // Relations
  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'COMPANY_DISTRICT_STATUS', referencedColumnName: 'key' })
  codeManagement?: CodeManagement;

  @ManyToOne(
    type => Company,
    company => company.companyDistricts,
  )
  @JoinColumn({ name: 'COMPANY_NO' })
  company?: Company;

  // get many to many for space and company districts
  @ManyToMany(
    type => Space,
    space => space.companyDistricts,
  )
  @JoinTable({
    name: 'COMPANY_DISTRICT_SPACE_MAPPER',
    joinColumn: {
      name: 'COMPANY_DISTRICT_NO',
    },
    inverseJoinColumn: {
      name: 'SPACE_NO',
    },
  })
  spaces?: Space[];

  @ManyToMany(
    type => Amenity,
    amenity => amenity.companyDistricts,
  )
  @JoinTable({
    name: 'B2B_COMPANY_DISTRICT_AMENITY_MAPPER',
    joinColumn: {
      name: 'COMPANY_DISTRICT_NO',
    },
    inverseJoinColumn: {
      name: 'AMENITY_NO',
    },
  })
  amenities?: Amenity[];

  @OneToMany(
    type => DeliverySpace,
    deliverySpace => deliverySpace.companyDistrict,
  )
  deliverySpaces?: DeliverySpace[];

  @ManyToOne(type => CompanyDistrictUpdateHistory)
  @JoinColumn({ name: 'NO', referencedColumnName: 'companyDistrictNo' })
  companyDistrictUpdateHistories?: CompanyDistrictUpdateHistory[];

  @OneToMany(
    type => CompanyDistrictPromotion,
    promotion => promotion.companyDistrict,
  )
  promotions?: CompanyDistrictPromotion[];

  deliverySpaceCount?: number;
}
