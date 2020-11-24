import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
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

  /**
   * send text message
   * @param companyDistrictNo
   */
  @Get('/admin/message-delivery-space/:id([0-9]+)')
  async sendMessage(
    @Param('id', ParseIntPipe) deliveryFounderConsultNo: number,
    @Req() req: Request,
  ) {
    return await this.messageDeliverySpaceService.sendMessageAndPlaceInIndex(
      deliveryFounderConsultNo,
      req,
    );
  }
}
