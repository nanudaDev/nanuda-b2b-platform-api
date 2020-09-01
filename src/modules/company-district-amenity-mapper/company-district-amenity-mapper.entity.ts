import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseMapperEntity } from 'src/core';

@Entity({ name: 'B2B_COMPANY_DISTRICT_AMENITY_MAPPER' })
export class CompanyDistrictAmenityMapper extends BaseMapperEntity<
  CompanyDistrictAmenityMapper
> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'AMENITY_NO',
    nullable: false,
  })
  amenityNo: number;

  @Column({
    type: 'int',
    name: 'COMPANY_NO',
    nullable: false,
  })
  companyNo: number;

  @Column({
    type: 'int',
    name: 'COMPANY_DISTRICT_NO',
    nullable: false,
  })
  companyDistrictNo: number;

  @Column({
    type: 'int',
    name: 'COMPANY_USER_NO',
  })
  companyUserNo?: number;

  @Column({
    type: 'int',
    name: 'ADMIN_NO',
  })
  adminNo?: number;
}
