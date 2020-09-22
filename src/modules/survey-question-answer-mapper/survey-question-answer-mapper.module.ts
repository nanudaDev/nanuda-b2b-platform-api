import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyQuestionAnswerMapper } from './survey-question-answer-mapper.entity';
import { NanudaSurveyQuestionMapperController } from './nanuda-survey-question-answer-mapper.controller';
import { NanudaSurveyQuestionAnswerService } from './nanuda-survey-question-answer-mapper.service';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyQuestionAnswerMapper])],
  controllers: [NanudaSurveyQuestionMapperController],
  providers: [NanudaSurveyQuestionAnswerService],
})
export class SurveyQuesionAnswerMapperModule {}
