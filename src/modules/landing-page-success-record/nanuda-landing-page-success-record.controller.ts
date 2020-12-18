import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BaseController } from 'src/core';
import { LandingPageSuccessRecordDto } from './dto';
import { LandingPageSuccessRecord } from './landing-page-success-record.entity';
import { NanudaLandingPageSuccessRecordService } from './nanuda-landing-page-success-record.service';

@Controller()
@ApiTags('NANUDA LANDING PAGE SUCCESS RECORD')
export class NanudaLandingPageSuccessRecordController extends BaseController {
  constructor(
    private readonly nanudaLandingSuccessService: NanudaLandingPageSuccessRecordService,
  ) {
    super();
  }

  /**
   * record success
   * @param landingPageSuccessDto
   */
  @Post('/nanuda/landing-page-success')
  async recordSuccess(
    @Body() landingPageSuccessDto: LandingPageSuccessRecordDto,
    @Req() req: Request,
  ): Promise<LandingPageSuccessRecord> {
    return await this.nanudaLandingSuccessService.recordSuccess(
      landingPageSuccessDto,
      req,
    );
  }
}
