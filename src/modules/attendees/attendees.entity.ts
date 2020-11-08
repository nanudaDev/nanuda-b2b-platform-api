import { YN } from 'src/common';
import { BaseEntity, GENDER } from 'src/core';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CodeManagement } from '../code-management/code-management.entity';
import { PresentationEvent } from '../presentation-event/presentation-event.entity';

@Entity({ name: 'ATTENDEES' })
export class Attendees extends BaseEntity<Attendees> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    name: 'NAME',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'PHONE',
    type: 'varchar',
  })
  phone: string;

  @Column({
    name: 'EVENT_NO',
    type: 'int',
    nullable: false,
  })
  eventNo: number;

  @Column({
    type: 'char',
    name: 'IS_CONTRACTED',
    default: YN.NO,
  })
  isContracted: string;

  @Column({
    type: 'char',
    name: 'IS_ATTENDED',
    default: YN.NO,
  })
  isAttended: string;

  @Column({
    type: 'char',
    name: 'GENDER',
  })
  gender?: GENDER;

  //   is nanuda user or no
  isNanudaUser?: YN;

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'GENDER', referencedColumnName: 'key' })
  genderInfo?: CodeManagement;

  @ManyToOne(
    type => PresentationEvent,
    presentationEvent => presentationEvent.signedUpAttendees,
  )
  @JoinColumn({ name: 'EVENT_NO' })
  event: PresentationEvent;
}
