import { YN } from 'src/common';
import { BaseMapperEntity } from 'src/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'SECOND_MEETING_APPLICANT' })
export class SecondMeetingApplicant extends BaseMapperEntity<
  SecondMeetingApplicant
> {
  @PrimaryGeneratedColumn({
    name: 'NO',
    unsigned: true,
    type: 'int',
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
    name: 'REQUEST_IP',
    type: 'varchar',
  })
  requestIp?: string;

  @Column({
    name: 'FIRST_MEETING_APPLIED_DATE',
    type: 'varchar',
  })
  firstMeetingAppliedDate?: string;

  @Column({
    name: 'IS_NANUDA_USER',
    type: 'char',
    default: YN.NO,
  })
  isNanudaUser?: YN;

  @Column({
    name: 'HOPE_AREA',
    type: 'varchar',
  })
  hopeArea?: string;
}
