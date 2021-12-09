import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { Popup } from './popup.entity';
import { NanudaPopupListDto } from './dto';

@Injectable()
export class NanudaPopupService extends BaseService {
  constructor(
    @InjectRepository(Popup)
    private readonly popupRepo: Repository<Popup>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * find all for nanuda user
   * @param nanudaPopupListDto
   * @param pagination
   */
  async findAllForNanudaUser(
    nanudaPopupListDto: NanudaPopupListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<Popup>> {
    const qb = this.popupRepo
      .createQueryBuilder('popup')
      .AndWhereLike(
        'popup',
        'title',
        nanudaPopupListDto.title,
        nanudaPopupListDto.exclude('title'),
      )
      .where('popup.showYn = :showYn', { showYn: YN.YES })
      .AndWhereBetweenDate(new Date())
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one for nanuda user
   * @param popupNo
   */
  async findOneForNanudaUser(popupNo: number): Promise<Popup> {
    const popup = await this.popupRepo
      .createQueryBuilder('popup')
      .CustomInnerJoinAndSelect(['codeManagement'])
      .where('popup.showYn = :showYn', { showYn: YN.YES })
      .AndWhereBetweenDate(new Date())
      .andWhere('popup.no = :no', { no: popupNo })
      .getOne();

    if (!popup) {
      throw new NotFoundException();
    }
    return popup;
  }
}
