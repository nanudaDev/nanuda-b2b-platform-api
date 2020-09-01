import {
  Controller,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Patch,
  Body,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { DeliveryFounderConsultService } from './delivery-founder-consult.service';
import { DeliveryFounderConsult } from './delivery-founder-consult.entity';
import {
  AdminDeliveryFounderConsultListDto,
  AdminDeliveryFounderConsultUpdateDto,
  AdminDeliveryFounderConsultCreateDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';

@Controller()
@ApiTags('ADMIN DELIVERY FOUNDER CONSULT')
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
@ApiBearerAuth()
export class AdminDeliveryFounderConsultController extends BaseController {
  constructor(
    private readonly deliveryFounderConsultService: DeliveryFounderConsultService,
  ) {
    super();
  }

  /**
   * find all
   * @param adminDeliveryFounderConsultListDto
   * @param pagination
   */
  @Get('/admin/delivery-founder-consult')
  async findAll(
    @Query()
    adminDeliveryFounderConsultListDto: AdminDeliveryFounderConsultListDto,
    @Query() pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliveryFounderConsult>> {
    return await this.deliveryFounderConsultService.findAllForAdmin(
      adminDeliveryFounderConsultListDto,
      pagination,
    );
  }

  /**
   * find one
   * @param deliveryFounderConsultNo
   */
  @Get('/admin/delivery-founder-consult/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) deliveryFounderConsultNo: number,
  ): Promise<DeliveryFounderConsult> {
    return await this.deliveryFounderConsultService.findOneForAdmin(
      deliveryFounderConsultNo,
    );
  }

  /**
   * update for admin
   * @param deliveryFounderConsultNo
   * @param adminDeliveryFounderConsultUpdateDto
   */
  @Patch('/admin/delivery-founder-consult/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) deliveryFounderConsultNo: number,
    @Body()
    adminDeliveryFounderConsultUpdateDto: AdminDeliveryFounderConsultUpdateDto,
  ): Promise<DeliveryFounderConsult> {
    return await this.deliveryFounderConsultService.updateForAdmin(
      deliveryFounderConsultNo,
      adminDeliveryFounderConsultUpdateDto,
    );
  }

  /**
   * reverse read status
   * @param deliveryFounderConsultNo
   */
  @Patch('/admin/delivery-founder-consult/:id([0-9]+)/reverse-read-status')
  async reverseReadStatus(
    @Param('id', ParseIntPipe) deliveryFounderConsultNo: number,
  ): Promise<DeliveryFounderConsult> {
    return await this.deliveryFounderConsultService.reverseReadStatus(
      deliveryFounderConsultNo,
    );
  }

  /**
   * create for admin
   * @param adminDeliveryFounderConsultCreateDto
   */
  @Post('/admin/delivery-founder-consult')
  async create(
    @Body()
    adminDeliveryFounderConsultCreateDto: AdminDeliveryFounderConsultCreateDto,
  ): Promise<DeliveryFounderConsult> {
    return await this.deliveryFounderConsultService.createForAdmin(
      adminDeliveryFounderConsultCreateDto,
    );
  }
}
