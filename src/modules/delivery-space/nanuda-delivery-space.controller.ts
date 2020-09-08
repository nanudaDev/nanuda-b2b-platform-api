import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { BaseController } from 'src/core';
import { NanudaDeliverySpaceService } from './nanuda-delivery-space.service';
import { DeliverySpaceListDto } from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { DeliverySpace } from './delivery-space.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('NANUDA DELIVERY SPACE')
export class NanudaDeliverySpaceController extends BaseController {
  constructor(
    private readonly nanudaDeliverySpaceService: NanudaDeliverySpaceService,
  ) {
    super();
  }

  /**
   * find for nanuda
   * @param nanudaDeliverySpaceListDto
   * @param pagination
   */
  @Get('/nanuda/delivery-space')
  async findAll(
    @Query() nanudaDeliverySpaceListDto: DeliverySpaceListDto,
    @Query() pagination: PaginatedRequest,
    @Query() nanudaUserNo?: number,
  ): Promise<PaginatedResponse<DeliverySpace>> {
    console.log(nanudaUserNo);
    if (nanudaUserNo) {
      nanudaDeliverySpaceListDto.nanudaUserNo = nanudaUserNo;
    }
    return await this.nanudaDeliverySpaceService.findAllForNanudaUser(
      nanudaDeliverySpaceListDto,
      pagination,
    );
  }

  @Get('/nanuda/delivery-space/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) deliverySpaceNo: number,
    @Query() nanudaUserNo?,
  ): Promise<DeliverySpace> {
    return await this.nanudaDeliverySpaceService.findOneForNanudaUser(
      deliverySpaceNo,
      nanudaUserNo.nanudaUserNo,
    );
  }
}
