import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { NanudaDeliveryFounderConsultService } from './nanuda-delivery-founder-consult.service';
import { NanudaDeliveryFounderConsultCreateDto } from './dto';
import { DeliveryFounderConsult } from './delivery-founder-consult.entity';

@Controller()
@ApiTags('NANUDA DELIVERY FOUNDER CONSULT')
export class NanudaDeliveryFounderConsultController extends BaseController {
  constructor(
    private readonly nanudaDeliveryFounderConsultService: NanudaDeliveryFounderConsultService,
  ) {
    super();
  }

  /**
   * create for nanuda user
   * @param nanudaDeliveryFounderConsultCreateDto
   */
  @Post('/nanuda/delivery-founder-consult')
  async create(
    @Body()
    nanudaDeliveryFounderConsultCreateDto: NanudaDeliveryFounderConsultCreateDto,
  ): Promise<DeliveryFounderConsult> {
    return await this.nanudaDeliveryFounderConsultService.create(
      nanudaDeliveryFounderConsultCreateDto,
    );
  }
}
