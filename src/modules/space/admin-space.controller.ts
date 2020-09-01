import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { SpaceService } from './space.service';
import { AdminSpaceListDto } from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { Space } from './space.entity';

@Controller()
@ApiTags('ADMIN SPACE')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminSpaceController extends BaseController {
  constructor(private readonly spaceService: SpaceService) {
    super();
  }

  /**
   * find all for admin space
   * @param adminSpaceListDto
   * @param pagination
   */
  @Get('/admin/space')
  async findAll(
    @Query() adminSpaceListDto: AdminSpaceListDto,
    @Query() pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<Space>> {
    return await this.spaceService.findAllForAdmin(
      adminSpaceListDto,
      pagination,
    );
  }
}
