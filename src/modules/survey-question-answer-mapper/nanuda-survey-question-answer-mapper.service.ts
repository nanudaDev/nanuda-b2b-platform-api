import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyQuestionAnswerMapper } from './survey-question-answer-mapper.entity';
import { Repository } from 'typeorm';
import { SurveyQuestionDto } from './dto';
import { YN } from 'src/common';

@Injectable()
export class NanudaSurveyQuestionAnswerService extends BaseService {
  constructor(
    @InjectRepository(SurveyQuestionAnswerMapper)
    private readonly mapperRepo: Repository<SurveyQuestionAnswerMapper>,
  ) {
    super();
  }

  /**
   * find first question
   */
  async findQuestion(
    surveyQuestionNoDto: SurveyQuestionDto,
  ): Promise<SurveyQuestionAnswerMapper> {
    const question = await this.mapperRepo
      .createQueryBuilder('mapper')
      .CustomInnerJoinAndSelect(['question', 'rightAnswer', 'leftAnswer'])
      .where('mapper.no = :no', { no: surveyQuestionNoDto.questionNo })
      .getOne();

    question.rightAnswer.responseQuestionNo = question.rightAnswerResponseNo;
    question.leftAnswer.responseQuestionNo = question.leftAnswerResponseNo;
    if (question.isLastQuestionYn === YN.YES) {
      question.rightAnswer.responseNo = question.lastRightResponse;
      question.leftAnswer.responseNo = question.lastLeftResponse;
    }
    return question;
  }

  //   /**
  //    * find next question
  //    * @param surveyQuestionNo
  //    */
  //   async findNextQuestion(
  //     surveyQuestionNo: number,
  //   ): Promise<SurveyQuestionAnswerMapper> {
  //     const question = await this.mapperRepo
  //       .createQueryBuilder()
  //       .CustomInnerJoinAndSelect(['question', 'rightAnswer', 'leftAnswer'])
  //       .where('mapper.no = :no', { no: surveyQuestionNo })
  //       .getOne();

  //     question.rightAnswer.responseQuestionNo = question.rightAnswerResponseNo;
  //     question.leftAnswer.responseQuestionNo = question.leftAnswerResponseNo;

  //     return question;
  //   }
}
