import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService, FOUNDER_CONSULT } from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { DeliverySpace } from './delivery-space.entity';
import { Repository, EntityManager } from 'typeorm';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { DeliveryFounderConsultContract } from '../delivery-founder-consult-contract/delivery-founder-consult-contract.entity';
import { DeliverySpaceAmenityMapper } from '../delivery-space-amenity-mapper/delivery-space-amenity-mapper.entity';
import { DeliverySpaceDeliveryOptionMapper } from '../delivery-space-delivery-option-mapper/delivery-space-delivery-option-mapper.entity';
import { DeliverySpaceBrandMapper } from '../delivery-space-brand-mapper/delivery-space-brand-mapper.entity';
import { DeliveryFounderConsultContractHistory } from '../delivery-founder-consult-contract-history/delivery-founder-consult-contract-history.entity';
import { DeliverySpaceListDto } from './dto';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { FavoriteSpaceMapper } from '../favorite-space-mapper/favorite-space-mapper.entity';

@Injectable()
export class NanudaDeliverySpaceService extends BaseService {
  constructor(
    @InjectRepository(DeliverySpace)
    private readonly deliverySpaceRepo: Repository<DeliverySpace>,
    @InjectRepository(CompanyDistrict)
    private readonly companyDistrictRepo: Repository<CompanyDistrict>,
    @InjectRepository(DeliveryFounderConsultContract)
    private readonly duplicateCheckRepo: Repository<
      DeliveryFounderConsultContract
    >,
    @InjectRepository(DeliverySpaceAmenityMapper)
    private readonly amenityMapperRepo: Repository<DeliverySpaceAmenityMapper>,
    @InjectRepository(DeliverySpaceDeliveryOptionMapper)
    private deliveryOptionMapperRepo: Repository<
      DeliverySpaceDeliveryOptionMapper
    >,
    @InjectRepository(DeliverySpaceBrandMapper)
    private readonly deliveryBrandMapper: Repository<DeliverySpaceBrandMapper>,
    @InjectRepository(DeliveryFounderConsultContractHistory)
    private readonly deliveryFounderConsultContractHistoryRepo: Repository<
      DeliveryFounderConsultContractHistory
    >,
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
        'deliveryFounderConsults',
        'favoritedUsers',
      ])
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      //   .andWhere('deliveryFounderConsults.status != :status', {
      //     status: FOUNDER_CONSULT.F_DIST_COMPLETE,
      //   })
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
      .WhereAndOrder(deliverySpaceListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    // add favorite mark
    await Promise.all(
      items.map(item => {
        item.likedCount = item.favoritedUsers.length;
        delete item.favoritedUsers;
      }),
    );

    // 사용자 로그인 시 본인 라이크 볼 수 있게
    if (nanudaUserNo) {
      await Promise.all(
        items.map(async item => {
          const liked = await this.faveMapperRepo.findOne({
            nanudaUserNo: nanudaUserNo,
            deliverySpaceNo: item.no,
          });
          if (liked) {
            item.likedYn = true;
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
    const consult = await this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .CustomLeftJoinAndSelect(['amenities', 'deliverySpaceOptions'])
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('deliverySpace.no = :no', { no: deliverySpaceNo })
      .andWhere('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .getOne();
    if (!consult) {
      throw new NotFoundException();
    }
    const likedCount = await this.faveMapperRepo.find({
      deliverySpaceNo: deliverySpaceNo,
    });
    consult.likedCount = likedCount.length;
    if (nanudaUserNo) {
      const liked = await this.faveMapperRepo.findOne({
        nanudaUserNo: nanudaUserNo,
        deliverySpaceNo: deliverySpaceNo,
      });
      if (liked) {
        consult.likedYn = true;
      }
    }
    return consult;
  }
}
