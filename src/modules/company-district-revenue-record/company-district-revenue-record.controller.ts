import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  ParseIntPipe,
  Query,
  UseGuards,
  NotAcceptableException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { UserInfo } from 'src/common';
import { AuthRolesGuard, BaseController, CONST_COMPANY_USER } from 'src/core';
import { CompanyDistrictCreateDto } from '../company-district/dto';
import { CompanyUser } from '../company-user/company-user.entity';
import { CompanyDistrictRevenueRecord } from './company-district-revenue-record.entity';
import { CompanyDistrictRevenueRecordService } from './company-district-revenue-record.service';
import {
  CompanyDistrictRevenueRecordCreateDto,
  CompanyDistrictRevenueRecordListDto,
  CompanyDistrictRevenueRecordUpdateDto,
} from './dto';

@Controller()
@ApiTags('COMPANY DISTRICT REVENUE RECORD')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
export class CompanyDistrictRevenueRecordController extends BaseController {
  constructor(
    private readonly companyDistrictRevenueRecordService: CompanyDistrictRevenueRecordService,
  ) {
    super();
  }
  /**
   *
   * @param companyDistrictRevenueRecordListDto
   */
  @Get('/revenue-record')
  async findAll(
    @UserInfo() companyUser: CompanyUser,
    @Query()
    companyDistrictRevenueRecordListDto: CompanyDistrictRevenueRecordListDto,
  ): Promise<CompanyDistrictRevenueRecord[]> {
    return await this.companyDistrictRevenueRecordService.findAll(
      companyUser,
      companyDistrictRevenueRecordListDto,
    );
  }

  /**
   *
   * @param companyDistrictRevenueRecordCreateDto
   */
  @Post('/revenue-record')
  async create(
    @UserInfo() companyUser: CompanyUser,
    @Body()
    companyDistrictRevenueRecordCreateDto: CompanyDistrictRevenueRecordCreateDto,
  ): Promise<CompanyDistrictRevenueRecord> {
    return await this.companyDistrictRevenueRecordService.createRecord(
      companyUser,
      companyDistrictRevenueRecordCreateDto,
    );
  }

  /**
   *
   * @param id
   * @param companyDistrictRevenueRecordUpdateDto
   */
  @Patch('/revenue-record/:id([0-9]+)')
  async update(
    @UserInfo() companyUser: CompanyUser,
    @Param('id', ParseIntPipe) id: number,
    @Body()
    companyDistrictRevenueRecordUpdateDto: CompanyDistrictRevenueRecordUpdateDto,
  ): Promise<CompanyDistrictRevenueRecord> {
    return await this.companyDistrictRevenueRecordService.updateRecord(
      companyUser,
      id,
      companyDistrictRevenueRecordUpdateDto,
    );
  }
}
