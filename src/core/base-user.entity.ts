import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '.';
import { YN } from '../common';

export class BaseUser extends BaseEntity<BaseUser> {
  constructor(partial?: any) {
    super(partial);
  }
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'NO',
  })
  no: number;

  @Column({
    type: 'varchar',
    length: 12,
    nullable: false,
    unique: true,
    name: 'PHONE',
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'NAME',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    default: YN.NO,
    name: 'DEL_YN',
  })
  delYN: YN;
}
