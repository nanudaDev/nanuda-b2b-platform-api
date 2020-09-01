import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { FoodCategory } from './food-category.entity';
import { Repository } from 'typeorm';
import { AdminFoodCategoryListDto, FoodCategoryListDto } from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';

@Injectable()
export class FoodCategoryService extends BaseService {
  constructor(
    @InjectRepository(FoodCategory)
    private readonly foodCategoryRepo: Repository<FoodCategory>,
  ) {
    super();
  }
  /**
   * find all for admin
   * @param adminFoodCategoryListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminFoodCategoryListDto: AdminFoodCategoryListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<FoodCategory>> {
    const qb = this.foodCategoryRepo
      .createQueryBuilder('foodCategory')
      .AndWhereLike(
        'foodCategory',
        'code',
        adminFoodCategoryListDto.code,
        adminFoodCategoryListDto.exclude('code'),
      )
      .AndWhereLike(
        'foodCategory',
        'nameKr',
        adminFoodCategoryListDto.nameKr,
        adminFoodCategoryListDto.exclude('nameKr'),
      )

      .AndWhereLike(
        'foodCategory',
        'nameEng',
        adminFoodCategoryListDto.nameEng,
        adminFoodCategoryListDto.exclude('nameEng'),
      )
      .WhereAndOrder(adminFoodCategoryListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  async findAll(): Promise<FoodCategory[]> {
    return await this.foodCategoryRepo.find();
  }

  /**
   * find for company user
   * @param foodCategoryListDto
   * @param pagination
   */
  async findAllForCompanyUser(
    foodCategoryListDto: FoodCategoryListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<FoodCategory>> {
    const qb = this.foodCategoryRepo
      .createQueryBuilder('foodCategory')
      .AndWhereLike(
        'foodCategory',
        'nameKr',
        foodCategoryListDto.nameKr,
        foodCategoryListDto.exclude('nameKr'),
      )
      .WhereAndOrder(foodCategoryListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find one for food category
   * @param foodCategoryNo
   */
  async findOne(foodCategoryNo: number): Promise<FoodCategory> {
    return await this.foodCategoryRepo.findOne(foodCategoryNo);
  }
}
