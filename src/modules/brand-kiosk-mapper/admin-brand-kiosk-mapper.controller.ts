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
import { AdminBrandKioskMapperDto } from './dto';

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
  @Get('/admin/brand-revenue')
  async brandRevenue(
    @Query() adminBrandKioskMapperDto: AdminBrandKioskMapperDto,
  ) {
    return await this.brandKioskMapperService.findRevenueForBrand(
      adminBrandKioskMapperDto,
    );
  }
}
