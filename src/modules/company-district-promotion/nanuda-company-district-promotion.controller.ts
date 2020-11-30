import { Controller, Query, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseController } from 'src/core';
import { Company } from '../company/company.entity';
import { CompanyDistrictPromotion } from './company-district-promotion.entity';
import { NanudaCompanyDistrictPromotionService } from './nanuda-company-district-promotion.service';

@Controller()
@ApiTags('NANUDA COMPANY DISTRICT PROMOTION')
export class NanudaCompanyDistrictPromotionController extends BaseController {
  constructor(
    private readonly promotionService: NanudaCompanyDistrictPromotionService,
  ) {
    super();
  }

  /**
   * find all
   * @param pagination
   */
  @Get('/nanuda/promotions')
  async findAll(
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrictPromotion>> {
    return await this.promotionService.findAllForNanudaUser(pagination);
  }

  /**
   * find one
   * @param promotionNo
   */
  @Get('/nanuda/promotions/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) promotionNo: number,
  ): Promise<CompanyDistrictPromotion> {
    return await this.promotionService.findOneForNanudaUser(promotionNo);
  }

  /**
   * find companies with promotion
   * @param promotionNo
   * @param pagination
   */
  @Get('/nanuda/promotions/:id([0-9+])/companies')
  async findCompanies(
    @Param('id', ParseIntPipe) promotionNo: number,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Company>> {
    return await this.promotionService.findCompaniesWithPromotions(
      promotionNo,
      pagination,
    );
  }
}
