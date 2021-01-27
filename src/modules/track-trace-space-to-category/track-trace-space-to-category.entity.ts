import { BaseMapperEntity } from 'src/core';
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
    name: 'DELIVERY_SPACE_NO',
    type: 'int',
    nullable: false,
  })
  deliverySpaceNo: number;

  //   TODO: crawl KB_CATEGORY CODE into common code folder
  //   @Column({
  //       name: 'KB_FOOD_CATEGORY',
  //       type: 'varchar',
  //   })
}
