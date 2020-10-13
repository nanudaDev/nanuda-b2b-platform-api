import { BaseEntity } from 'src/core';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Space } from '../space/space.entity';

@Entity({ name: 'FILE_MANAGEMENT' })
export class FileManagement extends BaseEntity<FileManagement> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'FILE_PATH',
  })
  filePath: string;

  @Column({
    type: 'varchar',
    name: 'TARGET_TABLE',
  })
  targetTable: string;

  @Column({
    type: 'int',
    name: 'TARGET_TABLE_NO',
  })
  targetTableNo: number;

  //   favorite space only
  image?: string;

  @ManyToOne(
    type => Space,
    space => space.fileManagements,
  )
  @JoinColumn({ name: 'TARGET_TABLE_NO' })
  space?: Space;
}
