import {
  Controller,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { CompanyDistrictService } from './company-district.service';
import {
  AdminCompanyDistrictListDto,
  AdminCompanyDistrictCreateDto,
  AdminCompanyDistrictUpdateDto,
  AdminCompanyDistrictUpdateRefusalDto,
  AdminCompanyDistrictLatLonDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse, UserInfo } from 'src/common';
import { CompanyDistrict } from './company-district.entity';
import { Admin } from '..';
import { CompanyDistrictPromotion } from '../company-district-promotion/company-district-promotion.entity';

@Controller()
@ApiTags('ADMIN COMPANY DISTRICT')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminCompanyDistrictController extends BaseController {
  constructor(private readonly companyDistrictService: CompanyDistrictService) {
    super();
  }

  /**
   * get all company districts
   * @param companyNo
   * @param adminCompanyDistrictListDto
   * @param pagination
   */
  @Get('/admin/company-district')
  async findAll(
    @Query() adminCompanyDistrictListDto: AdminCompanyDistrictListDto,
    @Query() pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrict>> {
    return await this.companyDistrictService.findCompanyDistrictForAdmin(
      adminCompanyDistrictListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param companyDistrictNo
   */
  @Get('/admin/company-district/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) companyDistrictNo: number,
  ): Promise<CompanyDistrict> {
    return await this.companyDistrictService.findOneForAdmin(companyDistrictNo);
  }

  /**
   * create for admin
   * @param adminCompanyDistrictCreateDto
   */
  @Post('/admin/company-district')
  async create(
    @Body() adminCompanyDistrictCreateDto: AdminCompanyDistrictCreateDto,
    @UserInfo() admin: Admin,
  ): Promise<CompanyDistrict> {
    return await this.companyDistrictService.create(
      adminCompanyDistrictCreateDto,
      admin.no,
    );
  }

  /**
   * update
   * @param companyDistrictNo
   * @param adminCompanyDistrictUpdateDto
   * @param admin
   */
  @Patch('/admin/company-district/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) companyDistrictNo: number,
    @Body() adminCompanyDistrictUpdateDto: AdminCompanyDistrictUpdateDto,
    @UserInfo() admin: Admin,
  ): Promise<CompanyDistrict> {
    return await this.companyDistrictService.updateForAdmin(
      companyDistrictNo,
      adminCompanyDistrictUpdateDto,
      admin.no,
    );
  }

  /**
   * approve district
   * @param companyDistrictNo
   */
  @Patch('/admin/company-district/:id([0-9]+)/approve-update')
  async approve(
    @Param('id') companyDistrictNo: number,
  ): Promise<CompanyDistrict> {
    return await this.companyDistrictService.approveUpdate(companyDistrictNo);
  }

  /**
   * refuse update
   * @param companyDistrictNo
   * @param adminCompanyDistrictUpdateRefusalDto
   */
  @Patch('/admin/company-district/:id([0-9]+)/refuse-update')
  async refuse(
    @Param('id', ParseIntPipe) companyDistrictNo: number,
    @Body()
    adminCompanyDistrictUpdateRefusalDto: AdminCompanyDistrictUpdateRefusalDto,
  ): Promise<CompanyDistrict> {
    return await this.companyDistrictService.refuseUpdate(
      companyDistrictNo,
      adminCompanyDistrictUpdateRefusalDto,
    );
  }

  /**
   * update analysis
   * @param companyDistrictNo
   */
  @Patch('/admin/company-district/:id([0-9]+)/analysis')
  async updateAnalysis(@Param('id', ParseIntPipe) companyDistrictNo: number) {
    return await this.companyDistrictService.createVicinityInfo(
      companyDistrictNo,
    );
  }

  /**
   * update lat lon
   * @param companyDistrictNo
   * @param latLonDto
   */
  @Patch('/admin/company-district/:id([0-9]+)/lat-lon')
  async updateLatLon(
    @Param('id', ParseIntPipe) companyDistrictNo: number,
    @Body() latLonDto: AdminCompanyDistrictLatLonDto,
  ): Promise<CompanyDistrict> {
    return await this.companyDistrictService.updateLatLon(
      companyDistrictNo,
      latLonDto,
    );
  }

  /**
   * find ongoing promotions
   * @param companyDistrictNo
   * @param pagination
   */
  @Get('/admin/company-district/:id([0-9]+)/ongoing-promotions')
  async findOngoingPromotions(
    @Param('id', ParseIntPipe) companyDistrictNo: number,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrictPromotion>> {
    return await this.companyDistrictService.findOngoingPromotions(
      companyDistrictNo,
      pagination,
    );
  }

  /**
   * find expired promotions
   * @param companyDistrictNo
   * @param pagination
   */
  @Get('/admin/company-district/:id([0-9]+)/expired-promotions')
  async findExpiredPromotions(
    @Param('id', ParseIntPipe) companyDistrictNo: number,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrictPromotion>> {
    return await this.companyDistrictService.findExpiredPromotions(
      companyDistrictNo,
      pagination,
    );
  }

  /**
   * find for select
   * @param pagination
   */
  @Get('/admin/company-district/find-for-select')
  async findForSelect(
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrict>> {
    return await this.companyDistrictService.findForSelect(pagination);
  }

  /**
   * create history
   */
  @Get('/admin/company-district/create-history')
  async createHistories() {
    return await this.companyDistrictService.createUpdateHistory();
  }

  /**
   * company district delete
   * @param companyDistrictNo
   */
  @Delete('/admin/company-district/:id([0-9]+)')
  async deleteDistrict(@Param('id', ParseIntPipe) companyDistrictNo: number) {
    return {
      isDeleted: await this.companyDistrictService.deleteDistrict(
        companyDistrictNo,
      ),
    };
  }
}
