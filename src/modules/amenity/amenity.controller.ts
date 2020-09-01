import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import {
  BaseController,
  AuthRolesGuard,
  CONST_COMPANY_USER,
  AMENITY,
} from 'src/core';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminAmenityListDto, AmenityListDto } from './dto';
import { Amenity } from './amenity.entity';
import { AmenityService } from './amenity.service';

@Controller()
@ApiBearerAuth()
@ApiTags('AMENITY')
@UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
export class AmenityController extends BaseController {
  constructor(private readonly amenityService: AmenityService) {
    super();
  }

  /**
   * find all for admin COMMON
   * @param adminAmenityListDto
   */
  @Get('/amenity/common-facility')
  async findAll(@Query() amenityListDto: AmenityListDto): Promise<Amenity[]> {
    amenityListDto.amenityType = AMENITY.COMMON_FACILITY;
    return await this.amenityService.findAll(amenityListDto);
  }

  /**
   * find all for admin KITCHEN
   * @param adminAmenityListDto
   */
  @Get('/amenity/kitchen-facility')
  async findAllKitchen(
    @Query() amenityListDto: AmenityListDto,
  ): Promise<Amenity[]> {
    amenityListDto.amenityType = AMENITY.KITCHEN_FACILITY;
    return await this.amenityService.findAll(amenityListDto);
  }
}
