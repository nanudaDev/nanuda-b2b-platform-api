import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { CompanyDistrictPromotion } from './company-district-promotion.entity';
import {
  AdminCompanyDistrictPromotionCreateDto,
  AdminCompanyDistrictPromotionListDto,
} from './dto';

@Injectable()
export class CompanyDistrictPromotionService extends BaseService {
  constructor(
    @InjectRepository(CompanyDistrictPromotion)
    private readonly promotionRepo: Repository<CompanyDistrictPromotion>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminCompanyDistrictPromotionListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminCompanyDistrictPromotionListDto: AdminCompanyDistrictPromotionListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrictPromotion>> {
    const qb = this.promotionRepo
      .createQueryBuilder('promotion')
      .CustomLeftJoinAndSelect(['companyDistrict'])
      .CustomInnerJoinAndSelect(['promotionTypeCode'])
      .AndWhereLike(
        'promotion',
        'title',
        adminCompanyDistrictPromotionListDto.title,
        adminCompanyDistrictPromotionListDto.exclude('title'),
      )
      .AndWhereLike(
        'promotion',
        'displayTitle',
        adminCompanyDistrictPromotionListDto.displayTitle,
        adminCompanyDistrictPromotionListDto.exclude('displayTitle'),
      )
      .AndWhereLike(
        'companyDistrict',
        'nameKr',
        adminCompanyDistrictPromotionListDto.companyDistrictNameKr,
        adminCompanyDistrictPromotionListDto.exclude('companyDistrictNameKr'),
      )
      .WhereAndOrder(adminCompanyDistrictPromotionListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one for admin
   * @param promotionNo
   */
  async findOneForAdmin(
    promotionNo: number,
  ): Promise<CompanyDistrictPromotion> {
    let qb = await this.promotionRepo
      .createQueryBuilder('promotion')
      .CustomLeftJoinAndSelect(['companyDistrict'])
      .where('promotion.no = :no', { no: promotionNo })
      .CustomInnerJoinAndSelect(['promotionTypeCode'])
      .getOne();

    if (qb.ended < new Date()) {
      qb.isExpired = YN.YES;
    }

    return qb;
  }

  async createForAdmin(
    adminCompanyDistrictPromotionCreateDto: AdminCompanyDistrictPromotionCreateDto,
  ): Promise<CompanyDistrictPromotion> {
    let newPromotion = new CompanyDistrictPromotion(
      adminCompanyDistrictPromotionCreateDto,
    );
    return newPromotion;
  }
}
