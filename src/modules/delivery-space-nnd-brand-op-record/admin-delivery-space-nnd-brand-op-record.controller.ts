import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, BaseController, CONST_ADMIN_USER } from 'src/core';
import { DeliverySpaceNndBrandOpRecord } from './delivery-space-nnd-brand-op-record.entity';
import { DeliverySpaceNndBrandOpRecordService } from './delivery-space-nnd-brand-op-record.service';
import { DeliverySpaceNndBrandOpRecordDto } from './dto';

@Controller()
@ApiTags('ADMIN DELIVERY SPACE NND BRAND OPERATION RECORD')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminDeliverySpaceNndBrandOpController extends BaseController {
  constructor(
    private readonly deliverySpaceNndBrandOpRecondService: DeliverySpaceNndBrandOpRecordService,
  ) {
    super();
  }

  /**
   * find all for record
   * @param nndRecordNo
   */
  @Get('/admin/delivery-space-nnd-op-record/:id([0-9]+)/brands')
  async findAll(
    @Param('id', ParseIntPipe) nndRecordNo: number,
  ): Promise<DeliverySpaceNndBrandOpRecord[]> {
    return await this.deliverySpaceNndBrandOpRecondService.findAllForRecord(
      nndRecordNo,
    );
  }

  /**
   * update existing operating brand
   * @param nndOpRecordNo
   * @param nndBrandRecordNo
   */
  @Patch(
    '/admin/delivery-space-nnd-op-record/:id([0-9]+)/brands/:brandId([0-9]+)',
  )
  async updateOperatingBrand(
    @Param('id') nndOpRecordNo: number,
    @Param('brandId') nndBrandRecordNo: number,
  ): Promise<DeliverySpaceNndBrandOpRecord> {
    return await this.deliverySpaceNndBrandOpRecondService.updateOperatingBrand(
      nndOpRecordNo,
      nndBrandRecordNo,
    );
  }
}
