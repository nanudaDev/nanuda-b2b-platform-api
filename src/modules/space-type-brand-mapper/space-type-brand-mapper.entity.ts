import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { SPACE_TYPE } from 'src/core';

@Entity({ name: 'SPACE_TYPE_BRAND_MAPPER' })
export class SpaceTypeBrandMapper {
  @PrimaryGeneratedColumn({
    name: 'NO',
    type: 'int',
    unsigned: true,
  })
  no: number;

  @Column({
    name: 'BRAND_NO',
    type: 'int',
  })
  brandNo: number;

  @Column({
    name: 'BRAND_NAME',
    type: 'varchar',
  })
  brandName: string;

  @Column({
    type: 'int',
    name: 'SPACE_TYPE_NO',
  })
  spaceTypeNo: SPACE_TYPE;
}
