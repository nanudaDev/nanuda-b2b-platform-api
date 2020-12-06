import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BestSpaceMapper } from './best-space.entity';
import { Repository } from 'typeorm';
import { AdminBestSpaceListDto } from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';

@Injectable()
export class BestSpaceService extends BaseService {
  constructor(
    @InjectRepository(BestSpaceMapper)
    private readonly bestSpaceMapperRepo: Repository<BestSpaceMapper>,
  ) {
    super();
  }

  /**
   * find all best for admin
   * @param adminBestSpaceListDto
   * @param pagination
   */
  async findAllBestDeliverySpace(
    adminBestSpaceListDto: AdminBestSpaceListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<BestSpaceMapper>> {
    const qb = this.bestSpaceMapperRepo
      .createQueryBuilder('bestSpace')
      .CustomInnerJoinAndSelect(['deliverySpace'])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .AndWhereLike(
        'deliverySpace',
        'typeName',
        adminBestSpaceListDto.deliverySpaceTypeName,
        adminBestSpaceListDto.exclude('deliverySpaceTypeName'),
      )
      .AndWhereLike(
        'companyDistrict',
        'nameKr',
        adminBestSpaceListDto.companyDistrictNameKr,
        adminBestSpaceListDto.exclude('companyDistrictNameKr'),
      )
      .AndWhereLike(
        'company',
        'nameKr',
        adminBestSpaceListDto.companyNameKr,
        adminBestSpaceListDto.exclude('companyNameKr'),
      )
      .AndWhereLike(
        'deliverySpace',
        'deposit',
        adminBestSpaceListDto.deliverySpaceDeposit,
        adminBestSpaceListDto.exclude('deliverySpaceDeposit'),
      )
      .andWhere('companyDistrict.region1DepthName = :region1DepthName', {
        region1DepthName: '서울',
      })
      .WhereAndOrder(adminBestSpaceListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }
}
