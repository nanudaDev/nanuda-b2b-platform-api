import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { BaseEntity } from 'src/core';

@Entity({ name: 'SURVEY' })
export class Survey extends BaseEntity<Survey> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'NAME',
  })
  name: string;
}
