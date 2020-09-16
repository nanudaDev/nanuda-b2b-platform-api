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
    type: 'char',
    name: 'SHOW_YN',
    nullable: false,
    default: YN.NO,
  })
  showYn: YN;

  @OneToOne(type => Admin)
  @JoinColumn({ name: 'ADMIN_NO' })
  admin?: Admin;
}
