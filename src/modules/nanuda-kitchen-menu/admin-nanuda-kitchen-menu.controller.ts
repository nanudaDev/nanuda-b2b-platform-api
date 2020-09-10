import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards, Controller, Get, Query } from '@nestjs/common';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { NanudaKitchenMenuService } from './nanuda-kitchen-menu.service';

@Controller()
@ApiTags('ADMIN NANUDA KITCHEN MENU')
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
@ApiBearerAuth()
export class AdminNanudaKitchenMenuController extends BaseController {
  constructor(
    private readonly nanudaKitchenMenuService: NanudaKitchenMenuService,
  ) {
    super();
  }

  //   @Get('/admin/nanuda-kitchen-menu')
  //   async findAll(@Query())
}
