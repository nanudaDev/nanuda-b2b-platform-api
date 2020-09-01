import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from 'src/core';

@Entity({ name: 'SPACE_NANUDA_BRAND' })
export class SpaceNanudaBrand extends BaseEntity<SpaceNanudaBrand> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'BRAND_NO',
  })
  brandNo: number;

  @Column({
    type: 'int',
    name: 'SPACE_ID',
  })
  spaceNo: number;
}
