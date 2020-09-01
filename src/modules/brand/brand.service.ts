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

@Injectable()
export class BrandService extends BaseService {
  constructor(
    @InjectRepository(Brand) private readonly brandRepo: Repository<Brand>,
    @InjectRepository(DeliverySpaceBrandMapper)
    private readonly deliverySpaceBrandMapperRepo: Repository<
      DeliverySpaceBrandMapper
    >,
    @InjectRepository(SpaceNanudaBrand)
    private readonly spaceBrandMapperRepo: Repository<SpaceNanudaBrand>,
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
    brand = await this.brandRepo.save(brand);
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
      .CustomLeftJoinAndSelect(['admin', 'category'])
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
    const qb = await this.brandRepo
      .createQueryBuilder('brand')
      .CustomLeftJoinAndSelect(['admin', 'category'])
      .where('brand.no = :no', { no: brandNo })
      .getOne();

    if (!qb) {
      throw new NotFoundException();
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
      brand = brand.set(adminBrandUpdateDto);
      brand.adminNo = adminNo;
      brand = await entityManager.save(brand);
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

  async findAll() {
    return await this.brandRepo.find({ where: { showYn: YN.YES } });
  }
}
