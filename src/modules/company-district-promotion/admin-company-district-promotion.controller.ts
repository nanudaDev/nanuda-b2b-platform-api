import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { AuthRolesGuard, BaseController, CONST_ADMIN_USER } from 'src/core';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { CompanyDistrictPromotion } from './company-district-promotion.entity';
import { CompanyDistrictPromotionService } from './company-district-promotion.service';
import {
  AdminCompanyDistrictPromotionCreateDto,
  AdminCompanyDistrictPromotionListDto,
} from './dto';

@Controller()
@ApiTags('ADMIN COMPANY DISTRICT PROMOTION')
// @ApiBearerAuth()
// @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminCompanyDistrictPromotionController extends BaseController {
  constructor(
    private readonly companyDistrictPromotionService: CompanyDistrictPromotionService,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminCompanyDistrictPromotionListDto
   * @param pagination
   */
  @Get('/admin/delivery-promotion')
  async findAll(
    @Query()
    adminCompanyDistrictPromotionListDto: AdminCompanyDistrictPromotionListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrictPromotion>> {
    return await this.companyDistrictPromotionService.findAllForAdmin(
      adminCompanyDistrictPromotionListDto,
      pagination,
    );
  }

  /**
   * find one
   * @param promotionNo
   */
  @Get('/admin/delivery-promotion/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) promotionNo: number,
  ): Promise<CompanyDistrictPromotion> {
    return await this.companyDistrictPromotionService.findOneForAdmin(
      promotionNo,
    );
  }

  /**
   * find districts with pagination
   * @param promotionNo
   * @param pagination
   */
  @Get('/admin/delivery-space/:id([0-9]+)/company-districts')
  async findDistricts(
    @Param('id', ParseIntPipe) promotionNo: number,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrict>> {
    return await this.companyDistrictPromotionService.findDistricts(
      promotionNo,
      pagination,
    );
  }

  /**
   * create for admin
   * @param adminCompanyDistrictPromotionCreateDto
   */
  @Post('/admin/delivery-promotion')
  async create(
    @Body()
    adminCompanyDistrictPromotionCreateDto: AdminCompanyDistrictPromotionCreateDto,
  ): Promise<CompanyDistrictPromotion> {
    return await this.companyDistrictPromotionService.createForAdmin(
      adminCompanyDistrictPromotionCreateDto,
    );
  }
}
