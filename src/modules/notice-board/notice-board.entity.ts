import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { BaseEntity, NOTICE_BOARD } from 'src/core';
import { Admin } from '../admin';
import { CodeManagement } from '../code-management/code-management.entity';
import { FileAttachmentDto } from '../file-upload/dto';
import { YN } from 'src/common';

@Entity({ name: 'B2B_NOTICE_BOARD' })
export class NoticeBoard extends BaseEntity<NoticeBoard> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'TITLE',
    nullable: false,
  })
  title?: string;

  @Column({
    type: 'text',
    name: 'CONTENT',
    nullable: true,
  })
  content: string;

  @Column({
    type: 'int',
    name: 'ADMIN_NO',
    nullable: false,
  })
  adminNo: number;

  @Column({
    type: 'varchar',
    name: 'URL',
  })
  url?: string;

  @Column({
    type: 'varchar',
    name: 'NOTICE_BOARD_TYPE',
    nullable: false,
    default: () => NOTICE_BOARD.NORMAL_NOTICE,
  })
  noticeBoardType: NOTICE_BOARD;

  @Column({
    type: 'json',
    name: 'ATTACHMENTS',
  })
  attachments?: FileAttachmentDto[];

  @Column({
    type: 'datetime',
  })
  started?: Date;

  @Column({
    type: 'datetime',
  })
  ended?: Date;

  @Column({
    type: 'char',
    name: 'TEMP_SAVE_YN',
    nullable: false,
    default: YN.YES,
  })
  tempSaveYn?: YN;

  @Column({
    type: 'datetime',
  })
  tempSavedAt?: Date;

  @ManyToOne(type => Admin)
  @JoinColumn({ name: 'ADMIN_NO' })
  admin?: Admin;

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'NOTICE_BOARD_TYPE', referencedColumnName: 'key' })
  codeManagement?: CodeManagement;
}
