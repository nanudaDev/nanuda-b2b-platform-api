import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseService } from 'src/core';
import { FavoriteSpaceMapperCreateDto } from './dto';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { FavoriteSpaceMapper } from './favorite-space-mapper.entity';
import { Repository, EntityManager } from 'typeorm';

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
  async deleteFavorite(favoriteSpaceMapperNo: number, nanudaUserNo?: number) {
    await this.entityManager.transaction(async entityManager => {
      console.log(favoriteSpaceMapperNo);
      const check = await this.favoriteSpaceMapperRepo.findOne({
        no: favoriteSpaceMapperNo,
      });
      console.log(check);
      if (!check) {
        throw new BadRequestException({ message: 'Nothing to delete!' });
      }
      await entityManager
        .createQueryBuilder()
        .delete()
        .from(FavoriteSpaceMapper)
        .where('no = :no', { no: favoriteSpaceMapperNo })
        .execute();

      return true;
    });
    return true;
  }
}
