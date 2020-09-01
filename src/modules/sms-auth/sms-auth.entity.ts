import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from 'src/core';
import { UserType } from '../auth';

@Entity({ name: 'SMS_AUTH' })
export class SmsAuth extends BaseEntity<SmsAuth> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'PHONE',
    nullable: false,
  })
  phone: string;

  @Column({
    type: 'int',
    name: 'AUTH_CODE',
    nullable: false,
  })
  authCode: number;

  @Column({
    type: 'varchar',
    name: 'USER_TYPE',
  })
  userType?: UserType;
}
