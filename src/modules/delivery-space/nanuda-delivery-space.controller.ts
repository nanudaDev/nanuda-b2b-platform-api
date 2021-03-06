import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Post,
  Body,
} from '@nestjs/common';
import { BaseController } from 'src/core';
import { NanudaDeliverySpaceService } from './nanuda-delivery-space.service';
import {
  CheckRatingDto,
  DeliverySpaceListDto,
  NanudaCreateTrackDto,
  NanudaDeliverySpaceFindDistrictOrCityDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { DeliverySpace } from './delivery-space.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('NANUDA DELIVERY SPACE')
export class NanudaDeliverySpaceController extends BaseController {
  constructor(
    private readonly nanudaDeliverySpaceService: NanudaDeliverySpaceService,
  ) {
    super();
  }

  /**
   * find for nanuda
   * @param nanudaDeliverySpaceListDto
   * @param pagination
   */
  @Get('/nanuda/delivery-space')
  async findAll(
    @Query() nanudaDeliverySpaceListDto: DeliverySpaceListDto,
    @Query() pagination: PaginatedRequest,
    @Query() nanudaUserNo?: number,
    @Query() checkRatingDto?: CheckRatingDto,
  ): Promise<PaginatedResponse<DeliverySpace>> {
    if (nanudaUserNo) {
      nanudaDeliverySpaceListDto.nanudaUserNo = nanudaUserNo;
    }
    return await this.nanudaDeliverySpaceService.findAllForNanudaUser(
      nanudaDeliverySpaceListDto,
      pagination,
      checkRatingDto,
    );
  }

  /**
   * find one
   * @param deliverySpaceNo
   * @param nanudaUserNo
   */
  @Get('/nanuda/delivery-space/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) deliverySpaceNo: number,
    @Query() nanudaUserNo?,
  ): Promise<DeliverySpace> {
    return await this.nanudaDeliverySpaceService.findOneForNanudaUser(
      deliverySpaceNo,
      nanudaUserNo.nanudaUserNo,
    );
  }

  /**
   * find relative spaces
   * @param deliverySpaceNo
   * @param pagination
   */
  @Get('/nanuda/delivery-space/:id([0-9]+)/similar')
  async findSimilarSpaces(
    @Param('id', ParseIntPipe) deliverySpaceNo: number,
    @Query() pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliverySpace>> {
    return await this.nanudaDeliverySpaceService.findRelativeSpaces(
      deliverySpaceNo,
      pagination,
    );
  }

  /**
   * get max values
   */
  @Get('/nanuda/delivery-space/max-values')
  async findMaxValues() {
    return await this.nanudaDeliverySpaceService.findMaxValues();
  }

  /**
   * get count
   */
  @Get('/nanuda/delivery-space/count')
  async deliverySpaceCount() {
    return await this.nanudaDeliverySpaceService.deliverySpaceCount();
  }

  /**
   *
   * @param nanudaDeliverySpaceFindDistrictDto
   */
  @Get('/nanuda/delivery-space/find-all-district-by-code')
  async findAllDistrictsByCode(
    @Query()
    nanudaDeliverySpaceFindDistrictDto: NanudaDeliverySpaceFindDistrictOrCityDto,
  ): Promise<object[]> {
    return await this.nanudaDeliverySpaceService.findAllDistrictsByCityCode(
      nanudaDeliverySpaceFindDistrictDto,
    );
  }

  /**
   * create new track
   * @param createNewTrackDto
   */
  @Post('/nanuda/create-new-track')
  async createNewTrack(@Body() createNewTrackDto: NanudaCreateTrackDto) {
    return await this.nanudaDeliverySpaceService.trackTraceToSpaceCategory(
      createNewTrackDto,
    );
  }
}
