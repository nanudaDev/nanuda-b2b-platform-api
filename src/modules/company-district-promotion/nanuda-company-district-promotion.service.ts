import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { APPROVAL_STATUS, BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { CompanyDistrictPromotionMapper } from '../company-district-promotion-mapper/company-district-promotion-mapper.entity';
import { Company } from '../company/company.entity';
import { CompanyDistrictPromotion } from './company-district-promotion.entity';

@Injectable()
export class NanudaCompanyDistrictPromotionService extends BaseService {
  constructor(
    @InjectRepository(CompanyDistrictPromotion)
    private readonly promotionRepo: Repository<CompanyDistrictPromotion>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * find all for nanuda user
   * @param pagination
   */
  async findAllForNanudaUser(
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrictPromotion>> {
    const qb = this.promotionRepo
      .createQueryBuilder('promotion')
      .CustomInnerJoinAndSelect(['codeManagement'])
      .where('promotion.showYn = :showYn', { showYn: YN.YES })
      .AndWhereBetweenDate(new Date())
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one for nanuda user
   * @param promotionNo
   */
  async findOneForNanudaUser(
    promotionNo: number,
  ): Promise<CompanyDistrictPromotion> {
    const promotion = await this.promotionRepo
      .createQueryBuilder('promotion')
      .CustomInnerJoinAndSelect(['codeManagement'])
      .where('promotion.showYn = :showYn', { showYn: YN.YES })
      .AndWhereBetweenDate(new Date())
      .andWhere('promotion.no = :no', { no: promotionNo })
      .getOne();

    if (!promotion) {
      throw new NotFoundException();
    }
    return promotion;
  }

  /**
   * find companies with promotion
   * @param promotionNo
   * @param pagination
   */
  async findCompaniesWithPromotions(
    promotionNo: number,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Company>> {
    const ids = [];
    const qb = await this.entityManager
      .getRepository(CompanyDistrictPromotionMapper)
      .createQueryBuilder('mapper')
      .where('mapper.promotionNo = :promotionNo', { promotionNo: promotionNo })
      .select(['mapper.companyNo'])
      .getMany();

    qb.map(q => {
      ids.push(q.companyNo);
    });

    const companies = this.entityManager
      .getRepository(Company)
      .createQueryBuilder('company')
      .whereInIds(ids)
      .andWhere('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .Paginate(pagination);

    const [items, totalCount] = await companies.getManyAndCount();

    return { items, totalCount };
  }
}
