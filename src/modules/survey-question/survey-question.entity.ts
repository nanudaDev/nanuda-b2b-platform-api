import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from 'src/core';

@Entity({ name: 'SURVEY_QUESTION' })
export class SurveyQuestion extends BaseEntity<SurveyQuestion> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'QUESTION',
  })
  question: string;

  @Column({
    type: 'int',
    name: 'SURVEY_NO',
  })
  surveyNo: number;
}
