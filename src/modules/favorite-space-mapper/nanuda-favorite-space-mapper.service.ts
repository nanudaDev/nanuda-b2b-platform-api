import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseService, SPACE_TYPE } from 'src/core';
import {
  FavoriteSpaceMapperCreateDto,
  NanudaFavoriteSpaceMapperListDto,
  NanudaFavoriteSpaceMapperDeleteDto,
} from './dto';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { FavoriteSpaceMapper } from './favorite-space-mapper.entity';
import { Repository, EntityManager } from 'typeorm';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';

@Injectable()
export class FavoriteSpaceMapperService extends BaseService {
  constructor(
    @InjectRepository(FavoriteSpaceMapper)
    private readonly favoriteSpaceMapperRepo: Repository<FavoriteSpaceMapper>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * like space
   * @param favoriteSpaceMapperCreateDto
   */
  async create(
    favoriteSpaceMapperCreateDto: FavoriteSpaceMapperCreateDto,
  ): Promise<FavoriteSpaceMapper> {
    const check = await this.favoriteSpaceMapperRepo.findOne({
      deliverySpaceNo: favoriteSpaceMapperCreateDto.deliverySpaceNo,
      nanudaUserNo: favoriteSpaceMapperCreateDto.nanudaUserNo,
      spaceTypeNo: favoriteSpaceMapperCreateDto.spaceType,
    });
    if (check) {
      throw new BadRequestException({ message: 'Already liked!' });
    }
    let newFavoriteSpace = new FavoriteSpaceMapper(
      favoriteSpaceMapperCreateDto,
    );
    newFavoriteSpace = await this.favoriteSpaceMapperRepo.save(
      newFavoriteSpace,
    );
    return newFavoriteSpace;
  }

  /**
   * single delete
   * delete from mapper
   * @param favoriteSpaceMapperNo
   */
  async deleteFavorite(
    deliverySpaceNo: number,
    nanudaUserNo: number,
    spaceTypeNo?: SPACE_TYPE,
  ) {
    await this.entityManager.transaction(async entityManager => {
      console.log(deliverySpaceNo);
      const check = await this.favoriteSpaceMapperRepo.findOne({
        deliverySpaceNo: deliverySpaceNo,
        nanudaUserNo: nanudaUserNo,
        spaceTypeNo: spaceTypeNo,
      });
      if (!check) {
        throw new BadRequestException({ message: 'Nothing to delete!' });
      }
      await entityManager
        .createQueryBuilder()
        .delete()
        .from(FavoriteSpaceMapper)
        .where('deliverySpaceNo = :deliverySpaceNo', {
          deliverySpaceNo: deliverySpaceNo,
        })
        .andWhere('nanudaUserNo = :nanudaUserNo', {
          nanudaUserNo: nanudaUserNo,
        })
        .andWhere('spaceTypeNo = :spaceTypeNo', { spaceTypeNo: spaceTypeNo })
        .execute();

      return true;
    });
    return true;
  }

  /**
   * delete array
   * @param nanudaFavoriteSpaceMapperDeleteDto
   */
  async deleteMultiple(
    nanudaFavoriteSpaceMapperDeleteDto: NanudaFavoriteSpaceMapperDeleteDto,
    nanudaUserNo,
  ) {
    // delete using primary key not delivery space
    if (
      nanudaFavoriteSpaceMapperDeleteDto.favoriteSpaceNos &&
      nanudaFavoriteSpaceMapperDeleteDto.favoriteSpaceNos.length > 0
    ) {
      const qb = await this.favoriteSpaceMapperRepo
        .createQueryBuilder()
        .delete()
        .from(FavoriteSpaceMapper)
        .where('no IN (:...nos)', {
          nos: nanudaFavoriteSpaceMapperDeleteDto.favoriteSpaceNos,
        })
        .andWhere('nanudaUserNo = :nanudaUserNo', {
          nanudaUserNo: nanudaUserNo,
        })
        .execute();
      return qb.affected;
    } else {
      throw new BadRequestException();
    }
  }

  /**
   * find all favorite for nanuda user
   * @param nanudaUserNo
   * @param nanudaFavoriteSpaceMapperListDto
   * @param pagination
   */
  async findFavoritedDeliverySpace(
    nanudaFavoriteSpaceMapperListDto: NanudaFavoriteSpaceMapperListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<FavoriteSpaceMapper>> {
    const nanudaUserNo = nanudaFavoriteSpaceMapperListDto.nanudaUserNo;
    delete nanudaFavoriteSpaceMapperListDto.nanudaUserNo;
    const qb = this.favoriteSpaceMapperRepo
      .createQueryBuilder('favorite')
      .CustomInnerJoinAndSelect(['deliverySpace'])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('favorite.nanudaUserNo = :no', {
        no: nanudaUserNo,
      })
      .andWhere('favorite.spaceTypeNo = :spaceTypeNo', {
        spaceTypeNo: SPACE_TYPE.ONLY_DELIVERY,
      })
      .WhereAndOrder(nanudaFavoriteSpaceMapperListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * 식당형 공간 찜
   * @param nanudaFavoriteSpaceMapperListDto
   * @param pagination
   */
  async findFavoriteRestaurantSpace(
    nanudaFavoriteSpaceMapperListDto: NanudaFavoriteSpaceMapperListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<FavoriteSpaceMapper>> {
    const nanudaUserNo = nanudaFavoriteSpaceMapperListDto.nanudaUserNo;
    delete nanudaFavoriteSpaceMapperListDto.nanudaUserNo;

    const qb = this.favoriteSpaceMapperRepo
      .createQueryBuilder('favorite')
      .CustomInnerJoinAndSelect(['space'])
      .leftJoinAndSelect('space.fileManagements', 'fileManagements')
      .where('favorite.nanudaUserNo = :no', {
        no: nanudaUserNo,
      })
      .andWhere('fileManagements.targetTable = :targetTable', {
        targetTable: 'SPACE',
      })
      .andWhere('favorite.spaceTypeNo = :spaceTypeNo', {
        spaceTypeNo: SPACE_TYPE.SPACE_SHARE,
      })
      .WhereAndOrder(nanudaFavoriteSpaceMapperListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  // 임시적으로 이렇게 해결하고 케이스2 네스트로 완전 이동해야함

  /**
   * check if restaurant kitchen is liked
   * @param nanudaUserNo
   * @param spaceNo
   */
  async checkForRestaurantKitchen(favoriteQuery) {
    const checkFavorite = await this.favoriteSpaceMapperRepo.findOne({
      nanudaUserNo: favoriteQuery.nanudaUserNo,
      deliverySpaceNo: favoriteQuery.deliverySpaceNo,
      spaceTypeNo: SPACE_TYPE.SPACE_SHARE,
    });
    if (!checkFavorite) {
      return YN.NO;
    } else {
      return YN.YES;
    }
  }

  /**
   * get count for restaurant kitchen
   * @param favoriteQuery
   */
  async checkCountForRestaurantKitchen(favoriteQuery) {
    console.log(favoriteQuery);
    const checkFavorite = await this.favoriteSpaceMapperRepo
      .createQueryBuilder('favoriteSpace')
      .where('favoriteSpace.deliverySpaceNo = :deliverySpaceNo', {
        deliverySpaceNo: favoriteQuery.deliverySpaceNo,
      })
      .andWhere('favoriteSpace.spaceTypeNo = :spaceTypeNo', {
        spaceTypeNo: SPACE_TYPE.SPACE_SHARE,
      })
      .getCount();
    return checkFavorite;
  }
}
