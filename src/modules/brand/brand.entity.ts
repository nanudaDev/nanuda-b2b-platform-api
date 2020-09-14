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
import { BaseEntity } from 'src/core';
import { YN } from 'src/common';
import { FoodCategory } from '../food-category/food-category.entity';
import { FileAttachmentDto } from '../file-upload/dto';
import { Admin } from '../admin';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { Menu } from '../menu/menu.entity';

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

  @OneToOne(type => FoodCategory)
  @JoinColumn({ name: 'CATEGORY_NO' })
  category?: FoodCategory;

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
