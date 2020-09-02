import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards, Controller, Post, Body } from '@nestjs/common';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { UserInfo } from 'src/common';
import { Admin } from '../admin';
import { AdminBannerCreateDto } from './dto';
import { Banner } from './banner.entity';
import { BannerService } from './banner.service';

@Controller()
@ApiTags('ADMIN BANNER')
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
@ApiBearerAuth()
export class AdminBannerController extends BaseController {
  constructor(private readonly bannerService: BannerService) {
    super();
  }

  /**
   * create banner
   * @param admin
   * @param adminBannerCreateDto
   */
  @Post('/admin/banner')
  async createBanner(
    @UserInfo() admin: Admin,
    @Body() adminBannerCreateDto: AdminBannerCreateDto,
  ): Promise<Banner> {
    return await this.bannerService.createBanner(
      admin.no,
      adminBannerCreateDto,
    );
  }
}
