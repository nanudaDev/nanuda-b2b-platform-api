import { Injectable } from '@nestjs/common';
import { APPROVAL_STATUS, BaseService } from 'src/core';
import { NanudaBestSpaceListDto } from './dto';
import {
  ORDER_BY_VALUE,
  PaginatedRequest,
  PaginatedResponse,
  YN,
} from 'src/common';
import { BestSpaceMapper } from './best-space.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';

@Injectable()
export class NanudaBestSpaceService extends BaseService {
  constructor(
    @InjectRepository(BestSpaceMapper)
    private readonly bestSpaceMapperRepo: Repository<BestSpaceMapper>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
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
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .leftJoinAndSelect('deliverySpace.brands', 'brands')
      .where('bestSpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.showYn = :spaceShowYn', { spaceShowYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .WhereAndOrder(nanudaBestSpaceListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find best spaces
   * @param nanudaBestSpaceListDto
   * @param pagination
   */
  async findBestSpacesByQuery(
    nanudaBestSpaceListDto: NanudaBestSpaceListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliverySpace>> {
    const qb = this.entityManager
      .getRepository(DeliverySpace)
      .createQueryBuilder('deliverySpaces')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .CustomLeftJoinAndSelect(['contracts'])
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('companyDistrict.companyDistrictStatus = :companyDistrictStatus', {
        companyDistrictStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere('companyDistrict.region1DepthName = :region1DepthName', {
        region1DepthName: '서울',
      })
      .andWhere('deliverySpaces.delYn = :delYn', { delYn: YN.NO })
      .andWhere('deliverySpaces.showYn = :showYn', { showYn: YN.YES })
      // .andWhere('deliverySpaces.isOpenedYn = :isOpenedYn', {
      //   isOpenedYn: YN.NO,
      // })
      .andWhere('deliverySpaces.quantity > 0')
      .AndWhereLike(
        'company',
        'nameKr',
        nanudaBestSpaceListDto.companyNameKr,
        nanudaBestSpaceListDto.exclude('companyNameKr'),
      )
      .AndWhereLike(
        'companyDistrict',
        'nameKr',
        nanudaBestSpaceListDto.companyDistrictNameKr,
        nanudaBestSpaceListDto.exclude('companyDistrictNameKr'),
      )
      .orderBy('deliverySpaces.quantity', ORDER_BY_VALUE.DESC)
      .Paginate(pagination);

    let [items, totalCount] = await qb.getManyAndCount();

    items.map(deliverySpace => {
      const remaining = deliverySpace.quantity - deliverySpace.contracts.length;
      if (remaining === 0) {
        const index = items.indexOf(deliverySpace);
        items.splice(index, 1);
        totalCount = totalCount - 1;
      }
    });

    return { items, totalCount };
  }
}
