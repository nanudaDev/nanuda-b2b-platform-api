import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { CompanyDistrictRevenueRecord } from './company-district-revenue-record.entity';
import { CompanyDistrictRevenueRecordService } from './company-district-revenue-record.service';

@Controller()
@ApiTags('COMPANY DISTRICT REVENUE RECORD')
export class CompanyDistrictRevenueRecordController extends BaseController {
  constructor(
    private readonly companyDistrictRevenueRecordService: CompanyDistrictRevenueRecordService,
  ) {
    super();
  }

  @Get('/revenue-record/:id([0-9]+)')
  async findOne(
    @Param('id') no: number,
  ): Promise<CompanyDistrictRevenueRecord> {
    return await this.companyDistrictRevenueRecordService.findOne(no);
  }
}
