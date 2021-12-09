import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse, UserInfo } from 'src/common';
import { AuthRolesGuard, BaseController, CONST_ADMIN_USER } from 'src/core';
import { Admin } from '../admin';
import { AdminPopupCreateDto, AdminPopupListDto } from './dto';
import { AdminPopupUpdateDto } from './dto/admin-popup-update.dto';
import { Popup } from './popup.entity';
import { PopupService } from './popup.service';

@Controller()
@ApiTags('ADMIN POPUP')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminPopupController extends BaseController {
  constructor(private readonly popupService: PopupService) {
    super();
  }

  /**
   * find all for admin
   * @param adminPopupListDto
   * @param pagination
   */
  @Get('/admin/popup')
  async findAll(
    @Query() adminPopupListDto: AdminPopupListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Popup>> {
    return await this.popupService.findAllForAdmin(
      adminPopupListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param popupNo
   */
  @Get('/admin/popup/:id([0-9]+)')
  async findOne(@Param('id', ParseIntPipe) popupNo: number): Promise<Popup> {
    return await this.popupService.findOneForAdmin(popupNo);
  }

  /**
   * create for admin
   * @param adminPopupCreateDto
   */
  @Post('/admin/popup')
  async createPopup(
    @Body() adminPopupCreateDto: AdminPopupCreateDto,
  ): Promise<Popup> {
    return await this.popupService.createForAdmin(adminPopupCreateDto);
  }

  /**
   * update for admin
   * @param popupNo
   * @param adminPopupUpdateDto
   * @returns
   */
  @Patch('/admin/popup/:id([0-9]+)')
  async updatePopup(
    @Param('id', ParseIntPipe) popupNo: number,
    @Body() adminPopupUpdateDto: AdminPopupUpdateDto,
  ): Promise<Popup> {
    return await this.popupService.updateForAdmin(popupNo, adminPopupUpdateDto);
  }

  /**
   * delete for admin
   * @param popupNo
   * @returns
   */
  @Delete('/admin/popup/:id([0-9]+)')
  async deletePopup(@Param('id', ParseIntPipe) popupNo: number) {
    return await this.popupService.deleteForAdmin(popupNo);
  }
}
