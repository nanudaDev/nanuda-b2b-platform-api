import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../core';
import { YN } from 'src/common';
import { SPACE } from 'src/shared';
import { Company } from '../company/company.entity';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { DeliverySpaceOption } from '../delivery-space-option/delivery-space-option.entity';
import { Admin } from '../admin';
import { Amenity } from '../amenity/amenity.entity';
import { SpaceType } from '../space-type/space-type.entity';
import { FounderConsult } from '../founder-consult/founder-consult.entity';
import { CodeManagement } from '../code-management/code-management.entity';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';

@Entity({ name: 'SPACE' })
export class Space extends BaseEntity<Space> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  no: number;

  @Column('varchar', {
    length: 3,
    name: 'GRADE',
    nullable: true,
  })
  grade?: string;

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

  @Column('int', {
    name: 'SPACE_TYPE_NO',
    nullable: true,
  })
  spaceTypeNo?: string;

  @Column('text', {
    name: 'SPACE_INFO',
    nullable: true,
  })
  spaceInfo?: string;

  @Column('int', {
    name: 'NANUDA_USER_NO',
    nullable: true,
  })
  nanudaUserNo?: number;

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

  @Column('varchar', {
    length: 100,
    name: 'ZONECODE',
    nullable: true,
  })
  zoneCode?: string;

  @Column('varchar', {
    length: 100,
    name: 'ADDRESS',
    nullable: false,
  })
  address: string;

  @Column('varchar', {
    length: 100,
    nullable: true,
    name: 'DETAIL_ADDRESS',
  })
  detailAddress?: string;

  @Column('varchar', {
    name: 'ADDRESS_TYPE',
    nullable: true,
  })
  addressType?: string;

  @Column('varchar', {
    length: 1,
    nullable: true,
    name: 'USER_SELECTED_TYPE',
  })
  userSelectedType?: string;

  @Column('varchar', {
    name: 'L_SUBPRIME_YN',
    default: YN.NO,
  })
  lSubprimeYn?: YN;

  @Column('varchar', {
    nullable: true,
    name: 'BCODE',
  })
  bCode?: string;

  @Column('varchar', {
    nullable: true,
    name: 'BNAME',
  })
  bName?: string;

  @Column('varchar', {
    nullable: true,
    name: 'BNAME1',
  })
  bName1?: string;

  @Column('varchar', {
    name: 'BNAME2',
  })
  bName2?: string;

  @Column('varchar', {
    name: 'SIDO',
    nullable: true,
  })
  sido?: string;

  @Column('varchar', {
    name: 'SIGUNGU',
  })
  sigungu?: string;

  @Column('varchar', {
    name: 'SIGUNGU_CODE',
  })
  sigunguCode?: string;

  @Column('varchar', {
    name: 'USER_LANGUAGE_TYPE',
  })
  userLanguageType?: string;

  @Column('varchar', {
    name: 'QUERY',
  })
  query?: string;

  @Column('varchar', {
    length: 100,
    name: 'BUILDING_NAME',
  })
  buildingName?: string;

  @Column('varchar', {
    length: 100,
    name: 'BUILDING_CODE',
  })
  buildingCode?: string;

  @Column('varchar', {
    name: 'APARTMENT',
  })
  apartment?: string;

  @Column('varchar', {
    name: 'JIBUN_ADDRESS',
  })
  jibunAddress?: string;

  @Column('varchar', {
    name: 'JIBUN_ADDRESS_ENGLISH',
  })
  jibunAddressEnglish?: string;

  @Column('varchar', {
    name: 'ROAD_ADDRESS',
  })
  roadAddress?: string;

  @Column('varchar', {
    name: 'ROAD_ADDRESS_ENGLISH',
  })
  roadAddressEnglish?: string;

  @Column('varchar', {
    name: 'AUTOROAD_ADDRESS',
  })
  autoRoadAddress?: string;

  @Column('varchar', {
    name: 'AUTO_ROAD_ADDRESS_ENGLISH',
  })
  autoRoadAddressEnglish?: string;

  @Column('varchar', {
    name: 'AUTOJIBUN_ADDRESS',
  })
  autoJibunAddress?: string;

  @Column('varchar', {
    name: 'AUTOJIBUN_ADDRESS_ENGLISH',
  })
  autoJibunAddressEnglish?: string;

  @Column('varchar', {
    name: 'NO_SELECTED',
  })
  noSelected?: string;

  @Column('varchar', {
    name: 'HNAME',
  })
  hName?: string;

  @Column('varchar', {
    name: 'ROADNAME_CODE',
  })
  roadNameCode?: string;

  @Column('varchar', {
    name: 'ROADNAME',
  })
  roadName?: string;

  @Column('char', {
    name: 'SHOW_YN',
    length: 1,
    nullable: false,
    default: YN.NO,
  })
  showYn: YN;

  @Column('char', {
    length: 1,
    nullable: false,
    name: 'DEL_YN',
    default: YN.NO,
  })
  delYn: YN;

  @Column('varchar', {
    name: 'MANAGER',
  })
  manager?: string;

  @Column('varchar', {
    name: 'STATUS',
    nullable: false,
    default: SPACE.SPACE_NEW_REG,
  })
  status: SPACE;

  @Column('varchar', {
    name: 'NAME',
    nullable: false,
  })
  name?: string;

  @Column('varchar', {
    name: 'SHOW_NAME',
  })
  showName?: string;

  @Column('varchar', {
    name: 'GEN_RES_YN',
    default: YN.YES,
    nullable: false,
  })
  genResYn: YN;

  @Column('varchar', {
    length: 255,
    name: 'FLOOR',
  })
  floor?: string;

  @Column('varchar', {
    name: 'SIZE',
  })
  size?: string;

  @Column('varchar', {
    name: 'SEAT',
  })
  seat?: string;

  @Column('varchar', {
    name: 'B_FIREBALL',
  })
  bFireball?: string;

  @Column('varchar', {
    name: 'S_FIREBALL',
  })
  sFireball?: string;

  @Column('varchar', {
    name: 'DEPOSIT',
  })
  deposit?: string;

  @Column('varchar', {
    name: 'MONTHLY_FEE',
  })
  monthlyFee?: string;

  @Column('varchar', {
    name: 'MONTHLY_RENT',
  })
  monthlyRent?: string;

  @Column('date', {
    name: 'EXPIRY_DATE',
  })
  expiryDate?: Date;

  @Column('text', {
    name: 'ETC',
  })
  etc?: string;

  @Column('varchar', {
    length: 10,
    name: 'RENTAL_TYPE',
  })
  rentalType?: SPACE.TIME | SPACE.ALL | SPACE.KITCHEN;

  @Column('varchar', {
    length: 10,
    name: 'RENTAL_DATE_TYPE',
  })
  rentalDateType?: SPACE.WEEKDAY | SPACE.WEEKEND;

  @Column('text', {
    name: 'RENTAL_CONTENT',
    comment: '공간대여 조건 기타사항',
  })
  rentalContent?: string;

  @Column('varchar', {
    name: 'RENTAL_HOPE_FEE',
  })
  rentalHopeFee?: string;

  @Column('varchar', {
    name: 'RENTAL_FEE',
  })
  rentalFee?: string;

  @Column('date', {
    name: 'RENTAL_START_DATE',
  })
  rentalStartDate?: Date;

  @Column('date', {
    name: 'RENTAL_END_DATE',
  })
  rentalEndDate?: Date;

  @Column('char', {
    length: 1,
    default: YN.NO,
    nullable: false,
    name: 'RENTAL_EXP_YN',
  })
  rentalExpYn: YN;

  @Column('varchar', {
    name: 'ANALYSIS_STATUS',
    default: SPACE.ANALYSIS_READY,
    nullable: false,
  })
  analysisStatus: SPACE;

  @Column('text', {
    name: 'RENTAL_HOPE_ETC',
  })
  rentalHopeEtc?: string;

  @Column('json', {
    name: 'VICINITY_INFO',
  })
  vicinityInfo?: object;

  @OneToOne(type => SpaceType)
  @JoinColumn({ name: 'SPACE_TYPE_NO' })
  spaceType?: SpaceType;

  @ManyToMany(
    type => CompanyDistrict,
    companyDistrict => companyDistrict.spaces,
  )
  @JoinTable({
    name: 'COMPANY_DISTRICT_SPACE_MAPPER',
    joinColumn: {
      name: 'SPACE_NO',
    },
    inverseJoinColumn: {
      name: 'COMPANY_DISTRICT_NO',
    },
  })
  companyDistricts?: CompanyDistrict[];

  //   delivery space options
  @ManyToMany(
    type => DeliverySpaceOption,
    deliverySpaceOption => deliverySpaceOption.spaces,
  )
  @JoinTable({
    name: 'DELIVERY_SPACE_OPTION_SPACE_MAPPER',
    joinColumn: {
      name: 'SPACE_NO',
    },
    inverseJoinColumn: {
      name: 'DELIVERY_SPACE_OPTION_NO',
    },
  })
  deliverySpaceOptions?: DeliverySpaceOption[];

  // amenity and space mapper
  @ManyToMany(
    type => Amenity,
    amenity => amenity.spaces,
  )
  @JoinTable({
    name: 'AMENITY_SPACE_MAPPER',
    joinColumn: {
      name: 'SPACE_NO',
    },
    inverseJoinColumn: {
      name: 'AMENITY_NO',
    },
  })
  amenities?: Amenity[];

  @ManyToOne(
    type => NanudaUser,
    nanudaUser => nanudaUser.spaces,
  )
  @JoinColumn({ name: 'NANUDA_USER_NO' })
  nanudaUser?: NanudaUser;

  @OneToMany(
    type => FounderConsult,
    founderConsult => founderConsult.space,
  )
  founderConsults?: FounderConsult[];

  @Column({
    type: 'int',
    name: 'COMPANY_DISTRICT_CATEGORY_NO',
    nullable: true,
  })
  companyDistrictCategoryNo?: number;
}
