import { ENVIRONMENT } from 'src/config';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

require('dotenv').config();
let tableName = '';
if (
  process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT ||
  process.env.NODE_ENV === ENVIRONMENT.STAGING
) {
  tableName = process.env.STAGING_MESSAGE_INDEX_TABLE;
} else {
  tableName = process.env.PRODUCTION_MESSAGE_INDEX_TABLE;
}
@Entity(tableName)
export class IndexMessage {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
  })
  id: number;

  @Column({
    type: 'varchar',
    name: 'h_code',
    nullable: false,
  })
  hCode: string;

  @Column({
    type: 'json',
    nullable: false,
  })
  message: any[];

  @Column({
    type: 'int',
    name: 'query_count',
    default: 1,
  })
  queryCount: number;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  created: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated: Date;
}
