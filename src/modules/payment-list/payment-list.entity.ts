import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { BaseEntity, BaseKitchenEntity } from 'src/core';
import { NanudaKitchenMaster } from '../nanuda-kitchen-master/nanuda-kitchen-master.entity';
import { KioskOrderList } from '../kiosk-order-list/kiosk-order-list.entity';

@Entity({ name: 'PAYMENT_LIST' })
export class PaymentList extends BaseKitchenEntity<PaymentList> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'PAYMENT_LIST_NO',
  })
  paymentListNo: number;

  @Column('int', {
    name: 'NANUDA_NO',
    nullable: true,
  })
  nanudaNo: number;

  @Column('char', {
    length: 20,
    name: 'RESULT_VAL',
  })
  resultVal: string;

  @Column('char', {
    length: 20,
    name: 'TRAN_NO',
  })
  tranNo: string;

  @Column('char', {
    length: 20,
    name: 'TMP_TRAN_NO',
  })
  tmpTranNo: string;

  @Column('char', {
    length: 20,
    name: 'TRAN_UNIQUE',
  })
  tranUnique: string;

  @Column('char', {
    length: 30,
    name: 'CARD_NO',
  })
  cardNo: string;

  @Column('char', {
    length: 30,
    name: 'ISSUER_NAME',
  })
  issuerName: string;

  @Column('char', {
    length: 30,
    name: 'ACQUIRER_NAME',
  })
  acquirerName: string;

  @Column('char', {
    length: 30,
    name: 'SHOP_NAME',
  })
  shopName: string;

  @Column('char', {
    length: 20,
    name: 'TRAN_TYPE',
  })
  tranType: string;

  @Column('char', {
    length: 20,
    name: 'CAT_ID',
  })
  catId: string;

  @Column('char', {
    length: 30,
    name: 'BUSINESS_NO',
  })
  businessNo: string;

  @Column('char', {
    length: 30,
    name: 'DONGLE_TYPE',
  })
  dongleType: string;

  @Column('char', {
    length: 30,
    name: 'TOTAL_AMOUNT',
  })
  totalAmount: string;

  @Column('char', {
    length: 30,
    name: 'AMOUNT',
  })
  amount: string;

  @Column('char', {
    length: 30,
    name: 'SURTAX',
  })
  surTax: string;

  @Column('char', {
    length: 100,
    name: 'INSTALLMENT',
  })
  installment: string;

  @Column('char', {
    length: 100,
    name: 'MERCHANT_NO',
  })
  merchantNo: string;

  @Column('char', {
    length: 100,
    name: 'MSG',
  })
  msg: string;

  @Column('char', {
    length: 20,
    name: 'APPROVAL_NO',
  })
  approvalNo: string;

  @Column('char', {
    length: 20,
    name: 'APPROVAL_DATE',
  })
  approvalDate: string;

  @Column('char', {
    length: 30,
    name: 'CASH_ID',
  })
  cashId: string;

  @Column('char', {
    length: 30,
    name: 'CASH_TYPE',
  })
  cashType: string;

  @Column('tinytext', {
    name: 'PRT_MSG',
  })
  prtMsg: string;

  @Column('char', {
    length: 2,
    name: 'CARD_CANCEL_FL',
  })
  cardCancelFl: string;

  // select query builder를 따로 만들지 않기 위해 치환자는 createdAt으로 고정한다
  @Column('datetime', {
    name: 'PAYMENT_TIME',
    nullable: true,
  })
  createdAt: Date;

  @OneToOne(type => KioskOrderList)
  @JoinColumn({ name: 'APPROVAL_NO', referencedColumnName: 'approvalNo' })
  kioskOrderList?: KioskOrderList;

  @ManyToOne(
    type => NanudaKitchenMaster,
    nanudaKitchenMaster => nanudaKitchenMaster.paymentLists,
  )
  @JoinColumn({ name: 'NANUDA_NO' })
  nanudaKitchenMaster?: NanudaKitchenMaster;
}
