import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '../../core';

@Entity({ name: 'AMENITY_SPACE_MAPPER' })
export class AmenitySpaceMapper extends BaseEntity<AmenitySpaceMapper> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column('int', {
    name: 'AMENITY_NO',
    nullable: false,
  })
  amenityNo: number;

  @Column('int', {
    name: 'SPACE_NO',
    nullable: false,
  })
  spaceNo: number;
}
