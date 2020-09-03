import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './banner.entity';
import { Repository } from 'typeorm';
import { AdminBannerCreateDto } from './dto';
import { FileUploadService } from '../file-upload/file-upload.service';

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
    if (adminBannerCreateDto.image && adminBannerCreateDto.image.length) {
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
      adminBannerCreateDto.mobileImage.length
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
}
