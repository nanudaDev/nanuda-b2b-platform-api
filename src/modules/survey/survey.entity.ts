import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from 'src/core';
import { Question } from '../question/question.entity';

@Entity({ name: 'SURVEY' })
export class Survey extends BaseEntity<Survey> {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'int',
    name: 'NAME',
  })
  name: string;

  @Column({
    type: 'int',
    name: 'INITIAL_QUESTION_NO',
  })
  initialQuestionNo?: number;

  @Column({
    type: 'int',
    name: 'QUESTIONS_LENGTH',
    nullable: false,
    default: 1,
  })
  questionsLength: number;

  @OneToOne(type => Question)
  @JoinColumn({ name: 'INITIAL_QUESTION_NO' })
  question?: Question;
}
