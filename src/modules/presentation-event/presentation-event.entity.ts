import { BaseEntity, PRESENTATION_EVENT_TYPE } from 'src/core';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendees } from '../attendees/attendees.entity';
import { CodeManagement } from '../code-management/code-management.entity';
import { FileAttachmentDto } from '../file-upload/dto';

@Entity({ name: 'PRESENTATION_EVENT' })
export class PresentationEvent extends BaseEntity<PresentationEvent> {
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
    type: 'text',
    name: 'DESC',
  })
  desc?: string;

  @Column({
    name: 'IMAGE',
    type: 'json',
    default: () => '(json_array())',
  })
  image?: FileAttachmentDto[];

  @Column({
    name: 'MOBILE_IMAGE',
    type: 'json',
    default: () => '(json_array())',
  })
  mobileImage?: FileAttachmentDto[];

  @Column({
    type: 'varchar',
    name: 'ADDRESS',
    nullable: false,
  })
  address: string;

  @Column({
    type: 'json',
    name: 'SCHEDULE',
    nullable: false,
  })
  schedule?: string[];

  @Column({
    type: 'varchar',
    name: 'EVENT_TYPE',
    default: PRESENTATION_EVENT_TYPE.COMMON_EVENT,
  })
  eventType: PRESENTATION_EVENT_TYPE;

  @Column({
    type: 'datetime',
    name: 'PRESENTATION_DATE',
    nullable: false,
  })
  presentationDate: Date;

  @Column({
    type: 'varchar',
    name: 'CONTACT_PHONE',
    default: '02-556-5777',
  })
  contactPhone?: string;

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

  //   no database column
  @OneToMany(
    type => Attendees,
    attendees => attendees.event,
  )
  signedUpAttendees?: Attendees;

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'EVENT_TYPEP', referencedColumnName: 'key' })
  eventTypeInfo?: CodeManagement;
}
