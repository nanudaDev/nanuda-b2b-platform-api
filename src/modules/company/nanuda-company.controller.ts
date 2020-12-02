import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseController } from 'src/core';
import { CompanyDistrictPromotion } from '../company-district-promotion/company-district-promotion.entity';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { NanudaCompanyService } from './nanuda-company.service';

@Controller()
@ApiTags('NANUDA COMPANY')
export class NanudaCompanyController extends BaseController {
  constructor(
    private readonly nanudaCompanyService: NanudaCompanyService,
    private readonly companyService: CompanyService,
  ) {
    super();
  }

  /**
   * find all for nanuda user
   */
  @Get('/nanuda/company')
  async findAll(): Promise<Company[]> {
    return await this.nanudaCompanyService.findAll();
  }

  /**
   * find districts by company no
   * @param companyNo
   */
  @Get('/nanuda/company/:id([0-9]+)/districts')
  async findDistricts(
    @Param('id', ParseIntPipe) companyNo: number,
  ): Promise<CompanyDistrict[]> {
    return await this.nanudaCompanyService.findByCompanyNo(companyNo);
  }

  /**
   * find ongoing promotions for company
   * @param companyNo
   * @param pagination
   */
  @Get('/nanuda/company/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) companyNo: number,
  ): Promise<Company> {
    return await this.companyService.findOne(companyNo);
  }

  /**
   * find ongoing promotions for company
   * @param companyNo
   * @param pagination
   */
  @Get('/nanuda/company/:id([0-9]+)/ongoing-promotions')
  async findCompanyPromotions(
    @Param('id', ParseIntPipe) companyNo: number,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrictPromotion>> {
    return await this.companyService.findOngoingPromotions(
      companyNo,
      pagination,
    );
  }
}
