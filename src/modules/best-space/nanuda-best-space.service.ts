import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import { NanudaBestSpaceListDto } from './dto';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { BestSpaceMapper } from './best-space.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NanudaBestSpaceService extends BaseService {
  constructor(
    @InjectRepository(BestSpaceMapper)
    private readonly bestSpaceMapperRepo: Repository<BestSpaceMapper>,
  ) {
    super();
  }

  /**
   * find all
   * @param nanudaBestSpaceListDto
   * @param pagination
   */
  async findAllBestDeliverySpaces(
    nanudaBestSpaceListDto: NanudaBestSpaceListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<BestSpaceMapper>> {
    const qb = this.bestSpaceMapperRepo
      .createQueryBuilder('bestSpace')
      .CustomInnerJoinAndSelect(['deliverySpace'])
      .leftJoinAndSelect('deliverySpace.brands', 'brands')
      .where('bestSpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.showYn = :spaceShowYn', { spaceShowYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .WhereAndOrder(nanudaBestSpaceListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }
}
