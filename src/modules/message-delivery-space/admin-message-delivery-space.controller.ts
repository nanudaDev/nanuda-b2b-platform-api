import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, BaseController, CONST_ADMIN_USER } from 'src/core';
import { MessageDeliverySpaceService } from './admin-message-delivery-space.service';
import { MessageFloatingPopulationDto } from './dto';

@Controller()
@ApiTags('ADMIN MESSAGE')
// @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
// @ApiBearerAuth()
export class AdminMessageDeliverySpaceController extends BaseController {
  constructor(
    private readonly messageDeliverySpaceService: MessageDeliverySpaceService,
  ) {
    super();
  }
}
