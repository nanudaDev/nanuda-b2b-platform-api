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
    name: 'REGION_1DEPTHNAME',
    type: 'varchar',
    nullable: false,
  })
  region1DepthName: string;

  @Column({
    name: 'REGION_2DEPTHNAME',
    type: 'varchar',
    nullable: false,
  })
  region2DepthName: string;

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
