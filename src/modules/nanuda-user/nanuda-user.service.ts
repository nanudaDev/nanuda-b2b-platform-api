import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import {
  AdminNanudaUserCreateDto,
  AdminNanudaUserListDto,
  AdminNanudaUserUpdateDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { NanudaUser } from './nanuda-user.entity';
import { DeliveryFounderConsult } from '../delivery-founder-consult/delivery-founder-consult.entity';
import { FounderConsult } from '../founder-consult/founder-consult.entity';
import { ProductConsult } from '../product-consult/product-consult.entity';
import { FavoriteSpaceMapper } from '../favorite-space-mapper/favorite-space-mapper.entity';

@Injectable()
export class NanudaUserService extends BaseService {
  constructor(
    @InjectRepository(NanudaUser)
    private readonly nanudaUserRepo: Repository<NanudaUser>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * create for admin
   * @param adminNanudaUserCreateDto
   */
  async createForAdmin(
    adminNanudaUserCreateDto: AdminNanudaUserCreateDto,
  ): Promise<NanudaUser> {
    if (
      adminNanudaUserCreateDto.phone &&
      adminNanudaUserCreateDto.phone.includes('-')
    ) {
      adminNanudaUserCreateDto.phone = adminNanudaUserCreateDto.phone.replace(
        /-/g,
        '',
      );
    }
    const checkUser = await this.nanudaUserRepo.findOne({
      where: { phone: adminNanudaUserCreateDto.phone },
    });
    if (checkUser) {
      throw new BadRequestException({ message: 'Already Exists!' });
    }
    let nanudaUser = new NanudaUser(adminNanudaUserCreateDto);
    nanudaUser = await this.nanudaUserRepo.save(nanudaUser);
    return nanudaUser;
  }

  /**
   * delete nanuda user
   * @param nanudaUserNo
   */
  async deleteForAdmin(nanudaUserNo: number) {
    await this.entityManager.transaction(async entityManager => {
      // delete consults
      await entityManager
        .createQueryBuilder()
        .delete()
        .from(DeliveryFounderConsult)
        .where('nanudaUserNo = :nanudaUserNo', { nanudaUserNo: nanudaUserNo })
        .execute();

      await entityManager
        .createQueryBuilder()
        .delete()
        .from(FounderConsult)
        .where('nanudaUserNo = :nanudaUserNo', { nanudaUserNo: nanudaUserNo })
        .execute();

      await entityManager
        .createQueryBuilder()
        .delete()
        .from(ProductConsult)
        .where('nanudaUserNo = :nanudaUserNo', { nanudaUserNo: nanudaUserNo })
        .execute();

      // TODO: delete space as well?

      await entityManager
        .createQueryBuilder()
        .delete()
        .from(FavoriteSpaceMapper)
        .where('nanudaUserNo = :nanudaUserNo', { nanudaUserNo: nanudaUserNo })
        .execute();

      // delete user
      await entityManager
        .createQueryBuilder()
        .delete()
        .from(NanudaUser)
        .where('no = :no', { no: nanudaUserNo })
        .execute();
    });
  }

  /**
   * update for admin
   * @param nanudaUserNo
   * @param adminNanudaUserUpdateDto
   */
  async updateForAdmin(
    nanudaUserNo: number,
    adminNanudaUserUpdateDto: AdminNanudaUserUpdateDto,
  ): Promise<NanudaUser> {
    let nanudaUser = await this.nanudaUserRepo.findOne(nanudaUserNo);
    nanudaUser = nanudaUser.set(adminNanudaUserUpdateDto);
    nanudaUser = await this.nanudaUserRepo.save(nanudaUser);
    return nanudaUser;
  }

  /**
   * find all for admin
   * @param adminNanudaUserListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminNanudaUserListDto: AdminNanudaUserListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<NanudaUser>> {
    if (
      adminNanudaUserListDto.phone &&
      adminNanudaUserListDto.phone.includes('-')
    ) {
      adminNanudaUserListDto.phone = adminNanudaUserListDto.phone.replace(
        /-/g,
        '',
      );
    }
    const qb = this.nanudaUserRepo
      .createQueryBuilder('nanudaUser')
      .AndWhereLike(
        'nanudaUser',
        'name',
        adminNanudaUserListDto.name,
        adminNanudaUserListDto.exclude('name'),
      )
      .AndWhereLike(
        'nanudaUser',
        'phone',
        adminNanudaUserListDto.phone,
        adminNanudaUserListDto.exclude('phone'),
      )
      .WhereAndOrder(adminNanudaUserListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find one
   * @param nanudaUserNo
   */
  async findOneForAdmin(nanudaUserNo: number): Promise<NanudaUser> {
    return await this.nanudaUserRepo.findOne(nanudaUserNo);
  }
}
