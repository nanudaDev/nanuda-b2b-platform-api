import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseService } from 'src/core';
import {
  FavoriteSpaceMapperCreateDto,
  NanudaFavoriteSpaceMapperListDto,
} from './dto';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { FavoriteSpaceMapper } from './favorite-space-mapper.entity';
import { Repository, EntityManager } from 'typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';

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
    // const check = await this.favoriteSpaceMapperRepo.find({
    //   where: favoriteSpaceMapperCreateDto,
    // });
    // if (check) {
    //   throw new BadRequestException({ message: 'Already liked!' });
    // }
    let newFavoriteSpace = new FavoriteSpaceMapper(
      favoriteSpaceMapperCreateDto,
    );
    newFavoriteSpace = await this.favoriteSpaceMapperRepo.save(
      newFavoriteSpace,
    );
    return newFavoriteSpace;
  }

  /**
   * delete from mapper
   * @param favoriteSpaceMapperNo
   */
  async deleteFavorite(deliverySpaceNo: number, nanudaUserNo: number) {
    await this.entityManager.transaction(async entityManager => {
      console.log(deliverySpaceNo);
      const check = await this.favoriteSpaceMapperRepo.findOne({
        deliverySpaceNo: deliverySpaceNo,
        nanudaUserNo: nanudaUserNo,
      });
      console.log(check);
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
        .execute();

      return true;
    });
    return true;
  }

  /**
   * find all favorite for nanuda user
   * @param nanudaUserNo
   * @param nanudaFavoriteSpaceMapperListDto
   * @param pagination
   */
  async findFavoritedSpace(
    nanudaFavoriteSpaceMapperListDto: NanudaFavoriteSpaceMapperListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<FavoriteSpaceMapper>> {
    const nanudaUserNo = nanudaFavoriteSpaceMapperListDto.nanudaUserNo;
    delete nanudaFavoriteSpaceMapperListDto.nanudaUserNo;
    const qb = this.favoriteSpaceMapperRepo
      .createQueryBuilder('favorite')
      .CustomInnerJoinAndSelect(['deliverySpace'])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .where('favorite.nanudaUserNo = :no', {
        no: nanudaUserNo,
      })
      .WhereAndOrder(nanudaFavoriteSpaceMapperListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }
}
