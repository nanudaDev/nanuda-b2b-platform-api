import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService, FOUNDER_CONSULT, APPROVAL_STATUS } from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { DeliverySpace } from './delivery-space.entity';
import { Repository, EntityManager, In } from 'typeorm';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { DeliveryFounderConsultContract } from '../delivery-founder-consult-contract/delivery-founder-consult-contract.entity';
import { DeliverySpaceAmenityMapper } from '../delivery-space-amenity-mapper/delivery-space-amenity-mapper.entity';
import { DeliverySpaceDeliveryOptionMapper } from '../delivery-space-delivery-option-mapper/delivery-space-delivery-option-mapper.entity';
import { DeliverySpaceBrandMapper } from '../delivery-space-brand-mapper/delivery-space-brand-mapper.entity';
import { DeliveryFounderConsultContractHistory } from '../delivery-founder-consult-contract-history/delivery-founder-consult-contract-history.entity';
import { DeliverySpaceListDto } from './dto';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { FavoriteSpaceMapper } from '../favorite-space-mapper/favorite-space-mapper.entity';
import { DeliveryFounderConsult } from '../delivery-founder-consult/delivery-founder-consult.entity';

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
        'amenities',
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
      .AndWhereLike(
        'amenities',
        'amenityName',
        deliverySpaceListDto.amenityName,
        deliverySpaceListDto.exclude('amenityName'),
      )
      .AndWhereLike(
        'deliverySpaceOptions',
        'deliverySpaceOptionName',
        deliverySpaceListDto.deliverySpaceOptionName,
        deliverySpaceListDto.exclude('deliverySpaceOptions'),
      )
      .AndWhereLike(
        'deliverySpace',
        'monthlyRentFee',
        deliverySpaceListDto.monthlyRentFee,
        deliverySpaceListDto.exclude('monthlyRentFee'),
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
      .WhereAndOrder(deliverySpaceListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
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
        item.remainingCount = item.quantity - item.contracts.length;
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
          } else {
            item.likedYn = false;
          }
        }),
      );
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
    console.log(deliverySpaceNo);
    const consult = await this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .CustomLeftJoinAndSelect([
        'amenities',
        'deliverySpaceOptions',
        'contracts',
        'brands',
      ])
      .leftJoinAndSelect('companyDistrict.amenities', 'commonAmenities')
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('deliverySpace.no = :no', { no: deliverySpaceNo })
      .andWhere('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .getOne();
    if (!consult) {
      throw new NotFoundException();
    }
    const likedCount = await this.entityManager
      .getRepository(FavoriteSpaceMapper)
      .find({ where: { deliverySpaceNo: deliverySpaceNo } });

    consult.likedCount = likedCount.length;

    const consults = await this.entityManager
      .getRepository(DeliveryFounderConsult)
      .find({
        where: {
          status: In([FOUNDER_CONSULT.F_NEW_REG, FOUNDER_CONSULT.F_PROCEEDING]),
          deliverySpaceNo: deliverySpaceNo,
        },
      });

    consult.consultCount = consults.length;
    if (nanudaUserNo) {
      const liked = await this.entityManager
        .getRepository(FavoriteSpaceMapper)
        .findOne({
          nanudaUserNo: nanudaUserNo,
          deliverySpaceNo: deliverySpaceNo,
        });
      if (liked) {
        consult.likedYn = true;
      } else {
        consult.likedYn = false;
      }
    }
    consult.remainingCount = consult.quantity - consult.contracts.length;
    delete consult.contracts;
    return consult;
  }
}
