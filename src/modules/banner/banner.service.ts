import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './banner.entity';
import { Repository } from 'typeorm';
import {
  AdminBannerCreateDto,
  AdminBannerListDto,
  AdminBannerUpdateDto,
} from './dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { PaginatedRequest, PaginatedResponse } from 'src/common';

@Injectable()
export class BannerService extends BaseService {
  constructor(
    @InjectRepository(Banner) private readonly bannerRepo: Repository<Banner>,
    private readonly fileUploadService: FileUploadService,
  ) {
    super();
  }

  /**
   * create banner by admin
   * @param adminNo
   * @param adminBannerCreateDto
   */
  async createBanner(
    adminNo: number,
    adminBannerCreateDto: AdminBannerCreateDto,
  ): Promise<Banner> {
    let banner = new Banner(adminBannerCreateDto);
    banner.adminNo = adminNo;
    // image
    if (adminBannerCreateDto.image && adminBannerCreateDto.image.length > 1) {
      throw new BadRequestException({
        message: 'Can only upload one image!',
        error: 400,
      });
    }
    if (adminBannerCreateDto.image && adminBannerCreateDto.image.length === 1) {
      adminBannerCreateDto.image = await this.fileUploadService.moveS3File(
        adminBannerCreateDto.image,
      );
      if (!adminBannerCreateDto.image) {
        throw new BadRequestException({
          message: 'Upload failed!',
          error: 400,
        });
      }
    }
    // mobile image
    if (
      adminBannerCreateDto.mobileImage &&
      adminBannerCreateDto.mobileImage.length > 1
    ) {
      throw new BadRequestException({
        message: 'Can only upload one image!',
        error: 400,
      });
    }
    if (
      adminBannerCreateDto.mobileImage &&
      adminBannerCreateDto.mobileImage.length === 1
    ) {
      adminBannerCreateDto.mobileImage = await this.fileUploadService.moveS3File(
        adminBannerCreateDto.mobileImage,
      );
      if (!adminBannerCreateDto.mobileImage) {
        throw new BadRequestException({
          message: 'Upload failed! (Mobile image)',
          error: 400,
        });
      }
    }
    if (adminBannerCreateDto.ended && !adminBannerCreateDto.started) {
      adminBannerCreateDto.started = new Date();
    }
    banner = await this.bannerRepo.save(banner);
    return banner;
  }

  /**
   * find all for admin
   * @param adminBannerListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminBannerListDto: AdminBannerListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Banner>> {
    const qb = this.bannerRepo
      .createQueryBuilder('banner')
      .CustomInnerJoinAndSelect(['codeManagement'])
      .CustomLeftJoinAndSelect(['admin'])
      .AndWhereLike(
        'admin',
        'name',
        adminBannerListDto.adminName,
        adminBannerListDto.exclude('adminName'),
      )
      .AndWhereEqual(
        'admin',
        'no',
        adminBannerListDto.adminNo,
        adminBannerListDto.exclude('adminNo'),
      )
      .AndWhereLike(
        'admin',
        'phone',
        adminBannerListDto.adminPhone,
        adminBannerListDto.exclude('adminPhone'),
      )
      .AndWhereLike(
        'banner',
        'title',
        adminBannerListDto.title,
        adminBannerListDto.exclude('title'),
      )
      .AndWhereLike(
        'banner',
        'url',
        adminBannerListDto.url,
        adminBannerListDto.exclude('url'),
      )
      .WhereAndOrder(adminBannerListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find one for admin
   * @param bannerNo
   */
  async findOneForAdmin(bannerNo: number): Promise<Banner> {
    const banner = await this.bannerRepo
      .createQueryBuilder('banner')
      .CustomInnerJoinAndSelect(['codeManagement'])
      .CustomLeftJoinAndSelect(['admin'])
      .where('banner.no = :no', { no: bannerNo })
      .getOne();

    return banner;
  }

  /**
   * update for admin
   * @param bannerNo
   * @param adminNo
   * @param adminBannerUpdateDto
   */
  async updateBanner(
    bannerNo: number,
    adminNo: number,
    adminBannerUpdateDto: AdminBannerUpdateDto,
  ): Promise<Banner> {
    let banner = await this.findOneForAdmin(bannerNo);
    banner.adminNo = adminNo;
    banner = banner.set(adminBannerUpdateDto);
    if (adminBannerUpdateDto.image && adminBannerUpdateDto.image.length > 1) {
      throw new BadRequestException({
        message: 'Can only upload one image!',
        error: 400,
      });
    }
    if (adminBannerUpdateDto.image && adminBannerUpdateDto.image.length === 1) {
      adminBannerUpdateDto.image = await this.fileUploadService.moveS3File(
        adminBannerUpdateDto.image,
      );
      if (!adminBannerUpdateDto.image) {
        throw new BadRequestException({
          message: 'Upload failed!',
          error: 400,
        });
      }
    }
    // mobile image
    if (
      adminBannerUpdateDto.mobileImage &&
      adminBannerUpdateDto.mobileImage.length > 1
    ) {
      throw new BadRequestException({
        message: 'Can only upload one image!',
        error: 400,
      });
    }
    if (
      adminBannerUpdateDto.mobileImage &&
      adminBannerUpdateDto.mobileImage.length === 1
    ) {
      adminBannerUpdateDto.mobileImage = await this.fileUploadService.moveS3File(
        adminBannerUpdateDto.mobileImage,
      );
      if (!adminBannerUpdateDto.mobileImage) {
        throw new BadRequestException({
          message: 'Upload failed! (Mobile image)',
          error: 400,
        });
      }
    }
    if (adminBannerUpdateDto.ended && !adminBannerUpdateDto.started) {
      adminBannerUpdateDto.started = new Date();
    }
    banner = await this.bannerRepo.save(banner);
    return banner;
  }

  /**
   * delete banner
   * @param bannerNo
   */
  async deleteBanner(bannerNo: number) {
    await this.bannerRepo
      .createQueryBuilder()
      .delete()
      .from(Banner)
      .where('no = :no', { no: bannerNo })
      .execute();
  }
}
