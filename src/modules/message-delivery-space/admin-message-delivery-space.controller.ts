import {
  Body,
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
import { EditedMessageDto } from './dto';

@Controller()
@ApiTags('ADMIN MESSAGE')
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
@ApiBearerAuth()
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
  async getMessage(
    @Param('id', ParseIntPipe) deliveryFounderConsultNo: number,
  ) {
    return await this.messageDeliverySpaceService.sendMessageAndPlaceInIndex(
      deliveryFounderConsultNo,
    );
  }

  @Post('/admin/send-message/:nanudaUserNo([0-9]+)')
  async sendEditedMessage(
    @Param('nanudaUserNo', ParseIntPipe) nanudaUserNo: number,
    @Body() editedMessageDto: EditedMessageDto,
    @Req() req: Request,
  ) {
    return await this.messageDeliverySpaceService.sendEditedMessage(
      nanudaUserNo,
      editedMessageDto,
      req,
    );
  }
}
