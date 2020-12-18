import { YN } from 'src/common';
import { BaseMapperEntity } from 'src/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'LANDING_PAGE_SUCCESS_RECORD' })
export class LandingPageSuccessRecord extends BaseMapperEntity<
  LandingPageSuccessRecord
> {
  @PrimaryGeneratedColumn({
    name: 'NO',
    type: 'int',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'LANDING_PAGE_NAME',
  })
  landingPageName: string;

  @Column({
    type: 'varchar',
    name: 'NON_NANUDA_USER_NAME',
    nullable: false,
  })
  nonNanudaUserName: string;

  @Column({
    type: 'varchar',
    name: 'NON_NANUDA_USER_PHONE',
    nullable: false,
  })
  nonNanudaUserPhone: string;

  @Column({
    type: 'char',
    name: 'IS_NANUDA_USER',
    default: YN.NO,
  })
  isNanudaUser?: YN;
}
