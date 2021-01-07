import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { AuthRolesGuard, BaseController, CONST_COMPANY_USER } from 'src/core';
import { DeliveryFounderConsultReply } from './delivery-founder-consult-reply.entity';
import { DeliveryFounderConsultReplyService } from './delivery-founder-consult-reply.service';
import { DeliveryFounderConsultReplyListDto } from './dto';

@Controller()
@ApiTags('DELIVERY FOUNDER CONSULT REPLY')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
export class DeliveryFounderConsultReplyController extends BaseController {
  constructor(
    private readonly deliveryFounderConsultReplyService: DeliveryFounderConsultReplyService,
  ) {
    super();
  }

  @Get('/delivery-founder-consult/:id([0-9]+)/delivery-founder-consult-reply')
  async findAll(
    @Param('id', ParseIntPipe) deliveryFounderConsultNo: number,
    @Query()
    deliveryFounderConsultReplyListDto: DeliveryFounderConsultReplyListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliveryFounderConsultReply>> {
    return await this.deliveryFounderConsultReplyService.findAll(
      deliveryFounderConsultNo,
      deliveryFounderConsultReplyListDto,
      pagination,
    );
  }
}
