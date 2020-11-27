import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, BaseController, CONST_ADMIN_USER } from 'src/core';

@Controller()
@ApiTags('ADMIN COMPANY DISTRICT PROMOTION')
// @ApiBearerAuth()
// @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminCompanyDistrictPromotionController extends BaseController {
  constructor() {
    super();
  }
}
