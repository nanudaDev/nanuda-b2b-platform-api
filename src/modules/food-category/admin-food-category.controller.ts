import {
  Controller,
  UseGuards,
  Get,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { FoodCategoryService } from './food-category.service';
import { AdminFoodCategoryListDto } from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { FoodCategory } from './food-category.entity';

@ApiTags('ADMIN FOOD CATEGORY')
@ApiBearerAuth()
@Controller()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminFoodCategoryController extends BaseController {
  constructor(private readonly foodCategoryService: FoodCategoryService) {
    super();
  }

  /**
   * find all for food category
   * @param adminFoodCategoryListDto
   * @param pagination
   */
  @Get('/admin/food-category')
  async find(
    @Query() adminFoodCategoryListDto: AdminFoodCategoryListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<FoodCategory>> {
    return await this.foodCategoryService.findAllForAdmin(
      adminFoodCategoryListDto,
      pagination,
    );
  }

  @Get('/admin/food-category/select-option')
  async findAll(): Promise<FoodCategory[]> {
    return await this.foodCategoryService.findAll();
  }

  /**
   * find one for food category
   * @param foodCategoryNo
   */
  @Get('/admin/food-category/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) foodCategoryNo: number,
  ): Promise<FoodCategory> {
    return await this.foodCategoryService.findOne(foodCategoryNo);
  }
}
