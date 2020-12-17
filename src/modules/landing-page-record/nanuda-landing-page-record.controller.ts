import { Controller, Get, Ip, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IpAddress } from 'src/common';
import { BaseController } from 'src/core';
import { LandingPageRecordDto } from './dto';
import { NanudaLandingPageRecordService } from './nanuda-landing-page-record.service';
import * as ip from 'ip';

@Controller()
@ApiTags('NANUDA LANDING PAGE RECORD')
export class NanudaLandingPageRecordController extends BaseController {
  constructor(
    private readonly nanudaLandingPageRecordService: NanudaLandingPageRecordService,
  ) {
    super();
  }

  /**
   * record view
   * @param landingPageRecordDto
   * @param ip
   */
  @Get('/nanuda/landing-page-record')
  async record(@Query() landingPageRecordDto: LandingPageRecordDto) {
    const address = ip.address();
    return await this.nanudaLandingPageRecordService.recordView(
      landingPageRecordDto,
      address,
    );
  }
}
