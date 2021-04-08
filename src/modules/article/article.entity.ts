import { BaseEntity } from 'src/core';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Admin } from '../admin';
import { YN } from 'src/common';
import { FileAttachmentDto } from '../file-upload/dto';

// TODO: article category도 아마 추가할 수도 있음
// 일단은 매체명 정도로
@Entity({ name: 'ARTICLE' })
export class Article extends BaseEntity<Article> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'ADMIN_NO',
    nullable: false,
  })
  adminNo: number;

  @Column({
    type: 'varchar',
    name: 'MEDIA_NAME',
  })
  mediaName?: string;

  @Column({
    type: 'varchar',
    name: 'TITLE',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    name: 'DESC',
  })
  desc?: string;

  @Column({
    type: 'varchar',
    name: 'URL',
    nullable: false,
  })
  url: string;

  @Column({
    type: 'json',
    name: 'IMAGE',
  })
  image?: FileAttachmentDto[];

  @Column({
    type: 'json',
    name: 'ATTACHMENT',
  })
  attachment?: FileAttachmentDto[];

  @Column({
    type: 'char',
    name: 'SHOW_YN',
    nullable: false,
    default: YN.NO,
  })
  showYn: YN;

  @Column({
    type: 'char',
    name: 'ABOUT_US_YN',
    nullable: false,
    default: YN.NO,
  })
  aboutUsYn: YN;

  @OneToOne(type => Admin)
  @JoinColumn({ name: 'ADMIN_NO' })
  admin?: Admin;
}
