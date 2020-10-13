import { BaseEntity } from 'src/core';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Admin } from '../admin';

@Entity({ name: 'CREDENTIAL' })
export class Credential extends BaseEntity<Credential> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'NAME',
    nullable: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    name: 'EMAIL',
  })
  email: string;

  @Column({
    type: 'varchar',
    name: 'PASSWORD',
    nullable: true,
  })
  password: string;

  @Column({
    type: 'int',
    name: 'ADMIN_NO',
    nullable: true,
  })
  adminNo: number;

  @OneToOne(type => Admin)
  @JoinColumn({ name: 'ADMIN_NO' })
  admin?: Admin;
}
