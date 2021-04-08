import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../core';
import { YN } from '../../common';
import { FounderConsult } from '../founder-consult/founder-consult.entity';

@Entity('CODE_MANAGEMENT')
export class CodeManagement extends BaseEntity<CodeManagement> {
  constructor(partial?: any) {
    super(partial);
  }

  // capitalization ONLY FOR CODE MANAGEMENT!!
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, name: 'NO' })
  no: number;

  @Column({ type: 'varchar', length: 20, nullable: false, name: 'KEY' })
  key: string;

  @Column({ name: 'ADDITIONAL_KEY', type: 'varchar' })
  additionalKey: string;

  @Column({ type: 'varchar', length: 20, nullable: false, name: 'VALUE' })
  value: string;

  @Column({ type: 'varchar', length: 255, name: 'DESC' })
  desc: string;

  @Column({ type: 'varchar', length: 20, nullable: false, name: 'CATEGORY_1' })
  category1: string;

  @Column({ type: 'varchar', length: 20, nullable: false, name: 'CATEGORY_2' })
  category2: string;

  @Column({ type: 'int', name: 'ORDER_BY' })
  orderBy: number;

  @Column({
    name: 'SUB_CSS_VALUE',
    type: 'varchar',
  })
  subCssValue: string;

  @Column({
    type: 'varchar',
    length: 1,
    nullable: false,
    default: YN.NO,
    name: 'DEL_YN',
  })
  delYn: string;
}
