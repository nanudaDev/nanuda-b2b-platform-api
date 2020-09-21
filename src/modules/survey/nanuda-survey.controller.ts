import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { NanudaSurveyService } from './nanuda-survey.service';
import { Survey } from './survey.entity';

@Controller()
@ApiTags('NANUDA SURVEY')
export class NanudaSurveyController extends BaseController {
  constructor(private readonly nanudaSurveyService: NanudaSurveyService) {
    super();
  }
}
