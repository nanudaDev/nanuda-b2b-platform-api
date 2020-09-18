import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NanudaQuestionService extends BaseService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {
    super();
  }

  async findOne(questionNo: number): Promise<Question> {
    const question = await this.questionRepo
      .createQueryBuilder('question')
      .CustomInnerJoinAndSelect(['answers'])
      .where('question.no = :no', { no: questionNo })
      .getOne();

    return question;
  }
}
