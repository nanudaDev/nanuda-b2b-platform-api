import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BaseService,
  FOUNDER_CONSULT,
  APPROVAL_STATUS,
  SPACE_TYPE,
  CONST_NOTICE_BOARD,
} from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { DeliverySpace } from './delivery-space.entity';
import { Repository, EntityManager, In } from 'typeorm';
import { CompanyDistrict } from '../company-district/company-district.entity';
import {
  CheckRatingDto,
  DeliverySpaceListDto,
  NanudaCreateTrackDto,
  NanudaDeliverySpaceFindDistrictOrCityDto,
} from './dto';
import {
  ORDER_BY_VALUE,
  PaginatedRequest,
  PaginatedResponse,
  YN,
  LOCATION_TYPE,
} from 'src/common';
import { FavoriteSpaceMapper } from '../favorite-space-mapper/favorite-space-mapper.entity';
import { DeliveryFounderConsult } from '../delivery-founder-consult/delivery-founder-consult.entity';
import { CompanyDistrictPromotionMapper } from '../company-district-promotion-mapper/company-district-promotion-mapper.entity';
import { CompanyDistrictPromotion } from '../company-district-promotion/company-district-promotion.entity';
import { RemoveDuplicateObject } from 'src/core/utils';
import { TrackTraceToSpaceCategory } from '../track-trace-space-to-category/track-trace-space-to-category.entity';
import Axios from 'axios';

@Injectable()
export class NanudaDeliverySpaceService extends BaseService {
  constructor(
    @InjectRepository(DeliverySpace)
    private readonly deliverySpaceRepo: Repository<DeliverySpace>,
    @InjectRepository(CompanyDistrict)
    @InjectRepository(FavoriteSpaceMapper)
    private readonly faveMapperRepo: Repository<FavoriteSpaceMapper>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * find all for nanuda user
   * @param deliverySpaceListDto
   * @param pagination
   */
  async findAllForNanudaUser(
    deliverySpaceListDto: DeliverySpaceListDto,
    pagination: PaginatedRequest,
    checkRatingDto?: CheckRatingDto,
  ): Promise<PaginatedResponse<DeliverySpace>> {
    // passing nanuda user token from old server
    // amenity ids length because of exclude dto
    let nanudaUserNo = null;
    if (deliverySpaceListDto.nanudaUserNo) {
      nanudaUserNo = deliverySpaceListDto.nanudaUserNo;
      nanudaUserNo = nanudaUserNo.nanudaUserNo;
      delete deliverySpaceListDto.nanudaUserNo;
    }
    const qb = this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .CustomInnerJoinAndSelect(['companyDistrict', 'amenities'])
      .CustomLeftJoinAndSelect(['deliverySpaceOptions', 'contracts'])
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      // remaining count > 0
      .andWhere('deliverySpace.remainingCount > 0')
      //   .andWhere('deliveryFounderConsults.status != :status', {
      //     status: FOUNDER_CONSULT.F_DIST_COMPLETE,
      //   })
      .andWhere(
        'companyDistrict.companyDistrictStatus = :companyDistrictStatus',
        { companyDistrictStatus: APPROVAL_STATUS.APPROVAL },
      )
      .andWhere('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      // .AndWhereLike(
      //   'amenities',
      //   'amenityName',
      //   deliverySpaceListDto.amenityName,
      //   deliverySpaceListDto.exclude('amenityName'),
      // )
      // .AndWhereEqual(
      //   'promotions',
      //   'promotionType',
      //   deliverySpaceListDto.promotionType,
      //   deliverySpaceListDto.exclude('promotionType'),
      // )
      .AndWhereEqual(
        'deliverySpace',
        'no',
        deliverySpaceListDto.no,
        deliverySpaceListDto.exclude('no'),
      )
      .AndWhereLike(
        'deliverySpaceOptions',
        'deliverySpaceOptionName',
        deliverySpaceListDto.deliverySpaceOptionName,
        deliverySpaceListDto.exclude('deliverySpaceOptions'),
      )
      .AndWhereEqual(
        'deliverySpace',
        'monthlyRentFee',
        deliverySpaceListDto.monthlyRentFee,
        deliverySpaceListDto.exclude('monthlyRentFee'),
      )
      .AndWhereLike(
        'company',
        'nameKr',
        deliverySpaceListDto.companyNameKr,
        deliverySpaceListDto.exclude('companyNameKr'),
      )
      .AndWhereEqual(
        'company',
        'no',
        deliverySpaceListDto.companyNo,
        deliverySpaceListDto.exclude('companyNo'),
      )
      .AndWhereLike(
        'companyDistrict',
        'nameKr',
        deliverySpaceListDto.companyDistrictName,
        deliverySpaceListDto.exclude('companyDistrictName'),
      )
      .AndWhereEqual(
        'companyDistrict',
        'no',
        deliverySpaceListDto.companyDistrictNo,
        deliverySpaceListDto.exclude('companyDistrictNo'),
      )
      .AndWhereLike(
        'companyDistrict',
        'address',
        deliverySpaceListDto.address,
        deliverySpaceListDto.exclude('address'),
      )
      .AndWhereLike(
        'companyDistrict',
        'region2DepthName',
        deliverySpaceListDto.region2DepthName,
        deliverySpaceListDto.exclude('region2DepthName'),
      )
      .AndWhereLike(
        'companyDistrict',
        'region3DepthName',
        deliverySpaceListDto.region3DepthName,
        deliverySpaceListDto.exclude('region3DepthName'),
      )
      .AndWhereEqual(
        'companyDistrict',
        'hCode',
        deliverySpaceListDto.hCode,
        deliverySpaceListDto.exclude('hCode'),
      )
      .AndWhereEqual(
        'companyDistrict',
        'bCode',
        deliverySpaceListDto.bCode,
        deliverySpaceListDto.exclude('bCode'),
      );
    // if region1DepthName is '충청/경상'
    if (deliverySpaceListDto.region1DepthName === '경상') {
      qb.AndWhereIn('companyDistrict', 'region1DepthName', [
        '울산',
        '대구',
        '포항',
      ]);
      delete deliverySpaceListDto.region1DepthName;
    } else if (deliverySpaceListDto.region1DepthName === '충청') {
      qb.AndWhereIn('companyDistrict', 'region1DepthName', ['충남']);
      delete deliverySpaceListDto.region1DepthName;
    } else {
      qb.AndWhereLike(
        'companyDistrict',
        'region1DepthName',
        deliverySpaceListDto.region1DepthName,
        deliverySpaceListDto.exclude('region1DepthName'),
      );
    }
    // size
    if (deliverySpaceListDto.minSize && !deliverySpaceListDto.maxSize) {
      qb.andWhere('deliverySpace.size >= :minSize', {
        minSize: deliverySpaceListDto.minSize,
      });
      delete deliverySpaceListDto.minSize;
    } else if (!deliverySpaceListDto.minSize && deliverySpaceListDto.maxSize) {
      qb.andWhere('deliverySpace.size <= :maxSize', {
        maxSize: deliverySpaceListDto.maxSize,
      });
      delete deliverySpaceListDto.maxSize;
    } else if (deliverySpaceListDto.minSize && deliverySpaceListDto.maxSize) {
      qb.andWhere(
        `deliverySpace.size between ${deliverySpaceListDto.minSize} and ${deliverySpaceListDto.maxSize}`,
      );
      delete deliverySpaceListDto.minSize;
      delete deliverySpaceListDto.maxSize;
    }
    // deposit
    if (deliverySpaceListDto.minDeposit && !deliverySpaceListDto.maxDeposit) {
      qb.andWhere('deliverySpace.deposit >= :minDeposit', {
        minDeposit: deliverySpaceListDto.minDeposit,
      });
      delete deliverySpaceListDto.minDeposit;
    } else if (
      !deliverySpaceListDto.minDeposit &&
      deliverySpaceListDto.maxDeposit
    ) {
      qb.andWhere('deliverySpace.deposit <= :maxDeposit', {
        maxDeposit: deliverySpaceListDto.maxDeposit,
      });
      delete deliverySpaceListDto.maxDeposit;
    } else if (
      deliverySpaceListDto.minDeposit &&
      deliverySpaceListDto.maxDeposit
    ) {
      qb.andWhere(
        `deliverySpace.deposit between ${deliverySpaceListDto.minDeposit} and ${deliverySpaceListDto.maxDeposit}`,
      );
      delete deliverySpaceListDto.minDeposit;
      delete deliverySpaceListDto.maxDeposit;
    }
    // monthly rent
    if (
      deliverySpaceListDto.minMonthlyRentFee &&
      !deliverySpaceListDto.maxMonthlyRentFee
    ) {
      qb.andWhere('deliverySpace.monthlyRentFee >= :minMonthlyRentFee', {
        minMonthlyRentFee: deliverySpaceListDto.minMonthlyRentFee,
      });
      delete deliverySpaceListDto.minMonthlyRentFee;
    } else if (
      !deliverySpaceListDto.minMonthlyRentFee &&
      deliverySpaceListDto.maxMonthlyRentFee
    ) {
      qb.andWhere('deliverySpace.monthlyRentFee <= :maxMonthlyRentFee', {
        maxMonthlyRentFee: deliverySpaceListDto.maxMonthlyRentFee,
      });
      delete deliverySpaceListDto.maxMonthlyRentFee;
    } else if (
      deliverySpaceListDto.minMonthlyRentFee &&
      deliverySpaceListDto.maxMonthlyRentFee
    ) {
      qb.andWhere(
        `deliverySpace.monthlyRentFee between ${deliverySpaceListDto.minMonthlyRentFee} and ${deliverySpaceListDto.maxMonthlyRentFee}`,
      );
      delete deliverySpaceListDto.minMonthlyRentFee;
      delete deliverySpaceListDto.maxMonthlyRentFee;
    }
    // amenities
    if (
      deliverySpaceListDto.amenityIds &&
      deliverySpaceListDto.amenityIds.length > 0
    ) {
      const length = deliverySpaceListDto.amenityIds.length;
      qb.AndWhereIn(
        'amenities',
        'no',
        deliverySpaceListDto.amenityIds,
        deliverySpaceListDto.exclude('amenityIds'),
      );
      qb.groupBy('deliverySpace.no');
      qb.having(`count (distinct amenities.no) = ${length}`);
    }
    if (deliverySpaceListDto.promotionNo) {
      qb.leftJoinAndSelect('companyDistrict.promotions', 'promotions');
      qb.AndWhereEqual(
        'promotions',
        'no',
        deliverySpaceListDto.promotionNo,
        deliverySpaceListDto.exclude('promotionNo'),
      );
      qb.AndWhereJoinBetweenDate('promotions', new Date());
      qb.andWhere('promotions.showYn = :showYn', { showYn: YN.YES });
    }
    if (deliverySpaceListDto.promotionType) {
      qb.leftJoinAndSelect('companyDistrict.promotions', 'promotions');
      qb.AndWhereEqual(
        'promotions',
        'promotionType',
        deliverySpaceListDto.promotionType,
        deliverySpaceListDto.exclude('promotionType'),
      );
      qb.AndWhereJoinBetweenDate('promotions', new Date());
      qb.andWhere('promotions.showYn = :showYn', { showYn: YN.YES });
    }
    if (deliverySpaceListDto.orderByDeposit) {
      qb.addOrderBy(
        'deliverySpace.deposit',
        deliverySpaceListDto.orderByDeposit,
      );
      delete deliverySpaceListDto.orderByDeposit;
    }
    if (deliverySpaceListDto.orderByMonthlyRentFee) {
      qb.addOrderBy(
        'deliverySpace.monthlyRentFee',
        deliverySpaceListDto.orderByMonthlyRentFee,
      );
      delete deliverySpaceListDto.orderByMonthlyRentFee;
    }
    qb.WhereAndOrder(deliverySpaceListDto);
    qb.Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    // add favorite mark
    await Promise.all(
      items.map(async item => {
        const likedCount = await this.entityManager
          .getRepository(FavoriteSpaceMapper)
          .find({
            where: {
              deliverySpaceNo: item.no,
              spaceTypeNo: SPACE_TYPE.ONLY_DELIVERY,
            },
          });
        item.likedCount = likedCount.length;
        const consults = await this.entityManager
          .getRepository(DeliveryFounderConsult)
          .find({
            where: {
              status: In([
                FOUNDER_CONSULT.F_NEW_REG,
                FOUNDER_CONSULT.F_PROCEEDING,
              ]),
              deliverySpaceNo: item.no,
            },
          });
        item.consultCount = consults.length;
        delete item.contracts;
      }),
    );

    // 사용자 로그인 시 본인 라이크 볼 수 있게
    if (nanudaUserNo) {
      await Promise.all(
        items.map(async item => {
          const liked = await this.entityManager
            .getRepository(FavoriteSpaceMapper)
            .findOne({
              nanudaUserNo: nanudaUserNo,
              deliverySpaceNo: item.no,
            });
          if (liked) {
            item.likedYn = true;
            item.favoriteSpaceNo = liked.no;
          } else {
            item.likedYn = false;
          }
        }),
      );
    }
    if (checkRatingDto.isSkipped === YN.NO) {
      let newTrack = new TrackTraceToSpaceCategory();
      newTrack.isSkippedYn = YN.NO;
      newTrack.region1DepthName = items[0].companyDistrict.region1DepthName;
      newTrack.region2DepthName = items[0].companyDistrict.region2DepthName;
      newTrack.kbFoodCategory = checkRatingDto.kbFoodCategory;
      newTrack = await this.entityManager
        .getRepository(TrackTraceToSpaceCategory)
        .save(newTrack);
      // get grades
      const averageRatingArray = [];
      const averageRatingScoreArray = [];
      const averageTargetPopulationPercentileArray = [];
      const averageRevenuePercentileArray = [];
      await Promise.all(
        items.map(async item => {
          const grade = await Axios.get<any>(
            `${process.env.PLATFORM_ANALYSIS_URL}commercial-area-grade-by-hdong-category`,
            {
              params: {
                hdongCode: item.companyDistrict.hCode,
                mediumCategoryCode: checkRatingDto.kbFoodCategory,
                yymm: '2009',
              },
            },
          );
          if (
            !grade.data ||
            !grade.data.finalGrade ||
            grade.data === 'null' ||
            grade.data === null
          ) {
            item.rating = null;
            item.ratingScore = null;
            item.revenueAmountPercentile = null;
            item.targetPopulationPercentile = null;
          }
          if (grade.data && grade.data.finalGrade) {
            item.rating = grade.data.finalGrade['0'];
            item.ratingScore = grade.data.finalScore['0'];
            item.revenueAmountPercentile =
              grade.data.revenueAmountPercentile['0'];
            item.targetPopulationPercentile =
              grade.data.targetPopulationPercentile['0'];
          }
          if (item.rating > 4) {
            const index = items.indexOf(item);
            items.splice(index, 1);
          }
          // push values to array
          averageRatingArray.push(item.rating);
          averageRatingScoreArray.push(item.ratingScore);
          averageRevenuePercentileArray.push(item.revenueAmountPercentile);
          averageTargetPopulationPercentileArray.push(
            item.targetPopulationPercentile,
          );
        }),
      );
      if (averageRatingArray.length > 0) {
        const averageRating =
          averageRatingArray.reduce((a, b) => a + b, 0) /
          averageRatingArray.length;
        const averageRatingScore =
          averageRatingScoreArray.reduce((a, b) => a + b, 0) /
          averageRatingScoreArray.length;
        const averageTargetPopulationPercentile =
          averageTargetPopulationPercentileArray.reduce((a, b) => a + b, 0) /
          averageTargetPopulationPercentileArray.length;
        const averageRevenuePercentileScore =
          averageRevenuePercentileArray.reduce((a, b) => a + b, 0) /
          averageRevenuePercentileArray.length;
        items.map(item => {
          item.averageRating = Math.round(averageRating);
          item.averageRatingScore = Math.round(averageRatingScore);
          item.averageRevenuePercentileScore = Math.round(
            averageRevenuePercentileScore,
          );
          item.averageTargetPopulationPercentile = Math.round(
            averageTargetPopulationPercentile,
          );
        });
      }
    } else {
      if (items.length > 0) {
        let newTrack = new TrackTraceToSpaceCategory();
        newTrack.isSkippedYn = YN.YES;
        newTrack.region1DepthName =
          items[0].companyDistrict.region1DepthName || null;
        newTrack.region2DepthName =
          items[0].companyDistrict.region2DepthName || null;
        newTrack.kbFoodCategory = null;
        newTrack = await this.entityManager
          .getRepository(TrackTraceToSpaceCategory)
          .save(newTrack);
      }
    }
    return { items, totalCount };
  }

  /**
   * find one for nanuda user
   * @param deliverySpaceNo
   */
  async findOneForNanudaUser(
    deliverySpaceNo: number,
    nanudaUserNo?: number,
  ): Promise<DeliverySpace> {
    const space = await this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .CustomLeftJoinAndSelect([
        'amenities',
        'deliverySpaceOptions',
        'contracts',
      ])
      .leftJoinAndSelect('companyDistrict.amenities', 'commonAmenities')

      .leftJoinAndSelect('deliverySpace.brands', 'brands')
      .leftJoinAndSelect('companyDistrict.company', 'company')
      .where('deliverySpace.no = :no', { no: deliverySpaceNo })
      .andWhere('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .andWhere('brands.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.remainingCount > 0')
      .addOrderBy('brands.isRecommendedYn', ORDER_BY_VALUE.DESC)
      .getOne();
    if (!space) {
      throw new NotFoundException();
    }
    const likedCount = await this.entityManager
      .getRepository(FavoriteSpaceMapper)
      .find({
        where: {
          deliverySpaceNo: deliverySpaceNo,
          spaceTypeNo: SPACE_TYPE.ONLY_DELIVERY,
        },
      });

    space.likedCount = likedCount.length;

    const consults = await this.entityManager
      .getRepository(DeliveryFounderConsult)
      .find({
        where: {
          status: In([FOUNDER_CONSULT.F_NEW_REG, FOUNDER_CONSULT.F_PROCEEDING]),
          deliverySpaceNo: deliverySpaceNo,
        },
      });

    space.consultCount = consults.length;
    if (nanudaUserNo) {
      const liked = await this.entityManager
        .getRepository(FavoriteSpaceMapper)
        .findOne({
          nanudaUserNo: nanudaUserNo,
          deliverySpaceNo: deliverySpaceNo,
        });
      if (liked) {
        space.likedYn = true;
        space.favoriteSpaceNo = liked.no;
      } else {
        space.likedYn = false;
      }
    }
    // space.remainingCount = space.quantity - space.contracts.length;
    delete space.contracts;
    // if (space.remainingCount < 1) {
    //   throw new NotFoundException({ message: 'Full delivery space' });
    // }
    const promotionIds = [];
    const promotions = await this.entityManager
      .getRepository(CompanyDistrictPromotionMapper)
      .createQueryBuilder('mapper')
      .where('mapper.companyDistrictNo = :companyDistrictNo', {
        companyDistrictNo: space.companyDistrict.no,
      })
      .select(['mapper.promotionNo'])
      .getMany();
    if (promotions && promotions.length > 0) {
      promotions.map(promotion => {
        promotionIds.push(promotion.promotionNo);
      });
      space.companyDistrict.promotions = await this.entityManager
        .getRepository(CompanyDistrictPromotion)
        .createQueryBuilder('promotion')
        .CustomInnerJoinAndSelect(['codeManagement'])
        .whereInIds(promotionIds)
        .andWhere('promotion.showYn = :showYn', { showYn: YN.YES })
        .AndWhereBetweenDate(new Date())
        .getMany();
    }
    // update space count
    await this.deliverySpaceRepo
      .createQueryBuilder()
      .update(DeliverySpace)
      .set({ viewCount: space.viewCount + 1 })
      .where('no = :no', { no: deliverySpaceNo })
      .execute();

    return space;
  }

  /**
   * find relative spaces by deposit range
   * @param deliverySpaceNo
   * @param pagination
   */
  async findRelativeSpaces(
    deliverySpaceNo: number,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliverySpace>> {
    const selectedDeliverySpace = await this.deliverySpaceRepo.findOne(
      deliverySpaceNo,
    );
    const qb = this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .CustomLeftJoinAndSelect(['contracts'])
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .andWhere('company.companyStatus =:companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere(
        'companyDistrict.companyDistrictStatus = :companyDistrictStatus',
        { companyDistrictStatus: APPROVAL_STATUS.APPROVAL },
      )
      .andWhere(
        `deliverySpace.deposit BETWEEN ${selectedDeliverySpace.deposit} - 200 AND ${selectedDeliverySpace.deposit} + 200`,
      )
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .andWhere('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.quantity > 0')
      .andWhere('deliverySpace.remainingCount > 0')
      .limit(5)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    items.map(item => {
      if (item.no === selectedDeliverySpace.no) {
        const index = items.indexOf(item);
        items.splice(index, 1);
        totalCount - 1;
      }
      // if (item.quantity - item.contracts.length < 1) {
      //   const index = items.indexOf(item);
      //   items.splice(index, 1);
      //   totalCount - 1;
      // }
    });
    return { items, totalCount };
  }

  /**
   * get count for delivery space
   */
  async deliverySpaceCount() {
    const qb = this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('companyDistrict.companyDistrictStatus = :companyDistrictStatus', {
        companyDistrictStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .getCount();

    return await qb;
  }

  /**
   * find max values
   */
  async findMaxValues() {
    const maxDepositValue = await this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .where('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .andWhere('deliverySpace.quantity > 0')
      .andWhere('deliverySpace.remainingCount > 0')
      .select(['deliverySpace.deposit'])
      .limit(1)
      .orderBy('deliverySpace.deposit', ORDER_BY_VALUE.DESC)
      .getMany();

    const maxSizeValue = await this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .where('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .andWhere('deliverySpace.quantity > 0')
      .andWhere('deliverySpace.remainingCount > 0')
      .select(['deliverySpace.size'])
      .limit(1)
      .orderBy('deliverySpace.size', ORDER_BY_VALUE.DESC)
      .getMany();

    const maxRentValue = await this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .where('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .andWhere('deliverySpace.quantity > 0')
      .andWhere('deliverySpace.remainingCount > 0')
      .select(['deliverySpace.monthlyRentFee'])
      .limit(1)
      .orderBy('deliverySpace.monthlyRentFee', ORDER_BY_VALUE.DESC)
      .getMany();

    const results = {
      maxDeposit: maxDepositValue[0].deposit,
      maxSize: maxSizeValue[0].size,
      maxMonthlyRentFee: maxRentValue[0].monthlyRentFee,
    };
    return results;
  }

  /**
   * find all for landing page
   * @param deliverySpaceListDto
   */
  async findAllDeliverySpacesByDistricts(
    deliverySpaceListDto: DeliverySpaceListDto,
  ): Promise<DeliverySpace[]> {
    const qb = this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .innerJoin('companyDistrict.company', 'company')
      .where('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere(
        'companyDistrict.companyDistrictStatus = :companyDistrictStatus',
        { companyDistrictStatus: APPROVAL_STATUS.APPROVAL },
      )
      .AndWhereLike(
        'companyDistrict',
        'region2DepthName',
        deliverySpaceListDto.region2DepthName,
        deliverySpaceListDto.exclude('region2DepthName'),
      );

    return await qb.getMany();
  }

  /**
   * find all districts byt city
   * @param nanudaDeliverySpaceFindDistrictOrCityDto
   */
  async findAllDistrictsByCityCode(
    nanudaDeliverySpaceFindDistrictOrCityDto: NanudaDeliverySpaceFindDistrictOrCityDto,
  ): Promise<object[]> {
    const districtNamesAndCode = [];
    const qb = await this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .leftJoinAndSelect('companyDistrict.promotions', 'promotions')
      .innerJoin('companyDistrict.company', 'company')
      .where('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere(
        'companyDistrict.companyDistrictStatus = :companyDistrictStatus',
        { companyDistrictStatus: APPROVAL_STATUS.APPROVAL },
      )
      .andWhere('companyDistrict.region1DepthName like :region1DepthName', {
        region1DepthName: `${nanudaDeliverySpaceFindDistrictOrCityDto.locationType}%`,
      })
      .andWhere('deliverySpace.remainingCount > 0')
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .andWhere('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .orderBy('deliverySpace.monthlyRentFee', ORDER_BY_VALUE.DESC)
      .getMany();

    // push district object
    await Promise.all(
      qb.map(q => {
        districtNamesAndCode.push({
          districtName: q.companyDistrict.region2DepthName,
          hdongCode: q.companyDistrict.hCode,
        });
      }),
    );
    // check if the number of districts is lower than three
    if (districtNamesAndCode.length < 3) {
      return qb;
    } else {
      districtNamesAndCode.unshift({ directSpace: YN.NO });
    }
    return RemoveDuplicateObject(districtNamesAndCode, 'districtName');
  }

  /**
   * create new track
   * @param nanudaTrackTraceDto
   */
  async trackTraceToSpaceCategory(nanudaTrackTraceDto: NanudaCreateTrackDto) {
    let track = new TrackTraceToSpaceCategory(nanudaTrackTraceDto);
    track = await this.entityManager
      .getRepository(TrackTraceToSpaceCategory)
      .save(track);
  }
}
