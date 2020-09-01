import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from 'src/core';
import { YN } from 'src/common';

@Entity({ name: 'SPACE_TYPE' })
export class SpaceType extends BaseEntity<SpaceType> {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'NO',
  })
  no: number;

  @Column('varchar', {
    nullable: false,
    name: 'CODE',
  })
  code: string;

  @Column('varchar', {
    nullable: false,
    name: 'NAME',
  })
  name: string;

  @Column('varchar', {
    nullable: true,
    name: 'DISPLAY_NAME',
  })
  displayName?: string;

  @Column('varchar', {
    nullable: true,
    name: 'DESC',
  })
  desc?: string;

  @Column('char', {
    length: 1,
    name: 'SHOW_YN',
    nullable: false,
    default: YN.NO,
  })
  showYn?: YN;

  @Column('char', {
    length: 1,
    name: 'DEL_YN',
    nullable: false,
    default: YN.NO,
  })
  delYn?: YN;
}
