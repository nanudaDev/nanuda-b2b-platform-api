import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, BaseController, CONST_ADMIN_USER } from 'src/core';
import { CompanyDistrictRevenueRecord } from './company-district-revenue-record.entity';
import { CompanyDistrictRevenueRecordService } from './company-district-revenue-record.service';
import { CompanyDistrictRevenueRecordListDto } from './dto';

@Controller()
@ApiTags('ADMIN COMPANY DISTRICT REVENUE RECORD')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminCompanyDistrictRevenueRecordController extends BaseController {
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

  @Get('/admin/company-district/:id([0-9]+)/revenue-record')
  async findAll(
    @Param('id') districtNo: number,
    @Query()
    companyDistrictRevenueRecordListDto: CompanyDistrictRevenueRecordListDto,
  ): Promise<CompanyDistrictRevenueRecord[]> {
    return await this.companyDistrictRevenueRecordService.findAll(
      districtNo,
      companyDistrictRevenueRecordListDto.year,
    );
  }
}
