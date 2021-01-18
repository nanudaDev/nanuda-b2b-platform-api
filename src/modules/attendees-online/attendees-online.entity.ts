import { YN } from 'src/common';
import { BaseDto, BaseEntity, BaseMapperEntity } from 'src/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ATTENDEES_ONLINE' })
export class AttendeesOnline extends BaseMapperEntity<AttendeesOnline> {
  @PrimaryGeneratedColumn({
    name: 'NO',
    type: 'int',
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
    nullable: false,
  })
  phone: string;

  @Column({
    name: 'EVENT_NO',
    type: 'int',
  })
  eventNo: number;

  @Column({
    name: 'EVENT_TIME',
    type: 'int',
    default: '17:00',
  })
  eventTime?: string;

  @Column({
    name: 'THREE_DAY_FLAG',
    type: 'char',
  })
  threeDayFlag?: YN;

  /**
   * 임시 비디오 접속 코드
   */
  @Column({
    name: 'TEMP_VIDEO_KEY',
    type: 'varchar',
  })
  tempCode?: string;

  @Column({
    name: 'PRESENTATION_DATE',
    type: 'datetime',
  })
  presentationDate: any;

  @Column({
    name: 'THREE_DAY_MESSAGE_DATE',
    type: 'varchar',
  })
  threeDayBeforeMessageDate: any;

  @Column({
    name: 'ONE_DAY_BEFORE_MESSAGE_DATE',
    type: 'varchar',
  })
  oneDayBeforeMessageDate: any;

  @Column({
    name: 'REQUEST_IP',
    type: 'varchar',
  })
  requestIp?: string;

  isNanudaUser?: YN;
}
