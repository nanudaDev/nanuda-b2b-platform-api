import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { CompanyDistrictCreateDto } from '../company-district/dto';
import { CompanyDistrictRevenueRecord } from './company-district-revenue-record.entity';
import { CompanyDistrictRevenueRecordService } from './company-district-revenue-record.service';
import {
  CompanyDistrictRevenueRecordCreateDto,
  CompanyDistrictRevenueRecordUpdateDto,
} from './dto';

@Controller()
@ApiTags('COMPANY DISTRICT REVENUE RECORD')
export class CompanyDistrictRevenueRecordController extends BaseController {
  constructor(
    private readonly companyDistrictRevenueRecordService: CompanyDistrictRevenueRecordService,
  ) {
    super();
  }

  /**
   *
   * @param districtNo
   * @param year
   */

  @Get('/company-district/:id([0-9]+)/revenue-record')
  async findAll(
    @Param('id') districtNo: number,
    @Query('year') year: string,
  ): Promise<CompanyDistrictRevenueRecord[]> {
    return await this.companyDistrictRevenueRecordService.findAll(
      districtNo,
      year,
    );
  }
  /**
   *
   * @param companyDistrictRevenueRecordCreateDto
   */
  @Post('/revenue-record')
  async create(
    @Body()
    companyDistrictRevenueRecordCreateDto: CompanyDistrictRevenueRecordCreateDto,
  ): Promise<CompanyDistrictRevenueRecord> {
    const newDto = new CompanyDistrictRevenueRecordCreateDto(
      companyDistrictRevenueRecordCreateDto,
    );
    return await this.companyDistrictRevenueRecordService.createRecord(newDto);
  }

  /**
   *
   * @param id
   * @param companyDistrictRevenueRecordUpdateDto
   */
  @Patch('/revenue-record/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    companyDistrictRevenueRecordUpdateDto: CompanyDistrictRevenueRecordUpdateDto,
  ): Promise<CompanyDistrictRevenueRecord> {
    return await this.companyDistrictRevenueRecordService.updateRecord(
      id,
      companyDistrictRevenueRecordUpdateDto,
    );
  }
}
