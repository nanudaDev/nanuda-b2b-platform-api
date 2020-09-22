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
    type: 'text',
    name: 'ANSWER',
  })
  answer: string;
}
