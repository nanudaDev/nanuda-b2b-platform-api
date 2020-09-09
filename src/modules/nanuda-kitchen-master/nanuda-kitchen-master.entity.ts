import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseKitchenEntity } from 'src/core';
import { PaymentList } from '../payment-list/payment-list.entity';

@Entity({ name: 'NANUDA_KITCHEN_MASTER' })
export class NanudaKitchenMaster extends BaseKitchenEntity<
  NanudaKitchenMaster
> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NANUDA_NO',
  })
  nanudaNo: number;

  @Column({
    type: 'varchar',
    name: 'NANUDA_NAME',
  })
  nanudaName: string;

  @OneToMany(
    type => PaymentList,
    paymentLists => paymentLists.nanudaKitchenMaster,
  )
  paymentLists?: PaymentList[];
}
