import { Controller, Query, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseController } from 'src/core';
import { Banner } from './banner.entity';
import { NanudaBannerListDto } from './dto';
import { NanudaBannerService } from './nanuda-banner.service';

@Controller()
@ApiTags('NANUDA BANNER')
export class NanudaBannerController extends BaseController {
  constructor(private readonly bannerService: NanudaBannerService) {
    super();
  }

  /**
   * find all
   * @param pagination
   */
  @Get('/nanuda/banner')
  async findAll(
    @Query() nanudaBannerListDto: NanudaBannerListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Banner>> {
    return await this.bannerService.findAllForNanudaUser(
      nanudaBannerListDto,
      pagination,
    );
  }

  /**
   * find one
   * @param bannerNo
   */
  @Get('/nanuda/banner/:id([0-9]+)')
  async findOne(@Param('id', ParseIntPipe) bannerNo: number): Promise<Banner> {
    return await this.bannerService.findOneForNanudaUser(bannerNo);
  }
}
