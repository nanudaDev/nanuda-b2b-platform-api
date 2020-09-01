import {
  Controller,
  UseGuards,
  Get,
  Query,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { CompanyPricingService } from './company-pricing.service';
import {
  AdminCompanyPricingListDto,
  AdminCompanyPricingCreateDto,
  AdminCompanyPricingUpdateDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { CompanyPricing } from './company-pricing.entity';
import { time } from 'console';

@Controller()
@ApiBearerAuth()
@ApiTags('ADMIN COMPANY PRICING')
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminCompanyPricingController extends BaseController {
  constructor(private readonly companyPricingService: CompanyPricingService) {
    super();
  }

  /**
   * find all for admin
   * @param adminCompanyPricingListDto
   * @param pagination
   */
  @Get('/admin/company-pricing')
  async findAll(
    @Query() adminCompanyPricingListDto: AdminCompanyPricingListDto,
    @Query() pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyPricing>> {
    return await this.companyPricingService.findAll(
      adminCompanyPricingListDto,
      pagination,
    );
  }

  /**
   * find one
   * @param companyPricingNo
   */
  @Get('/admin/company-pricing/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) companyPricingNo: number,
  ): Promise<CompanyPricing> {
    return await this.companyPricingService.findOne(companyPricingNo);
  }

  /**
   * create for admin
   * @param adminCompanyPricingCreateDto
   */
  @Post('/admin/company-pricing')
  async create(
    @Body() adminCompanyPricingCreateDto: AdminCompanyPricingCreateDto,
  ): Promise<CompanyPricing> {
    return await this.companyPricingService.create(
      adminCompanyPricingCreateDto,
    );
  }

  /**
   * update for admin
   * @param companyPricingNo
   * @param adminCompanyPricingUpdateDto
   */
  @Patch('/admin/company-pricing/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) companyPricingNo: number,
    @Body() adminCompanyPricingUpdateDto: AdminCompanyPricingUpdateDto,
  ): Promise<CompanyPricing> {
    return await this.companyPricingService.update(
      companyPricingNo,
      adminCompanyPricingUpdateDto,
    );
  }
}
