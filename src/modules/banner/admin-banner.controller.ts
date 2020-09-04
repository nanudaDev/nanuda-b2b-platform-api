import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  UseGuards,
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { UserInfo, PaginatedRequest, PaginatedResponse } from 'src/common';
import { Admin } from '../admin';
import {
  AdminBannerCreateDto,
  AdminBannerListDto,
  AdminBannerUpdateDto,
} from './dto';
import { Banner } from './banner.entity';
import { BannerService } from './banner.service';

@Controller()
@ApiTags('ADMIN BANNER')
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
@ApiBearerAuth()
export class AdminBannerController extends BaseController {
  constructor(private readonly bannerService: BannerService) {
    super();
  }

  /**
   * create banner
   * @param admin
   * @param adminBannerCreateDto
   */
  @Post('/admin/banner')
  async createBanner(
    @UserInfo() admin: Admin,
    @Body() adminBannerCreateDto: AdminBannerCreateDto,
  ): Promise<Banner> {
    return await this.bannerService.createBanner(
      admin.no,
      adminBannerCreateDto,
    );
  }

  /**
   * find all for admin
   * @param adminBannerListDto
   * @param pagination
   */
  @Get('/admin/banner')
  async findAll(
    @Query() adminBannerListDto: AdminBannerListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Banner>> {
    return await this.bannerService.findAllForAdmin(
      adminBannerListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param bannerNo
   */
  @Get('/admin/banner/:id([0-9]+)')
  async findOne(@Param('id', ParseIntPipe) bannerNo: number): Promise<Banner> {
    return await this.bannerService.findOneForAdmin(bannerNo);
  }

  /**
   * update for admin
   * @param bannerNo
   * @param admin
   * @param adminBannerUpdateDto
   */
  @Patch('/admin/banner/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) bannerNo: number,
    @UserInfo() admin: Admin,
    @Body() adminBannerUpdateDto: AdminBannerUpdateDto,
  ): Promise<Banner> {
    return await this.bannerService.updateBanner(
      bannerNo,
      admin.no,
      adminBannerUpdateDto,
    );
  }

  /**
   * delete for admin
   * @param bannerNo
   */
  @Delete('/admin/banner/:id([0-9]+)')
  async delete(@Param('id', ParseIntPipe) bannerNo: number) {
    return await this.bannerService.deleteBanner(bannerNo);
  }
}
