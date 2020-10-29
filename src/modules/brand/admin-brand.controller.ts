import {
  Controller,
  UseGuards,
  Post,
  Body,
  Query,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { BrandService } from './brand.service';
import { UserInfo, PaginatedRequest, PaginatedResponse } from 'src/common';
import { Admin } from '../admin';
import {
  AdminBrandCreateDto,
  AdminBrandListDto,
  AdminBrandUpdateDto,
} from './dto';
import { Brand } from './brand.entity';

@Controller()
@ApiTags('ADMIN BRAND')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminBrandController extends BaseController {
  constructor(private readonly brandService: BrandService) {
    super();
  }

  /**
   * find all
   * @param adminBrandListDto
   * @param pagination
   */
  @Get('/admin/brand')
  async findAll(
    @Query() adminBrandListDto: AdminBrandListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Brand>> {
    return await this.brandService.findAllForAdmin(
      adminBrandListDto,
      pagination,
    );
  }

  @Get('/admin/brand/select-option')
  async find() {
    return await this.brandService.findAll();
  }

  /**
   * find one for admin
   * @param brandNo
   */
  @Get('/admin/brand/:id([0-9]+)')
  async findOne(@Param('id', ParseIntPipe) brandNo: number): Promise<Brand> {
    return await this.brandService.findOne(brandNo);
  }

  /**
   * find nanuda brand
   */
  @Get('/admin/brand/recommended')
  async findNanudaBrand() {
    return await this.brandService.findNanudaBrand();
  }

  /**
   * create for admin
   * @param admin
   * @param adminBrandCreateDto
   */
  @Post('/admin/brand')
  async create(
    @UserInfo() admin: Admin,
    @Body() adminBrandCreateDto: AdminBrandCreateDto,
  ): Promise<Brand> {
    return await this.brandService.createByAdmin(admin.no, adminBrandCreateDto);
  }

  /**
   * brand update
   * @param admin
   * @param brandNo
   * @param adminBrandUpdateDto
   */
  @Patch('/admin/brand/:id([0-9]+)')
  async update(
    @UserInfo() admin: Admin,
    @Param('id', ParseIntPipe) brandNo: number,
    @Body() adminBrandUpdateDto: AdminBrandUpdateDto,
  ): Promise<Brand> {
    return await this.brandService.updateForAdmin(
      brandNo,
      adminBrandUpdateDto,
      admin.no,
    );
  }

  /**
   * delete brand
   * @param brandNo
   */
  @Delete('/admin/brand/:id([0-9]+)')
  async deleteBrand(@Param('id', ParseIntPipe) brandNo: number) {
    return await this.brandService.deleteBrand(brandNo);
  }
}
