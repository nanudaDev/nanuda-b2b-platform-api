import {
  Controller,
  UseGuards,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AuthRolesGuard,
  CONST_ADMIN_USER,
  BaseController,
  AMENITY,
  ADMIN_USER,
} from 'src/core';
import { AmenityService } from './amenity.service';
import {
  AdminAmenityListDto,
  AdminAmenityCreateDto,
  AdminAmenityUpdateDto,
} from './dto';
import { Amenity } from './amenity.entity';
import { PaginatedRequest, PaginatedResponse } from 'src/common';

@Controller()
@ApiBearerAuth()
@ApiTags('ADMIN AMENITY')
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminAmenityController extends BaseController {
  constructor(private readonly amenityService: AmenityService) {
    super();
  }

  /**
   * paginated
   * @param adminAmenityListDto
   * @param pagination
   */
  @Get('/admin/amenity')
  async findAllPaginated(
    @Query() adminAmenityListDto: AdminAmenityListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Amenity>> {
    return await this.amenityService.findAllPaginate(
      adminAmenityListDto,
      pagination,
    );
  }

  /**
   * update amenity
   * @param amenityNo
   * @param adminAmenityUpdateDto
   */
  @Patch('/admin/amenity/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) amenityNo: number,
    @Body() adminAmenityUpdateDto: AdminAmenityUpdateDto,
  ): Promise<Amenity> {
    return await this.amenityService.update(amenityNo, adminAmenityUpdateDto);
  }

  /**
   * find all for admin COMMON
   * @param adminAmenityListDto
   */
  @Get('/admin/amenity/common-facility')
  async findAll(
    @Query() adminAmenityListDto: AdminAmenityListDto,
  ): Promise<Amenity[]> {
    adminAmenityListDto.amenityType = AMENITY.COMMON_FACILITY;
    return await this.amenityService.findAll(adminAmenityListDto);
  }

  /**
   * find all for admin KITCHEN
   * @param adminAmenityListDto
   */
  @Get('/admin/amenity/kitchen-facility')
  async findAllKitchen(
    @Query() adminAmenityListDto: AdminAmenityListDto,
  ): Promise<Amenity[]> {
    adminAmenityListDto.amenityType = AMENITY.KITCHEN_FACILITY;
    return await this.amenityService.findAll(adminAmenityListDto);
  }

  /**
   * create for admin
   * @param adminAmenityCreateDto
   */
  @UseGuards(new AuthRolesGuard(ADMIN_USER.SUPER))
  @Post('/admin/amenity')
  async create(
    @Body() adminAmenityCreateDto: AdminAmenityCreateDto,
  ): Promise<Amenity> {
    return await this.amenityService.createAmenity(adminAmenityCreateDto);
  }

  /**
   * delete amenity
   * @param amenityNo
   */
  @UseGuards(new AuthRolesGuard(ADMIN_USER.SUPER))
  @Delete('/admin/amenity/:id([0-9]+)')
  async deleteAmenity(@Param('id', ParseIntPipe) amenityNo: number) {
    return await this.amenityService.deleteAmenity(amenityNo);
  }
}
