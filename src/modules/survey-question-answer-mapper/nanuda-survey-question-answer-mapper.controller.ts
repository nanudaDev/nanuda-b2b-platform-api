import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { Controller, Get, Query } from '@nestjs/common';
import { NanudaSurveyQuestionAnswerService } from './nanuda-survey-question-answer-mapper.service';
import { SurveyQuestionDto } from './dto';

@Controller()
@ApiTags('NANUDA SURVEY QUESTION MAPPER')
export class NanudaSurveyQuestionMapperController extends BaseController {
  constructor(
    private readonly nanudaSurveyQuestionAnswerService: NanudaSurveyQuestionAnswerService,
  ) {
    super();
  }

  //   TODO: requires refactoring for expansion
  @Get('/nanuda/survey')
  async findQuestion(@Query() surveyDto: SurveyQuestionDto) {
    return await this.nanudaSurveyQuestionAnswerService.findQuestion(surveyDto);
  }
}
