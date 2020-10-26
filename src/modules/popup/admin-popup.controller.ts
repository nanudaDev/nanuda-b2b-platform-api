import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { AuthRolesGuard, BaseController, CONST_ADMIN_USER } from 'src/core';
import { AdminPopupListDto } from './dto';
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
}
