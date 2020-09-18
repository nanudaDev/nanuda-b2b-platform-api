import { BaseEntity } from 'src/core';
import { PrimaryGeneratedColumn, Entity, Column, OneToMany } from 'typeorm';
import { YN } from 'src/common';
import { Answer } from '../answer/answer.entity';

@Entity({ name: 'QUESTION' })
export class Question extends BaseEntity<Question> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'SURVEY_NO',
  })
  surveyNo: number;

  @Column({
    type: 'text',
    name: 'QUESTION',
    nullable: false,
  })
  question: string;

  @Column({
    type: 'char',
    name: 'INITIAL_QUESTION_YN',
    nullable: false,
    default: YN.NO,
  })
  initialQuestionYn: YN;

  @OneToMany(
    type => Answer,
    answer => answer.question,
  )
  answers?: Answer[];
}
