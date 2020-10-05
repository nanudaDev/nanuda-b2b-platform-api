import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { SearchResults } from '../company-district/nanuda-company-district.service';
import { SpaceListDto } from './dto';
import { NanudaSpaceService } from './nanuda-space.service';

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
}
