import { YN } from 'src/common';
import { BaseEntity, LINK_TYPE, POPUP } from 'src/core';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CodeManagement } from '../code-management/code-management.entity';
import { FileAttachmentDto } from '../file-upload/dto';

@Entity({ name: 'POPUP' })
export class Popup extends BaseEntity<Popup> {
  @PrimaryGeneratedColumn({
    name: 'NO',
    type: 'int',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'TITLE',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    name: 'SUB_TITLE',
  })
  subTitle?: string;

  @Column({
    type: 'text',
    name: 'CONTENT',
  })
  content?: string;

  @Column({
    type: 'datetime',
    name: 'START_DATE',
  })
  started?: Date;

  @Column({
    type: 'datetime',
    name: 'END_DATE',
  })
  ended?: Date;

  @Column({
    type: 'varchar',
    name: 'LINK',
  })
  link?: string;

  @Column({
    type: 'varchar',
    name: 'LINK_TYPE',
  })
  linkType?: LINK_TYPE;

  @Column({
    name: 'IMAGES',
    type: 'json',
    default: () => '(json_array())',
  })
  images?: FileAttachmentDto[];

  @Column({
    type: 'varchar',
    name: 'POPUP_TYPE',
  })
  popupType?: POPUP;

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

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'POPUP_TYPE', referencedColumnName: 'key' })
  codeManagement?: CodeManagement;
}
