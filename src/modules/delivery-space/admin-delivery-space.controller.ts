import {
  Controller,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { DeliverySpaceService } from './delivery-space.service';
import { DeliverySpace } from './delivery-space.entity';
import { UserInfo, PaginatedRequest, PaginatedResponse } from 'src/common';
import { Admin } from '../admin';
import {
  AdminDeliverySpaceCreateDto,
  AdminDeliverySpaceListDto,
  AdminDeliverySpaceUpdateDto,
} from './dto';

@Controller()
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
@ApiTags('ADMIN DELIVERY SPACE')
export class AdminDeliverySpaceController extends BaseController {
  constructor(private readonly deliverySpaceService: DeliverySpaceService) {
    super();
  }

  /**
   * find all
   * @param adminDeliverySpaceListDto
   * @param pagination
   */
  @Get('/admin/delivery-space')
  async findAll(
    @Query() adminDeliverySpaceListDto: AdminDeliverySpaceListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliverySpace>> {
    return await this.deliverySpaceService.findAllForAdmin(
      adminDeliverySpaceListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param deliverySpaceNo
   */
  @Get('/admin/delivery-space/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) deliverySpaceNo: number,
  ): Promise<DeliverySpace> {
    return await this.deliverySpaceService.findOneForAdmin(deliverySpaceNo);
  }

  /**
   * create for admin
   * @param admin
   * @param adminDeliverySpaceCreateDto
   */
  @Post('/admin/delivery-space')
  async create(
    @UserInfo() admin: Admin,
    @Body() adminDeliverySpaceCreateDto: AdminDeliverySpaceCreateDto,
  ): Promise<DeliverySpace> {
    return await this.deliverySpaceService.createForAdmin(
      admin.no,
      adminDeliverySpaceCreateDto,
    );
  }

  /**
   * update for admin
   * @param admin
   * @param adminDeliverySpaceUpdateDto
   * @param deliverySpaceNo
   */
  @Patch('/admin/delivery-space/:id([0-9]+)')
  async update(
    @UserInfo() admin: Admin,
    @Body() adminDeliverySpaceUpdateDto: AdminDeliverySpaceUpdateDto,
    @Param('id', ParseIntPipe) deliverySpaceNo: number,
  ): Promise<DeliverySpace> {
    return await this.deliverySpaceService.updateForAdmin(
      deliverySpaceNo,
      adminDeliverySpaceUpdateDto,
      admin.no,
    );
  }
}
