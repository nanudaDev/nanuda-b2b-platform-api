import { YN } from 'src/common';
import { BaseMapperEntity, KbFoodCategory } from 'src/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'TRACK_TRACE_SPACE_TO_CATEGORY' })
export class TrackTraceToSpaceCategory extends BaseMapperEntity<
  TrackTraceToSpaceCategory
> {
  @PrimaryGeneratedColumn({
    name: 'NO',
    type: 'int',
    unsigned: true,
  })
  no: number;

  @Column({
    name: 'GU_NAME',
    type: 'varchar',
    nullable: false,
  })
  hdongName: string;

  //   TODO: crawl KB_CATEGORY CODE into common code folder
  @Column({
    name: 'KB_FOOD_CATEGORY',
    type: 'varchar',
  })
  kbFoodCategory?: KbFoodCategory;

  @Column({
    name: 'IS_SKIPPED_YN',
    type: 'char',
  })
  isSkippedYn?: YN;
}
