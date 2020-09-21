import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Survey } from './survey.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NanudaSurveyService extends BaseService {
  constructor(
    @InjectRepository(Survey) private readonly surveyRepo: Repository<Survey>,
  ) {
    super();
  }

  async findOne(surveyNo: number): Promise<Survey> {
    const survey = await this.surveyRepo
      .createQueryBuilder('survey')
      .CustomInnerJoinAndSelect(['question'])
      .innerJoinAndSelect('question.answers', 'answers')
      .where('survey.no = :no', { no: surveyNo })
      .getOne();

    return survey;
  }
}
