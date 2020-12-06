import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { AuthRolesGuard, BaseController, CONST_ADMIN_USER } from 'src/core';
import { DeliveryFounderConsultRecord } from './delivery-founder-consult-record.entity';
import { DeliveryFounderConsultRecordService } from './delivery-founder-consult-record.service';

@Controller()
@ApiTags('ADMIN DELIVERY FOUNDER CONSULT RECORD')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminDeliveryFounderConsultRecordController extends BaseController {
  constructor(
    private readonly deliveryFounderConsultRecordService: DeliveryFounderConsultRecordService,
  ) {
    super();
  }

  /**
   * find records
   * @param deliveryFounderConsultNo
   * @param pagination
   */
  @Get(
    '/admin/delivery-founder-consult-record/delivery-founder-consult/:id([0-9]+)',
  )
  async findRecords(
    @Param('id', ParseIntPipe) deliveryFounderConsultNo: number,
  ): Promise<DeliveryFounderConsultRecord[]> {
    return await this.deliveryFounderConsultRecordService.findForConsult(
      deliveryFounderConsultNo,
    );
  }
}
