import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseMapperEntity } from 'src/core';
import { Company } from '../company/company.entity';

@Entity({ name: 'B2B_COMPANY_PRICING' })
export class CompanyPricing extends BaseMapperEntity<CompanyPricing> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'NAME',
  })
  name: string;

  @Column({
    type: 'varchar',
    name: 'OPEN_FEE',
    nullable: false,
  })
  openFee: string;

  @Column({
    type: 'varchar',
    name: 'START_UP_FEE',
  })
  startUpFee: string;

  @Column({
    type: 'int',
    name: 'PARENT_NO',
  })
  parentNo: number;

  @ManyToMany(
    type => Company,
    company => company.pricing,
  )
  @JoinTable({
    name: 'B2B_COMPANY_PRICING_MAPPER',
    joinColumn: {
      name: 'COMPANY_PRICING_NO',
    },
    inverseJoinColumn: {
      name: 'COMPANY_NO',
    },
  })
  companies?: Company[];
}
