import { BaseEntity } from 'src/core';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { YN } from 'src/common';
import { Question } from '../question/question.entity';

@Entity({ name: 'ANSWER' })
export class Answer extends BaseEntity<Answer> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'QUESTION_NO',
  })
  questionNo?: number;

  @Column({
    type: 'text',
    name: 'ANSWER',
  })
  answer: string;

  @Column({
    type: 'int',
    name: 'RESPONSE_QUESTION_NO',
  })
  responseQuestionNo?: number;

  @Column({
    type: 'char',
    name: 'IS_LAST_YN',
    nullable: false,
    default: YN.NO,
  })
  isLastYn: YN;

  @Column({
    type: 'varchar',
    name: 'RESPONSE_URL',
  })
  responseUrl?: string;

  @ManyToOne(
    type => Question,
    question => question.answers,
  )
  @JoinColumn({ name: 'QUESTION_NO' })
  question?: Question;
}
