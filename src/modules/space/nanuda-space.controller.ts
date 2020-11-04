import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseController } from 'src/core';
import { SearchResults } from '../company-district/nanuda-company-district.service';
import { NanudaSpaceSearchDto, SpaceListDto } from './dto';
import { NanudaSpaceService } from './nanuda-space.service';
import { Space } from './space.entity';

@Controller()
@ApiTags('NANUDA SPACE')
export class NanudaSpaceController extends BaseController {
  constructor(private nanudaSpaceService: NanudaSpaceService) {
    super();
  }

  /**
   * dropdown list for nanuda spaced
   * @param spaceListDto
   */
  @Get('/nanuda/space/dropdown')
  async dropdown(@Query() spaceListDto: SpaceListDto) {
    return await this.nanudaSpaceService.spaceDropDown(spaceListDto);
  }

  /**
   * get center for map
   * @param spaceListDto
   */
  @Get('/nanuda/space/get-center')
  async getCenter(@Query() spaceListDto: SpaceListDto): Promise<SearchResults> {
    return await this.nanudaSpaceService.getCenterForMap(spaceListDto);
  }

  /**
   * get space list
   * @param spaceListDto
   */
  @Get('/nanuda/space/search')
  async search(
    @Query() spaceListDto: SpaceListDto,
    @Query() nanudaSpaceSearchDto: NanudaSpaceSearchDto,
  ): Promise<SearchResults> {
    return await this.nanudaSpaceService.search(
      spaceListDto,
      nanudaSpaceSearchDto,
    );
  }

  /**
   * get count
   */
  @Get('/nanuda/space/count')
  async spaceCount() {
    return await this.nanudaSpaceService.spaceCount();
  }

  /**
   * find similar
   * @param spaceNo
   * @param pagination
   */
  @Get('/nanuda/space/:id([0-9]+)/similar')
  async findSimilar(
    @Param('id', ParseIntPipe) spaceNo: number,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Space>> {
    return await this.nanudaSpaceService.findRelativeSpaces(
      spaceNo,
      pagination,
    );
  }
}
