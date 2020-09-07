import {
  UseGuards,
  Controller,
  Get,
  Query,
  ParseIntPipe,
  Param,
  Patch,
  Body,
} from '@nestjs/common';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductConsultService } from './product-consult.service';
import {
  AdminProductConsultListDto,
  AdminProductConsultUpdateDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { ProductConsult } from './product-consult.entity';

@Controller()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
@ApiBearerAuth()
@ApiTags('ADMIN PRODUCT CONSULT')
export class AdminProductConsultController extends BaseController {
  constructor(private readonly productConsultService: ProductConsultService) {
    super();
  }

  /**
   * find all
   * @param adminProductConsultListDto
   * @param pagination
   */
  @Get('/admin/product-consult')
  async findAll(
    @Query() adminProductConsultListDto: AdminProductConsultListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<ProductConsult>> {
    return await this.productConsultService.findAllForAdmin(
      adminProductConsultListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param productConsultNo
   */
  @Get('/admin/product-consult/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) productConsultNo: number,
  ): Promise<ProductConsult> {
    return await this.productConsultService.findOneForAdmin(productConsultNo);
  }

  /**
   * update for admin
   * @param productConsultNo
   * @param adminProductConsultUpdateDto
   */
  @Patch('/admin/product-consult/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) productConsultNo: number,
    @Body() adminProductConsultUpdateDto: AdminProductConsultUpdateDto,
  ): Promise<ProductConsult> {
    return await this.productConsultService.updateForAdmin(
      productConsultNo,
      adminProductConsultUpdateDto,
    );
  }
}
