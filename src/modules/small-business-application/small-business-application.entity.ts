import { YN } from 'src/common';
import { BaseDto, BaseEntity, SMALL_BUSINESS_APPLICATION } from 'src/core';
import {
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CodeManagement } from '../code-management/code-management.entity';
import { SmallBusinessApplicantExperience } from './small-business-applicant-experience.class';

@Entity({ name: 'SMALL_BUSINESS_APPLICATION' })
export class SmallBusinessApplication extends BaseEntity<
  SmallBusinessApplication
> {
  @PrimaryGeneratedColumn({
    name: 'NO',
    type: 'int',
  })
  no: number;

  @Column({
    name: 'NAME',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'PHONE',
    type: 'varchar',
  })
  phone: string;

  @Column({
    name: 'IS_NANUDA_USER_YN',
    type: 'char',
    default: () => YN.NO,
  })
  isNanudaUserYn: YN;

  @Column({
    name: 'APPLIED_CATEGORY_NO',
    type: 'varchar',
  })
  appliedCategoryNo: SMALL_BUSINESS_APPLICATION;

  @Column({
    name: 'ADDRESS',
    type: 'text',
  })
  address: string;

  @Column({
    name: 'HDONG_CODE',
    type: 'varchar',
  })
  hdongCode: string | number;

  @Column({
    name: 'DATE_OF_BIRTH',
    type: 'varchar',
  })
  dateOfBirth: string;

  @Column({
    name: 'EMAIL',
    type: 'varchar',
  })
  email: string;

  @Column({
    name: 'EXPERIENCE',
    type: 'json',
  })
  experience: SmallBusinessApplicantExperience[];

  @Column({
    name: 'IS_AGREE_YN',
    type: 'char',
    default: () => YN.NO,
  })
  isAgreeYn: YN;

  @Column({
    name: 'IS_AGREE_PRIVACY_YN',
    type: 'char',
    default: () => YN.NO,
  })
  isAgreePrivacyYn: YN;

  @Column({
    name: 'IS_SAVED_YN',
    type: 'char',
    default: () => YN.NO,
  })
  isSavedYn: YN;

  @Column({
    name: 'IS_COMPLETE_YN',
    type: 'char',
    default: () => YN.NO,
  })
  isCompleteYn: YN;

  @OneToOne(type => CodeManagement)
  @JoinColumn({ name: 'APPLIED_CATEGORY_NO', referencedColumnName: 'key' })
  applicationType?: CodeManagement;
}
