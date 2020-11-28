import { Controller, Query, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { NanudaBestSpaceService } from './nanuda-best-space.service';
import { NanudaBestSpaceListDto } from './dto';
import { PaginatedResponse, PaginatedRequest } from 'src/common';
import { BestSpaceMapper } from './best-space.entity';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';

@Controller()
@ApiTags('NANUDA BEST SPACE')
export class NanudaBestSpaceController extends BaseController {
  constructor(private readonly nanudaBestSpaceService: NanudaBestSpaceService) {
    super();
  }

  /**
   * find all
   * @param nanudaBestSpaceListDto
   * @param pagination
   */
  @Get('/nanuda/best-delivery-space')
  async findAll(
    @Query() nanudaBestSpaceListDto: NanudaBestSpaceListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<BestSpaceMapper>> {
    return await this.nanudaBestSpaceService.findAllBestDeliverySpaces(
      nanudaBestSpaceListDto,
      pagination,
    );
  }

  /**
   * find all best spaces by query
   * @param nanudaBestSpaceListDto
   * @param pagination
   */
  @Get('/nanuda/best-delivery-space/query')
  async findBestSpace(
    @Query() nanudaBestSpaceListDto: NanudaBestSpaceListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliverySpace>> {
    return await this.nanudaBestSpaceService.findBestSpacesByQuery(
      nanudaBestSpaceListDto,
      pagination,
    );
  }
}
