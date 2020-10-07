import { BaseMapperEntity } from 'src/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'BRAND_KIOSK_MAPPER' })
export class BrandKioskMapper extends BaseMapperEntity<BrandKioskMapper> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'BRAND_NO',
    nullable: false,
  })
  brandNo: number;

  @Column({
    type: 'int',
    name: 'KIOSK_NO',
    nullable: false,
  })
  kioskNo: number;
}
