import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { APPROVAL_STATUS, BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { CompanyDistrictPromotionMapper } from '../company-district-promotion-mapper/company-district-promotion-mapper.entity';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { Company } from '../company/company.entity';
import { CompanyDistrictPromotion } from './company-district-promotion.entity';
import {
  AdminCompanyDistrictPromotionCreateDto,
  AdminCompanyDistrictPromotionListDto,
  AdminCompanyDistrictPromotionUpdateDto,
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
      .CustomInnerJoinAndSelect(['codeManagement'])
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
      .CustomInnerJoinAndSelect(['codeManagement'])
      .where('promotion.no = :no', { no: promotionNo })
      .getOne();

    if (qb.ended < new Date()) {
      qb.isExpired = YN.YES;
    }

    return qb;
  }

  /**
   * find all districts mapped by promotions
   * for nanuda user and approval statuses
   * @param promotionNo
   * @param pagination
   */
  async findDistricts(
    promotionNo: number,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrict>> {
    const ids = [];
    const districtIds = await this.entityManager
      .getRepository(CompanyDistrictPromotionMapper)
      .createQueryBuilder('mapper')
      .select(['mapper.companyDistrictNo'])
      .where('mapper.promotionNo = :promotionNo', { promotionNo: promotionNo })
      .getMany();
    console.log(districtIds);
    districtIds.map(districtId => {
      ids.push(districtId.companyDistrictNo);
    });
    const districts = this.entityManager
      .getRepository(CompanyDistrict)
      .createQueryBuilder('district')
      .CustomInnerJoinAndSelect(['company', 'codeManagement'])
      .whereInIds(ids)
      .Paginate(pagination);

    const [items, totalCount] = await districts.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * create for admin
   * @param adminCompanyDistrictPromotionCreateDto
   */
  async createForAdmin(
    adminCompanyDistrictPromotionCreateDto: AdminCompanyDistrictPromotionCreateDto,
  ): Promise<CompanyDistrictPromotion> {
    let newPromotion = new CompanyDistrictPromotion(
      adminCompanyDistrictPromotionCreateDto,
    );
    newPromotion = await this.entityManager
      .getRepository(CompanyDistrictPromotion)
      .save(newPromotion);

    // if adding through promotions create district mapper
    if (
      adminCompanyDistrictPromotionCreateDto.companyDistrictIds &&
      adminCompanyDistrictPromotionCreateDto.companyDistrictIds.length > 0
    ) {
      await Promise.all(
        adminCompanyDistrictPromotionCreateDto.companyDistrictIds.map(
          async id => {
            const district = await this.entityManager
              .getRepository(CompanyDistrict)
              .createQueryBuilder('district')
              .andWhere(
                'district.companyDistrictStatus = :companyDistrictStatus',
                { companyDistrictStatus: APPROVAL_STATUS.APPROVAL },
              )
              .where('district.no = :no', { no: id })
              .getOne();

            let newMapper = new CompanyDistrictPromotionMapper();
            newMapper.promotionNo = newPromotion.no;
            newMapper.companyNo = district.companyNo;
            newMapper.companyDistrictNo = district.no;
            newMapper = await this.entityManager
              .getRepository(CompanyDistrictPromotionMapper)
              .save(newMapper);
          },
        ),
      );
    }
    return newPromotion;
  }

  /**
   * update existing promotion
   * @param promotionNo
   * @param adminCompanyDistrictPromotionUpdateDto
   */
  async updateForAdmin(
    promotionNo: number,
    adminCompanyDistrictPromotionUpdateDto: AdminCompanyDistrictPromotionUpdateDto,
  ): Promise<CompanyDistrictPromotion> {
    let promotion = await this.promotionRepo.findOne(promotionNo);
    promotion = promotion.set(adminCompanyDistrictPromotionUpdateDto);
    promotion = await this.promotionRepo.save(promotion);
    if (
      adminCompanyDistrictPromotionUpdateDto.companyDistrictIds &&
      adminCompanyDistrictPromotionUpdateDto.companyDistrictIds.length > 0
    ) {
      // delete first
      await this.entityManager
        .getRepository(CompanyDistrictPromotionMapper)
        .createQueryBuilder()
        .delete()
        .from(CompanyDistrictPromotionMapper)
        .where('promotionNo = :promotionNo', { promotionNo: promotionNo })
        .execute();

      await Promise.all(
        adminCompanyDistrictPromotionUpdateDto.companyDistrictIds.map(
          async id => {
            const district = await this.entityManager
              .getRepository(CompanyDistrict)
              .createQueryBuilder('district')
              .andWhere(
                'district.companyDistrictStatus = :companyDistrictStatus',
                { companyDistrictStatus: APPROVAL_STATUS.APPROVAL },
              )
              .where('district.no = :no', { no: id })
              .getOne();

            let newMapper = new CompanyDistrictPromotionMapper();
            newMapper.promotionNo = promotionNo;
            newMapper.companyNo = district.companyNo;
            newMapper.companyDistrictNo = district.no;
            newMapper = await this.entityManager
              .getRepository(CompanyDistrictPromotionMapper)
              .save(newMapper);
          },
        ),
      );
    }
    return promotion;
  }
}
