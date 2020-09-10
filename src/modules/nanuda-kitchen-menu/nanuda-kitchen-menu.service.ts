import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { NanudaKitchenMenu } from './nanuda-kitchen-menu.entity';
import { Repository } from 'typeorm';
import { NanudaKitchenMenuListDto } from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';

@Injectable()
export class NanudaKitchenMenuService extends BaseService {
  constructor(
    @InjectRepository(NanudaKitchenMenu, 'kitchen')
    private readonly nanudaKitchenMenuRepo: Repository<NanudaKitchenMenu>,
  ) {
    super();
  }

  /**
   * find menus for kitchen master
   * @param nanudaKitchenMenuListDto
   * @param pagination
   */
  async findAllForNanudaKitchenMaster(
    nanudaKitchenMenuListDto: NanudaKitchenMenuListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<NanudaKitchenMenu>> {
    const qb = this.nanudaKitchenMenuRepo
      .createQueryBuilder('nanudaKitchenMenu')
      .CustomInnerJoinAndSelect(['nanudaKitchenMaster'])
      .AndWhereLike(
        'nanudaKitchenMenu',
        'menuName',
        nanudaKitchenMenuListDto.menuName,
        nanudaKitchenMenuListDto.exclude('menuName'),
      )
      .AndWhereEqual(
        'nanudaKitchenMenu',
        'menuPrice',
        nanudaKitchenMenuListDto.menuPrice,
        nanudaKitchenMenuListDto.exclude('menuPrice'),
      )
      .WhereAndOrder(nanudaKitchenMenuListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }
}
