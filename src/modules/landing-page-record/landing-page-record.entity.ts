import { AdvType } from 'src/common';
import { BaseMapperEntity } from 'src/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'LANDING_PAGE_RECORD' })
export class LandingPageRecord extends BaseMapperEntity<LandingPageRecord> {
  @PrimaryGeneratedColumn({
    name: 'NO',
    type: 'int',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'IP',
  })
  ip?: string;

  @Column({
    type: 'varchar',
    name: 'LANDING_PAGE_NAME',
  })
  landingPageName: string;

  @Column({
    type: 'varchar',
    name: 'ADV_TYPE_SOURCE',
  })
  advType: AdvType;
}
