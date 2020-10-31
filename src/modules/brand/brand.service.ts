import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/core';
import {
  AdminBrandCreateDto,
  AdminBrandListDto,
  AdminBrandUpdateDto,
} from './dto';
import { Brand } from './brand.entity';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { DeliverySpaceBrandMapper } from '../delivery-space-brand-mapper/delivery-space-brand-mapper.entity';
import { SpaceNanudaBrand } from '../space-nanuda-brand/space-nanuda-brand.entity';
import { SpaceTypeBrandMapper } from '../space-type-brand-mapper/space-type-brand-mapper.entity';
import { BrandKioskMapper } from '../brand-kiosk-mapper/brand-kiosk-mapper.entity';

@Injectable()
export class BrandService extends BaseService {
  constructor(
    @InjectRepository(Brand) private readonly brandRepo: Repository<Brand>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly fileUploadService: FileUploadService,
  ) {
    super();
  }

  //admin

  /**
   * create new brand for admin
   * @param adminNo
   * @param adminBrandCreateDto
   */
  async createByAdmin(
    adminNo: number,
    adminBrandCreateDto: AdminBrandCreateDto,
  ): Promise<Brand> {
    let brand = new Brand(adminBrandCreateDto);
    brand.adminNo = adminNo;
    brand.name = adminBrandCreateDto.nameKr;
    const check = await this.brandRepo.findOne({
      nameKr: adminBrandCreateDto.nameKr,
    });
    if (check) {
      throw new BadRequestException({ message: 'Brand already exists.' });
    }
    if (adminBrandCreateDto.logo && adminBrandCreateDto.logo.length > 0) {
      adminBrandCreateDto.logo = await this.fileUploadService.moveS3File(
        adminBrandCreateDto.logo,
      );
      if (!adminBrandCreateDto.logo) {
        throw new BadRequestException({
          message: 'Upload Failed!',
        });
      }
    }
    if (
      adminBrandCreateDto.mainMenuImage &&
      adminBrandCreateDto.mainMenuImage.length > 0
    ) {
      adminBrandCreateDto.mainMenuImage = await this.fileUploadService.moveS3File(
        adminBrandCreateDto.mainMenuImage,
      );
      if (!adminBrandCreateDto.mainMenuImage) {
        throw new BadRequestException({
          message: 'Upload Failed! (main menu image)',
        });
      }
    }

    if (
      adminBrandCreateDto.mainBanner &&
      adminBrandCreateDto.mainBanner.length > 0
    ) {
      adminBrandCreateDto.mainBanner = await this.fileUploadService.moveS3File(
        adminBrandCreateDto.mainBanner,
      );
      if (!adminBrandCreateDto.mainBanner) {
        throw new BadRequestException({
          message: 'Upload Failed! (main banner image)',
        });
      }
    }

    if (
      adminBrandCreateDto.sideBanner &&
      adminBrandCreateDto.sideBanner.length > 0
    ) {
      adminBrandCreateDto.sideBanner = await this.fileUploadService.moveS3File(
        adminBrandCreateDto.sideBanner,
      );
      if (!adminBrandCreateDto.sideBanner) {
        throw new BadRequestException({
          message: 'Upload Failed! (side banner image)',
        });
      }
    }

    if (
      adminBrandCreateDto.mobileSideBanner &&
      adminBrandCreateDto.mobileSideBanner.length > 0
    ) {
      adminBrandCreateDto.mobileSideBanner = await this.fileUploadService.moveS3File(
        adminBrandCreateDto.mobileSideBanner,
      );
      if (!adminBrandCreateDto.mobileSideBanner) {
        throw new BadRequestException({
          message: 'Upload Failed! (mobile side banner image)',
        });
      }
    }

    brand = await this.brandRepo.save(brand);
    if (
      adminBrandCreateDto.brandKioskMapperNos &&
      adminBrandCreateDto.brandKioskMapperNos.length > 0
    ) {
      await Promise.all(
        adminBrandCreateDto.brandKioskMapperNos.map(
          async brandKioskMapperNo => {
            let brandKioskMapper = new BrandKioskMapper();
            brandKioskMapper.brandNo = brand.no;
            brandKioskMapper.kioskNo = brandKioskMapperNo;
            await this.entityManager
              .getRepository(BrandKioskMapper)
              .save(brandKioskMapper);
          },
        ),
      );
    }
    return brand;
  }

  /**
   * find all for admin
   * @param adminBrandListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminBrandListDto: AdminBrandListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Brand>> {
    const qb = this.brandRepo
      .createQueryBuilder('brand')
      .CustomLeftJoinAndSelect([
        'admin',
        'category',
        'costValue',
        'storeCountValue',
        'difficultyValue',
      ])
      .AndWhereLike(
        'brand',
        'nameKr',
        adminBrandListDto.nameKr,
        adminBrandListDto.exclude('nameKr'),
      )
      .AndWhereLike(
        'brand',
        'nameEng',
        adminBrandListDto.nameEng,
        adminBrandListDto.exclude('nameEng'),
      )
      .AndWhereLike(
        'brand',
        'urlPath',
        adminBrandListDto.urlPath,
        adminBrandListDto.exclude('urlPath'),
      )
      .AndWhereLike(
        'category',
        'nameKr',
        adminBrandListDto.categoryName,
        adminBrandListDto.exclude('categoryName'),
      )
      .AndWhereEqual(
        'category',
        'no',
        adminBrandListDto.categoryNo,
        adminBrandListDto.exclude('categoryNo'),
      )
      .AndWhereLike(
        'admin',
        'name',
        adminBrandListDto.adminName,
        adminBrandListDto.exclude('adminName'),
      )
      .AndWhereEqual(
        'admin',
        'no',
        adminBrandListDto.adminNo,
        adminBrandListDto.exclude('adminNo'),
      )
      .WhereAndOrder(adminBrandListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find one
   * @param brandNo
   */
  async findOne(brandNo: number): Promise<Brand> {
    let qb = await this.brandRepo
      .createQueryBuilder('brand')
      .CustomLeftJoinAndSelect([
        'admin',
        'category',
        'costValue',
        'storeCountValue',
        'difficultyValue',
      ])
      .where('brand.no = :no', { no: brandNo })
      .getOne();

    if (!qb) {
      throw new NotFoundException();
    }
    const spaceTypeBrandMapper = await this.entityManager
      .getRepository(SpaceTypeBrandMapper)
      .findOne({ brandNo: brandNo });
    if (spaceTypeBrandMapper) {
      qb.spaceTypeNo = spaceTypeBrandMapper.spaceTypeNo;
    }
    return qb;
  }

  /**
   * update brand
   * @param brandNo
   * @param adminBrandUpdateDto
   * @param adminNo
   */
  async updateForAdmin(
    brandNo: number,
    adminBrandUpdateDto: AdminBrandUpdateDto,
    adminNo: number,
  ): Promise<Brand> {
    console.log(adminBrandUpdateDto);
    const brand = await this.entityManager.transaction(async entityManager => {
      let brand = await this.brandRepo.findOne(brandNo);
      if (adminBrandUpdateDto.logo && adminBrandUpdateDto.logo.length > 0) {
        adminBrandUpdateDto.logo = await this.fileUploadService.moveS3File(
          adminBrandUpdateDto.logo,
        );
        if (!adminBrandUpdateDto.logo) {
          throw new BadRequestException({ message: 'Upload Failed!' });
        }
      }
      if (
        adminBrandUpdateDto.mainMenuImage &&
        adminBrandUpdateDto.mainMenuImage.length > 0
      ) {
        adminBrandUpdateDto.mainMenuImage = await this.fileUploadService.moveS3File(
          adminBrandUpdateDto.mainMenuImage,
        );
        if (!adminBrandUpdateDto.mainMenuImage) {
          throw new BadRequestException({
            message: 'Upload Failed! (main menu image)',
          });
        }
      }

      if (
        adminBrandUpdateDto.mainBanner &&
        adminBrandUpdateDto.mainBanner.length > 0
      ) {
        adminBrandUpdateDto.mainBanner = await this.fileUploadService.moveS3File(
          adminBrandUpdateDto.mainBanner,
        );
        if (!adminBrandUpdateDto.mainBanner) {
          throw new BadRequestException({
            message: 'Upload Failed! (main banner image)',
          });
        }
      }

      if (
        adminBrandUpdateDto.sideBanner &&
        adminBrandUpdateDto.sideBanner.length > 0
      ) {
        adminBrandUpdateDto.sideBanner = await this.fileUploadService.moveS3File(
          adminBrandUpdateDto.sideBanner,
        );
        if (!adminBrandUpdateDto.sideBanner) {
          throw new BadRequestException({
            message: 'Upload Failed! (side banner image)',
          });
        }
      }

      if (
        adminBrandUpdateDto.mobileSideBanner &&
        adminBrandUpdateDto.mobileSideBanner.length > 0
      ) {
        adminBrandUpdateDto.mobileSideBanner = await this.fileUploadService.moveS3File(
          adminBrandUpdateDto.mobileSideBanner,
        );
        if (!adminBrandUpdateDto.mobileSideBanner) {
          throw new BadRequestException({
            message: 'Upload Failed! (mobile side banner image)',
          });
        }
      }

      brand = brand.set(adminBrandUpdateDto);
      brand.adminNo = adminNo;
      brand = await entityManager.save(brand);
      const isMapped = await entityManager
        .getRepository(SpaceTypeBrandMapper)
        .findOne({ brandNo: brandNo });
      if (adminBrandUpdateDto.spaceTypeNo && !isMapped) {
        let spaceTypeBrandMapper = new SpaceTypeBrandMapper();
        spaceTypeBrandMapper.spaceTypeNo = adminBrandUpdateDto.spaceTypeNo;
        spaceTypeBrandMapper.brandNo = brand.no;
        spaceTypeBrandMapper.brandName = brand.nameKr;
        spaceTypeBrandMapper = await entityManager.save(spaceTypeBrandMapper);
      }
      if (
        adminBrandUpdateDto.brandKioskMapperNos &&
        adminBrandUpdateDto.brandKioskMapperNos.length > 0
      ) {
        // delete first
        await this.entityManager
          .getRepository(BrandKioskMapper)
          .createQueryBuilder()
          .delete()
          .from(BrandKioskMapper)
          .where('brandNo = :brandNo', { brandNo: brandNo })
          .execute();

        // create new mapper
        await Promise.all(
          adminBrandUpdateDto.brandKioskMapperNos.map(
            async brandKioskMappNo => {
              let brandKioskMapper = new BrandKioskMapper();
              brandKioskMapper.brandNo = brandNo;
              brandKioskMapper.kioskNo = brandKioskMappNo;
              brandKioskMapper = await this.entityManager
                .getRepository(BrandKioskMapper)
                .save(brandKioskMapper);
            },
          ),
        );
      }
      return brand;
    });
    return brand;
  }

  /**
   * delete brand
   * @param brandNo
   */
  async deleteBrand(brandNo: number) {
    await this.entityManager.transaction(async entityManager => {
      await entityManager
        .createQueryBuilder()
        .delete()
        .from(Brand)
        .where('no = :no', { no: brandNo })
        .execute();

      // delete mapper
      await entityManager
        .createQueryBuilder()
        .delete()
        .from(DeliverySpaceBrandMapper)
        .where('brandNo = :brandNo', { brandNo: brandNo })
        .execute();

      await entityManager
        .createQueryBuilder()
        .delete()
        .from(SpaceNanudaBrand)
        .where('brandNo = :brandNo', { brandNo: brandNo })
        .execute();
    });
  }

  /**
   * find all
   */
  async findAll() {
    return await this.brandRepo.find({ where: { showYn: YN.YES } });
  }

  /**
   * find nanuda brand
   */
  async findNanudaBrand() {
    return await this.brandRepo.find({
      where: { delYn: YN.NO, isRecommendedYn: YN.YES },
    });
  }
}
