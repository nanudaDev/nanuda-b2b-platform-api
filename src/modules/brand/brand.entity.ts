import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import {
  BaseEntity,
  SPACE_TYPE,
  BRAND,
  DIFFICULTY,
  STORE_COUNT,
  BRAND_TYPE,
} from 'src/core';
import { YN } from 'src/common';
import { FoodCategory } from '../food-category/food-category.entity';
import { FileAttachmentDto } from '../file-upload/dto';
import { Admin } from '../admin';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { Menu } from '../menu/menu.entity';
import { CodeManagement } from '../code-management/code-management.entity';
import { PaymentList } from '../payment-list/payment-list.entity';
import { SpaceType } from '../space-type/space-type.entity';

@Entity({ name: 'BRAND' })
export class Brand extends BaseEntity<Brand> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'NAME',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'json',
    name: 'LOGO',
  })
  logo?: FileAttachmentDto[];

  @Column({
    type: 'json',
    name: 'MAIN_MENU_IMAGE',
  })
  mainMenuImage?: FileAttachmentDto[];

  @Column({
    type: 'json',
    name: 'MAIN_BANNER',
  })
  mainBanner?: FileAttachmentDto[];

  @Column({
    type: 'json',
    name: 'SIDE_BANNER',
  })
  sideBanner?: FileAttachmentDto[];

  @Column({
    type: 'json',
    name: 'MOBILE_SIDE_BANNER',
  })
  mobileSideBanner?: FileAttachmentDto[];

  @Column({
    type: 'varchar',
    name: 'NAME_KR',
    nullable: false,
  })
  nameKr: string;

  @Column({
    type: 'varchar',
    name: 'NAME_ENG',
  })
  nameEng?: string;

  @Column({
    type: 'text',
    name: 'DESC',
  })
  desc?: string;

  @Column({
    type: 'int',
    name: 'ADMIN_NO',
    nullable: false,
  })
  adminNo: number;

  @Column({
    type: 'int',
    name: 'CATEGORY_NO',
    nullable: false,
  })
  categoryNo: number;

  @Column('char', {
    name: 'IS_RECOMMENDED_YN',
    length: 1,
    default: YN.NO,
    nullable: false,
  })
  isRecommendedYn: YN;

  @Column({
    type: 'varchar',
    name: 'URL_PATH',
  })
  urlPath?: string;

  @Column({
    type: 'varchar',
    name: 'BRAND_TYPE',
  })
  brandType?: BRAND_TYPE;

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

  @Column({
    type: 'varchar',
    name: 'COST',
  })
  cost?: BRAND;

  @Column({
    type: 'varchar',
    name: 'DIFFICULTY',
  })
  difficulty?: DIFFICULTY;

  @Column({
    type: 'varchar',
    name: 'STORE_COUNT',
  })
  storeCount?: STORE_COUNT;

  //TODO: kiosk mapper로 이도애야함
  @Column({
    type: 'int',
    name: 'KIOSK_NO',
  })
  kioskNo?: number;

  @Column({
    type: 'int',
    name: 'SPACE_TYPE_NO',
  })
  spaceTypeNo?: SPACE_TYPE;

  @ManyToMany(
    type => SpaceType,
    spaceType => spaceType.brands,
  )
  @JoinTable({
    name: 'SPACE_TYPE_BRAND_MAPPER',
    joinColumn: {
      name: 'BRAND_NO',
    },
    inverseJoinColumn: {
      name: 'SPACE_TYPE_NO',
    },
  })
  spaceType?: SpaceType[];

  @OneToOne(type => FoodCategory)
  @JoinColumn({ name: 'CATEGORY_NO' })
  category?: FoodCategory;

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'STORE_COUNT', referencedColumnName: 'key' })
  storeCountValue?: CodeManagement;

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'DIFFICULTY', referencedColumnName: 'key' })
  difficultyValue?: CodeManagement;

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'COST', referencedColumnName: 'key' })
  costValue?: CodeManagement;

  @ManyToOne(type => Admin)
  @JoinColumn({ name: 'ADMIN_NO' })
  admin?: Admin;

  @ManyToMany(
    type => DeliverySpace,
    deliverySpace => deliverySpace.brands,
  )
  @JoinTable({
    name: 'B2B_DELIVERY_SPACE_BRAND_MAPPER',
    joinColumn: {
      name: 'BRAND_NO',
    },
    inverseJoinColumn: {
      name: 'DELIVERY_SPACE_NO',
    },
  })
  deliverySpaces?: DeliverySpace[];

  @OneToMany(
    type => Menu,
    menu => menu.brand,
  )
  menus?: Menu[];
}
