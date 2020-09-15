import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from 'src/core';
import { YN } from 'src/common';
import { Brand } from '../brand/brand.entity';
import { FileAttachmentDto } from '../file-upload/dto';

@Entity({ name: 'MENU' })
export class Menu extends BaseEntity<Menu> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'NO',
  })
  no: number;

  @Column('int', {
    nullable: false,
    name: 'BRAND_NO',
  })
  brandNo: number;

  @Column('varchar', {
    nullable: false,
    length: 50,
    name: 'NAME_KR',
  })
  nameKr: string;

  @Column('varchar', {
    nullable: true,
    length: 50,
    name: 'NAME_ENG',
  })
  nameEng: string;

  @Column('varchar', {
    length: 1000,
    nullable: true,
    name: 'DESC',
  })
  desc?: string;

  @Column({
    name: 'IMAGES',
    type: 'json',
    default: () => '(json_array())',
  })
  images?: FileAttachmentDto[];

  @Column('char', {
    length: 1,
    default: YN.NO,
    name: 'MAIN_YN',
  })
  mainYn?: YN;

  @Column('char', {
    default: YN.YES,
    nullable: false,
    length: 1,
    name: 'SHOW_YN',
  })
  showYn: YN;

  @Column('char', {
    default: YN.NO,
    nullable: false,
    length: 1,
    name: 'DEL_YN',
  })
  delYn: YN;

  @ManyToOne(
    type => Brand,
    brand => brand.menus,
  )
  @JoinColumn({ name: 'BRAND_NO' })
  brand?: Brand;
}
