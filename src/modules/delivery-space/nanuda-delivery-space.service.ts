import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService, FOUNDER_CONSULT, APPROVAL_STATUS } from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { DeliverySpace } from './delivery-space.entity';
import { Repository, EntityManager, In } from 'typeorm';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { DeliverySpaceListDto } from './dto';
import {
  ORDER_BY_VALUE,
  PaginatedRequest,
  PaginatedResponse,
  YN,
} from 'src/common';
import { FavoriteSpaceMapper } from '../favorite-space-mapper/favorite-space-mapper.entity';
import { DeliveryFounderConsult } from '../delivery-founder-consult/delivery-founder-consult.entity';
import { CompanyDistrictPromotionMapper } from '../company-district-promotion-mapper/company-district-promotion-mapper.entity';
import { CompanyDistrictPromotion } from '../company-district-promotion/company-district-promotion.entity';

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
  ): Promise<PaginatedResponse<DeliverySpace>> {
    // passing nanuda user token from old server
    // amenity ids length because of exclude dto
    console.log(pagination);
    let nanudaUserNo = null;
    if (deliverySpaceListDto.nanudaUserNo) {
      nanudaUserNo = deliverySpaceListDto.nanudaUserNo;
      nanudaUserNo = nanudaUserNo.nanudaUserNo;
      delete deliverySpaceListDto.nanudaUserNo;
    }
    const qb = this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .CustomLeftJoinAndSelect([
        'deliverySpaceOptions',
        'favoritedUsers',
        'contracts',
      ])
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
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
      // remaining count > 0
      .andWhere('deliverySpace.remainingCount > 0')
      .AndWhereBetweenValues(
        'deliverySpace',
        'size',
        deliverySpaceListDto.minSize,
        deliverySpaceListDto.maxSize,
        deliverySpaceListDto.exclude('minSize'),
        deliverySpaceListDto.exclude('maxSize'),
      )
      .AndWhereBetweenValues(
        'deliverySpace',
        'deposit',
        deliverySpaceListDto.minDeposit,
        deliverySpaceListDto.maxDeposit,
        deliverySpaceListDto.exclude('minDeposit'),
        deliverySpaceListDto.exclude('maxDeposit'),
      )
      .AndWhereBetweenValues(
        'deliverySpace',
        'monthlyRentFee',
        deliverySpaceListDto.minMonthlyRentFee,
        deliverySpaceListDto.maxMonthlyRentFee,
        deliverySpaceListDto.exclude('minMonthlyRentFee'),
        deliverySpaceListDto.exclude('maxMonthlyRentFee'),
      );
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
    if (
      deliverySpaceListDto.amenityIds &&
      deliverySpaceListDto.amenityIds.length > 0
    ) {
      const amenityIdsLength = deliverySpaceListDto.amenityIds.length;
      console.log(amenityIdsLength);
      qb.innerJoinAndSelect('deliverySpace.amenities', 'amenities');
      qb.AndWhereIn(
        'amenities',
        'no',
        deliverySpaceListDto.amenityIds,
        deliverySpaceListDto.exclude('amenityIds'),
      );
      qb.groupBy('deliverySpace.no');
      qb.having(`COUNT(DISTINCT amenities.NO) = ${amenityIdsLength}`);
    }
    if (deliverySpaceListDto.orderByDeposit) {
      console.log('test');
      qb.addOrderBy(
        'deliverySpace.deposit',
        deliverySpaceListDto.orderByDeposit,
      );
    }
    if (deliverySpaceListDto.orderByMonthlyRentFee) {
      console.log('test');
      qb.addOrderBy(
        'deliverySpace.monthlyRentFee',
        deliverySpaceListDto.orderByMonthlyRentFee,
      );
    }
    qb.Paginate(pagination);
    qb.WhereAndOrder(deliverySpaceListDto);

    let [items, totalCount] = await qb.getManyAndCount();
    // if(deliverySpaceListDto.amenityIds && deliverySpaceListDto.amenityIds.length > 1) {
    //   totalCount
    // }
    // add favorite mark
    await Promise.all(
      items.map(async item => {
        item.likedCount = item.favoritedUsers.length;
        delete item.favoritedUsers;
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
        // item.remainingCount = item.quantity - item.contracts.length;
        // // splice and remove unwanted delivery spaces
        // if (item.remainingCount === 0) {
        //   const index = items.indexOf(item);
        //   items.splice(index, 1);
        //   totalCount - 1;
        // }
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
    console.log(items.length);
    console.log(totalCount);
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
      .find({ where: { deliverySpaceNo: deliverySpaceNo } });

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

    let [items, totalCount] = await qb.getManyAndCount();

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
}
