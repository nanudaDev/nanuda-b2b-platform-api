import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { Banner } from './banner.entity';
import { NanudaBannerListDto } from './dto';

@Injectable()
export class NanudaBannerService extends BaseService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepo: Repository<Banner>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * find all for nanuda user
   * @param nanudaBannerListDto
   * @param pagination
   */
  async findAllForNanudaUser(
    nanudaBannerListDto: NanudaBannerListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<Banner>> {
    const qb = this.bannerRepo
      .createQueryBuilder('banner')
      .AndWhereLike(
        'banner',
        'title',
        nanudaBannerListDto.title,
        nanudaBannerListDto.exclude('title'),
      )
      .where('banner.showYn = :showYn', { showYn: YN.YES })
      .AndWhereBetweenDate(new Date())
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one for nanuda user
   * @param bannerNo
   */
  async findOneForNanudaUser(bannerNo: number): Promise<Banner> {
    const banner = await this.bannerRepo
      .createQueryBuilder('banner')
      .CustomInnerJoinAndSelect(['codeManagement'])
      .where('banner.showYn = :showYn', { showYn: YN.YES })
      .AndWhereBetweenDate(new Date())
      .andWhere('banner.no = :no', { no: bannerNo })
      .getOne();

    if (!banner) {
      throw new NotFoundException();
    }
    return banner;
  }
}
