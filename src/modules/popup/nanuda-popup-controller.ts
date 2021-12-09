import { Controller, Query, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseController } from 'src/core';
import { Popup } from './popup.entity';
import { NanudaPopupListDto } from './dto';
import { NanudaPopupService } from './nanuda-popup.service';

@Controller()
@ApiTags('NANUDA POPUP')
export class NanudaPopupController extends BaseController {
  constructor(private readonly popupService: NanudaPopupService) {
    super();
  }

  /**
   * find all
   * @param pagination
   */
  @Get('/nanuda/popup')
  async findAll(
    @Query() nanudaPopupListDto: NanudaPopupListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Popup>> {
    return await this.popupService.findAllForNanudaUser(
      nanudaPopupListDto,
      pagination,
    );
  }

  /**
   * find one
   * @param popupNo
   */
  @Get('/nanuda/popup/:id([0-9]+)')
  async findOne(@Param('id', ParseIntPipe) popupNo: number): Promise<Popup> {
    return await this.popupService.findOneForNanudaUser(popupNo);
  }
}
