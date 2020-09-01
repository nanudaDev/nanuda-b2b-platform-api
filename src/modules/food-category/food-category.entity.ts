import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from 'src/core';
import { YN } from 'src/common';

@Entity({ name: 'FOOD_CATEGORY' })
export class FoodCategory extends BaseEntity<FoodCategory> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'CODE',
    nullable: false,
  })
  code: string;

  @Column({
    type: 'varchar',
    name: 'NAME_KR',
    nullable: false,
  })
  nameKr: string;

  @Column({
    type: 'varchar',
    name: 'NAME_ENG',
    nullable: true,
  })
  nameEng?: string;

  @Column({
    type: 'int',
    name: 'ADMIN_NO',
    nullable: false,
  })
  adminNo: number;

  @Column({
    type: 'char',
    name: 'DEL_YN',
    nullable: false,
    default: YN.NO,
  })
  delYn: YN;
}
