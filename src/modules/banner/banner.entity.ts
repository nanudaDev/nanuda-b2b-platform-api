import { BANNER_TYPE, BaseEntity, LINK_TYPE } from 'src/core';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { FileAttachmentDto } from '../file-upload/dto';
import { YN } from 'src/common';
import { Admin } from '../admin';
import { CodeManagement } from '../code-management/code-management.entity';

@Entity({ name: 'BANNER' })
export class Banner extends BaseEntity<Banner> {
  @PrimaryGeneratedColumn({
    name: 'NO',
    type: 'int',
    unsigned: true,
  })
  no: number;

  @Column({
    name: 'ADMIN_NO',
    type: 'int',
    nullable: false,
  })
  adminNo: number;

  @Column({
    name: 'TITLE',
    type: 'varchar',
    nullable: false,
  })
  title: string;

  //   TODO: add banner type
  @Column({
    name: 'BANNER_TYPE',
    type: 'varchar',
  })
  bannerType?: BANNER_TYPE;

  @Column({
    name: 'LINK_TYPE',
    type: 'varchar',
    nullable: false,
    default: LINK_TYPE.INTERNAL,
  })
  linkType: LINK_TYPE;

  @Column({
    type: 'varchar',
    name: 'URL',
    nullable: true,
  })
  url?: string;

  @Column({
    type: 'json',
    name: 'IMAGE',
  })
  image?: FileAttachmentDto[];

  @Column({
    type: 'json',
    name: 'MOBILE_IMAGE',
  })
  mobileImage?: FileAttachmentDto[];

  @Column({
    name: 'SHOW_YN',
    type: 'char',
    nullable: false,
    default: YN.NO,
  })
  showYn: YN;

  @Column({
    name: 'DESC',
    type: 'text',
  })
  desc?: string;

  @Column({
    name: 'STARTED',
    type: 'datetime',
  })
  started?: Date;

  @Column({
    name: 'ENDED',
    type: 'datetime',
  })
  ended?: Date;

  @ManyToOne(type => Admin)
  @JoinColumn({ name: 'ADMIN_NO' })
  admin?: Admin;

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'BANNER_TYPE', referencedColumnName: 'key' })
  codeManagement?: CodeManagement;
}
