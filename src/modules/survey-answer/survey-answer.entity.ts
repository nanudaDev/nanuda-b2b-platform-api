import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from 'src/core';

@Entity({ name: 'SURVEY_ANSWER' })
export class SurveyAnswer extends BaseEntity<SurveyAnswer> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'ANSWER',
    nullable: false,
  })
  answer: string;

  @Column({
    type: 'varchar',
    name: 'SIDE',
  })
  side: string;

  //   used for virtual mapping
  responseQuestionNo?: number;

  responseNo?: number;
}
