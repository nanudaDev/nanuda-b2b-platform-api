import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseKitchenEntity } from 'src/core';

@Entity({ name: 'KIOSK_ORDER_LIST' })
export class KioskOrderList extends BaseKitchenEntity<KioskOrderList> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'KIOSK_ORDER_LIST_NO',
    unsigned: true,
  })
  kioskOrderListNo?: number;

  @Column({
    type: 'int',
    name: 'NANUDA_NO',
  })
  nanudaNo?: number;

  @Column({
    type: 'varchar',
    name: 'APPROVAL_NO',
  })
  approvalNo?: string;

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
    type: 'int',
    name: 'MENU_COUNT',
  })
  menuCount?: number;
}
