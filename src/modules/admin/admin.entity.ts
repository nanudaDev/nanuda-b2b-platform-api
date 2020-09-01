import { BaseUser } from '../../core/base-user.entity';
import { UserType } from '../auth/types/user.type';
import { Column, Entity, OneToMany, JoinColumn } from 'typeorm';
import { YN } from '../../common';
import { ADMIN_USER, APPROVAL_STATUS } from '../../shared';
import { Exclude, classToPlain } from 'class-transformer';
import { FounderConsult } from '../founder-consult/founder-consult.entity';
import { Brand } from '../brand/brand.entity';

@Entity('ADMIN_USER')
export class Admin extends BaseUser {
  constructor(partial?: any) {
    super(partial);
  }
  @Exclude({ toPlainOnly: true })
  @Column({
    type: 'varchar',
    nullable: false,
    length: 512,
    name: 'PASSWORD',
    default: '12345678',
  })
  password: string;

  @Column({
    type: 'char',
    nullable: false,
    default: YN.YES,
    name: 'ADMIN_YN',
    length: 1,
  })
  adminYN: YN;

  @Column({
    type: 'varchar',
    nullable: false,
    default: ADMIN_USER.NORMAL,
    name: 'AUTH_CODE',
    length: 10,
  })
  authCode: ADMIN_USER;

  // @OneToMany(
  //   type => Brand,
  //   brand => brand.admin,
  // )
  // brands?: Brand[];

  //   need to update to UserType
  // no database column.
  get userType(): UserType {
    return UserType.ADMIN;
  }

  get userStatus(): APPROVAL_STATUS {
    return APPROVAL_STATUS.APPROVAL;
  }

  // No need for database column
  get companyStatus(): APPROVAL_STATUS {
    return APPROVAL_STATUS.APPROVAL;
  }

  companyUserStatus: null;

  toJSON() {
    return classToPlain(this);
  }
}

// TODO: change authCode into json_array
