import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, BaseController, CONST_ADMIN_USER } from 'src/core';
import { BrandKioskMapper } from './brand-kiosk-mapper.entity';
import { BrandKioskMapperService } from './brand-kiosk-mapper.service';

@Controller()
@ApiTags('ADMIN BRAND KIOSK MAPPER')
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
@ApiBearerAuth()
export class AdminBrandKioskMapperController extends BaseController {
  constructor(
    private readonly brandKioskMapperService: BrandKioskMapperService,
  ) {
    super();
  }

  /**
   * get revenue for brand by districts
   * @param brandNo
   */
  @Get('/admin/brand-revenue/:id([0-9]+)')
  async brandRevenue(@Param('id', ParseIntPipe) brandNo: number) {
    return await this.brandKioskMapperService.findRevenueForBrand(brandNo);
  }
}
