import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseMapperEntity } from 'src/core';
import { YN } from 'src/common';
import { SurveyQuestion } from '../survey-question/survey-question.entity';
import { SurveyAnswer } from '../survey-answer/survey-answer.entity';

@Entity({ name: 'SURVEY_QUESTION_ANSWER_MAPPER' })
export class SurveyQuestionAnswerMapper extends BaseMapperEntity<
  SurveyQuestionAnswerMapper
> {
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
  questionNo: number;

  @Column({
    type: 'int',
    name: 'RIGHT_ANSWER_NO',
  })
  rightAnswerNo: number;

  @Column({
    type: 'int',
    name: 'LEFT_ANSWER_NO',
  })
  leftAnswerNo: number;

  @Column({
    type: 'int',
    name: 'RIGHT_ANSWER_RESPONSE_NO',
  })
  rightAnswerResponseNo?: number;

  @Column({
    type: 'int',
    name: 'LEFT_ANSWER_RESPONSE_NO',
  })
  leftAnswerResponseNo?: number;

  @Column({
    type: 'int',
    name: 'LAST_RIGHT_RESPONSE',
  })
  lastRightResponse?: number;

  @Column({
    type: 'int',
    name: 'LAST_LEFT_RESPONSE',
  })
  lastLeftResponse?: number;

  @Column({
    type: 'int',
    name: 'IS_LAST_QUESTION_YN',
    nullable: false,
    default: YN.NO,
  })
  isLastQuestionYn?: YN;

  @Column({
    type: 'char',
    name: 'ADDRESS_SELECT_YN',
    default: YN.NO,
  })
  addressSelectYn: YN;

  @OneToOne(type => SurveyQuestion)
  @JoinColumn({ name: 'QUESTION_NO' })
  question?: SurveyQuestion;

  @OneToOne(type => SurveyAnswer)
  @JoinColumn({ name: 'RIGHT_ANSWER_NO' })
  rightAnswer?: SurveyAnswer;

  @OneToOne(type => SurveyAnswer)
  @JoinColumn({ name: 'LEFT_ANSWER_NO' })
  leftAnswer?: SurveyAnswer;
}
