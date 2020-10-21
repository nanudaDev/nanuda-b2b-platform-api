import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
import { AdminPopupCreateDto, AdminPopupListDto } from './dto';
import { Popup } from './popup.entity';

@Injectable()
export class PopupService extends BaseService {
  constructor(
    @InjectRepository(Popup) private readonly popupRepo: Repository<Popup>,
    private readonly fileUploadService: FileUploadService,
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

  /**
   * find one for admin
   * @param popupNo
   */
  async findOne(popupNo: number): Promise<Popup> {
    const popup = await this.popupRepo
      .createQueryBuilder('popup')
      .where('popup.no = :no', { no: popupNo })
      .getOne();

    return popup;
  }

  /**
   * create new popup
   * @param adminPopupCreateDto
   */
  async createForAdmin(
    adminPopupCreateDto: AdminPopupCreateDto,
  ): Promise<Popup> {
    let newPopup = new Popup(adminPopupCreateDto);
    if (newPopup.images && newPopup.images.length > 0) {
      newPopup.images = await this.fileUploadService.moveS3File(
        newPopup.images,
      );
      if (!newPopup.images) {
        throw new BadRequestException({ message: 'Upload failed!' });
      }
    }
    newPopup = await this.popupRepo.save(newPopup);
    return newPopup;
  }
}
