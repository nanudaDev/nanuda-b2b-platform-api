import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from './space.entity';
import { Repository } from 'typeorm';
import { AdminSpaceListDto } from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';

@Injectable()
export class SpaceService extends BaseService {
  constructor(
    @InjectRepository(Space) private readonly spaceRepo: Repository<Space>,
  ) {
    super();
  }

  /**
   * find all for admin space
   * @param adminSpaceListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminSpaceListDto: AdminSpaceListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<Space>> {
    const qb = this.spaceRepo
      .createQueryBuilder('space')
      .CustomLeftJoinAndSelect([
        'amenities',
        'deliverySpaceOptions',
        'spaceType',
        'nanudaUser',
        'companyDistrictCategory',
      ])
      .leftJoinAndSelect('space.companyDistricts', 'companyDistricts')
      .leftJoinAndSelect('companyDistricts.company', 'company')
      .AndWhereLike(
        'space',
        'name',
        adminSpaceListDto.name,
        adminSpaceListDto.exclude('name'),
      )
      .AndWhereLike(
        'space',
        'address',
        adminSpaceListDto.address,
        adminSpaceListDto.exclude('address'),
      )
      .AndWhereLike(
        'company',
        'nameKr',
        adminSpaceListDto.companyName,
        adminSpaceListDto.exclude('companyName'),
      )
      .AndWhereEqual(
        'company',
        'no',
        adminSpaceListDto.companyNo,
        adminSpaceListDto.exclude('companyNo'),
      )
      .AndWhereLike(
        'companyDistricts',
        'name',
        adminSpaceListDto.companyDistrictName,
        adminSpaceListDto.exclude('companyDistrictName'),
      )
      .AndWhereEqual(
        'companyDistricts',
        'no',
        adminSpaceListDto.companyDistrictNo,
        adminSpaceListDto.exclude('companyDistrictNo'),
      )
      .WhereAndOrder(adminSpaceListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }
}
