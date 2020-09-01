import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseMapperEntity } from 'src/core';
import { UPLOAD_TYPE } from 'src/config';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';

@Entity({ name: 'B2B_FILE_ATTACHMENT' })
export class FileUpload extends BaseMapperEntity<FileUpload> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'REFERENCE_NO',
    nullable: false,
  })
  referenceNo: number;

  @Column({
    type: 'varchar',
    name: 'UPLOAD_TYPE',
    nullable: false,
  })
  uploadType: UPLOAD_TYPE;

  @Column({
    type: 'text',
    name: 'ORIGIN_FILE_NAME',
  })
  originFilename?: string;

  @Column({
    type: 'text',
    name: 'SOURCE',
  })
  source?: string;

  @Column({
    type: 'text',
    name: 'KEY',
  })
  key: string;

  @Column({
    type: 'text',
    name: 'ENDPOINT',
  })
  endpoint?: string;
}
