import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { DeliverySpaceOptionService } from './delivery-space-option.service';
import { DeliverySpaceOption } from './delivery-space-option.entity';

@Controller()
@ApiTags('ADMIN DELIVERY SPACE OPTION')
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
@ApiBearerAuth()
export class AdminDeliverySpaceOptionController extends BaseController {
  constructor(
    private readonly deliverySpaceOptionService: DeliverySpaceOptionService,
  ) {
    super();
  }

  /**
   * find all
   */
  @Get('/admin/delivery-space-option')
  async findAll(): Promise<DeliverySpaceOption[]> {
    return await this.deliverySpaceOptionService.findAll();
  }
}
