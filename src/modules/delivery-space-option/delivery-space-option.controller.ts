import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_COMPANY_USER, BaseController } from 'src/core';
import { DeliverySpaceOptionService } from './delivery-space-option.service';
import { DeliverySpaceOption } from './delivery-space-option.entity';

@Controller()
@ApiTags('DELIVERY SPACE OPTION')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
export class DeliverySpaceOptionController extends BaseController {
  constructor(
    private readonly deliverySpaceOptionService: DeliverySpaceOptionService,
  ) {
    super();
  }

  @Get('/delivery-space-option')
  async findAll(): Promise<DeliverySpaceOption[]> {
    return await this.deliverySpaceOptionService.findAll();
  }
}
