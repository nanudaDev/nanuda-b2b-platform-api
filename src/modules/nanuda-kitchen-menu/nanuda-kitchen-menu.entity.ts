import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseKitchenEntity } from 'src/core';
import { YN } from 'src/common';
import { NanudaKitchenMaster } from '../nanuda-kitchen-master/nanuda-kitchen-master.entity';

@Entity({ name: 'NANUDA_KITCHEN_MENU' })
export class NanudaKitchenMenu extends BaseKitchenEntity<NanudaKitchenMenu> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'MENU_NO',
    unsigned: true,
  })
  menuNo: number;

  @Column({
    type: 'int',
    name: 'NANUDA_NO',
  })
  nanudaNo: number;

  @Column({
    type: 'varchar',
    name: 'MENU_CODE',
  })
  menuCode?: string;

  @Column({
    type: 'varchar',
    name: 'MENU_NAME',
  })
  menuName?: string;

  @Column({
    name: 'MENU_DESC',
  })
  menuDesc?: string;

  @Column({
    name: 'MENU_TYPE',
  })
  menuType?: string;

  @Column({
    type: 'char',
    name: 'MENU_VIEW_TYPE',
  })
  menuViewType?: string;

  @Column({
    type: 'int',
    name: 'MENU_PRICE',
  })
  menuPrice?: number;

  @Column({
    type: 'char',
    name: 'KIOSK_USE',
    nullable: false,
    default: YN.YES,
  })
  kioskUse: YN;

  @Column({
    type: 'char',
    name: 'SOLD_OUT',
    nullable: false,
    default: YN.NO,
  })
  soldOut: YN;

  @Column({
    type: 'datetime',
    name: 'REG_DATE',
  })
  createdAt: Date;

  @ManyToOne(
    type => NanudaKitchenMaster,
    nanudaKitchenMaster => nanudaKitchenMaster.menus,
  )
  @JoinColumn({ name: 'NANUDA_NO' })
  nanudaKitchenMaster?: NanudaKitchenMaster;
}
