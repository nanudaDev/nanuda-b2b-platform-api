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
import { PaginatedRequest, PaginatedResponse, UserInfo } from 'src/common';
import { AuthRolesGuard, BaseController, CONST_ADMIN_USER } from 'src/core';
import { Admin } from '../admin';
import { DeliveryFounderConsultReply } from './delivery-founder-consult-reply.entity';
import { DeliveryFounderConsultReplyService } from './delivery-founder-consult-reply.service';
import {
  AdminDeliveryFounderConsultReplyCreateDto,
  AdminDeliveryFounderConsultReplyListDto,
} from './dto';

@Controller()
@ApiTags('ADMIN DELIVERY FOUNDER CONSULT REPLY')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminDeliveryFounderConsultReplyController extends BaseController {
  constructor(
    private readonly deliveryFounderConsultReplyService: DeliveryFounderConsultReplyService,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param deliveryFounderConsultNo
   * @param adminDeliveryFounderConsultReplyListDto
   * @param pagination
   */
  @Get(
    '/admin/delivery-founder-consult/:id([0-9]+)/delivery-founder-consult-reply',
  )
  async findAll(
    @Param('id', ParseIntPipe) deliveryFounderConsultNo: number,
    @Query()
    adminDeliveryFounderConsultReplyListDto: AdminDeliveryFounderConsultReplyListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliveryFounderConsultReply>> {
    return await this.deliveryFounderConsultReplyService.findAll(
      deliveryFounderConsultNo,
      adminDeliveryFounderConsultReplyListDto,
      pagination,
    );
  }

  /**
   * create for admin
   * @param admin
   * @param adminDeliveryFounderConsultReplyCreateDto
   * @param req
   */
  @Post(
    '/admin/delivery-founder-consult/:id([0-9]+)/delivery-founder-consult-reply',
  )
  async createForAdmin(
    @Param('id', ParseIntPipe) deliveryFounderConsultNo: number,
    @UserInfo() admin: Admin,
    @Body()
    adminDeliveryFounderConsultReplyCreateDto: AdminDeliveryFounderConsultReplyCreateDto,
    @Req() req: Request,
  ): Promise<DeliveryFounderConsultReply> {
    return await this.deliveryFounderConsultReplyService.createForAdmin(
      deliveryFounderConsultNo,
      adminDeliveryFounderConsultReplyCreateDto,
      admin.no,
      req,
    );
  }
}
