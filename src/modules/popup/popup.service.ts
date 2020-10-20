import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { AdminPopupListDto } from './dto';
import { Popup } from './popup.entity';

@Injectable()
export class PopupService extends BaseService {
  constructor(
    @InjectRepository(Popup) private readonly popupRepo: Repository<Popup>,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminPopupListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminPopupListDto: AdminPopupListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Popup>> {
    const qb = this.popupRepo
      .createQueryBuilder('popup')
      .AndWhereLike(
        'popup',
        'title',
        adminPopupListDto.title,
        adminPopupListDto.exclude('title'),
      )
      .AndWhereLike(
        'popup',
        'subTitle',
        adminPopupListDto.subTitle,
        adminPopupListDto.exclude('subTitle'),
      )
      .AndWhereLike(
        'popup',
        'link',
        adminPopupListDto.link,
        adminPopupListDto.exclude('link'),
      )
      .WhereAndOrder(adminPopupListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }
}
