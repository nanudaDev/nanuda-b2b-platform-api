import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseService, SPACE_TYPE, SPACE_PIC_STATUS } from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { DeliverySpace } from './delivery-space.entity';
import { Repository, EntityManager } from 'typeorm';
import {
  AdminDeliverySpaceListDto,
  AdminDeliverySpaceCreateDto,
  DeliverySpaceCreateDto,
  DeliverySpaceListDto,
  AdminDeliverySpaceUpdateDto,
  DeliverySpaceUpdateDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { DeliverySpaceAmenityMapper } from '../delivery-space-amenity-mapper/delivery-space-amenity-mapper.entity';
import { DeliverySpaceDeliveryOptionMapper } from '../delivery-space-delivery-option-mapper/delivery-space-delivery-option-mapper.entity';
import { DeliveryFounderConsultContract } from '../delivery-founder-consult-contract/delivery-founder-consult-contract.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { DeliveryFounderConsultContractHistory } from '../delivery-founder-consult-contract-history/delivery-founder-consult-contract-history.entity';
import { NanudaSlackNotificationService } from 'src/core/utils';
import { DeliverySpaceBrandMapper } from '../delivery-space-brand-mapper/delivery-space-brand-mapper.entity';
import { BestSpaceMapper } from '../best-space/best-space.entity';
import { DeliverySpaceOptionSpaceMapper } from '../delivery-space-option-space-mapper/delivery-space-option-space-mapper.entity';
import { CompanyDistrictPromotionMapper } from '../company-district-promotion-mapper/company-district-promotion-mapper.entity';
import { CompanyDistrictPromotion } from '../company-district-promotion/company-district-promotion.entity';

@Injectable()
export class DeliverySpaceService extends BaseService {
  constructor(
    @InjectRepository(DeliverySpace)
    private readonly deliverySpaceRepo: Repository<DeliverySpace>,
    @InjectRepository(CompanyDistrict)
    private readonly companyDistrictRepo: Repository<CompanyDistrict>,
    @InjectRepository(DeliveryFounderConsultContract)
    private readonly duplicateCheckRepo: Repository<
      DeliveryFounderConsultContract
    >,
    @InjectRepository(DeliverySpaceAmenityMapper)
    private readonly amenityMapperRepo: Repository<DeliverySpaceAmenityMapper>,
    @InjectRepository(DeliverySpaceDeliveryOptionMapper)
    private deliveryOptionMapperRepo: Repository<
      DeliverySpaceDeliveryOptionMapper
    >,
    @InjectRepository(DeliverySpaceBrandMapper)
    private readonly deliveryBrandMapper: Repository<DeliverySpaceBrandMapper>,
    @InjectRepository(DeliveryFounderConsultContractHistory)
    private readonly deliveryFounderConsultContractHistoryRepo: Repository<
      DeliveryFounderConsultContractHistory
    >,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly fileUploadService: FileUploadService,
    private readonly nanudaSlackNotificationService: NanudaSlackNotificationService,
  ) {
    super();
  }

  //   admin services

  /**
   * find one for admin
   * @param deliverySpaceNo
   */
  async findOneForAdmin(deliverySpaceNo: number): Promise<DeliverySpace> {
    const space = await this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .CustomLeftJoinAndSelect([
        'deliverySpaceOptions',
        'amenities',
        'contracts',
        'brands',
        'isBested',
      ])
      .leftJoinAndSelect('contracts.nanudaUser', 'nanudaUser')
      .where('deliverySpace.no = :no', { no: deliverySpaceNo })
      // .andWhere('brands.showYn = :showYn', { showYn: YN.YES })
      .getOne();
    if (!space) {
      throw new NotFoundException();
    }
    // find remaining count
    const contracted = await this.duplicateCheckRepo.find({
      where: { deliverySpaceNo: space.no },
    });
    space.remainingCount = space.quantity - contracted.length;
    if (space.remainingCount < 0) {
      throw new BadRequestException({ message: 'Overbooked' });
    }

    return space;
  }

  /**
   * find next
   * @param deliverySpaceNo
   */
  async findNextForAdminByDistrict(deliverySpaceNo: number): Promise<any> {
    const checkSpace = await this.deliverySpaceRepo.findOne(deliverySpaceNo);
    if (!checkSpace) {
      throw new NotFoundException();
    }
    const nextSpace = await this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .where('deliverySpace.companyDistrictNo = :companyDistrictNo', {
        companyDistrictNo: checkSpace.companyDistrictNo,
      })
      .AndWhereNext(deliverySpaceNo)
      .getOne();
    if (!nextSpace) {
      return null;
    }
    return nextSpace.no;
  }

  /**
   * find next by district
   * @param deliverySpaceNo
   */
  async findNextForAdmin(deliverySpaceNo: number): Promise<any> {
    const checkSpace = await this.deliverySpaceRepo.findOne(deliverySpaceNo);
    if (!checkSpace) {
      throw new NotFoundException();
    }
    const nextSpace = await this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .AndWhereNext(deliverySpaceNo)
      .getOne();
    if (!nextSpace) {
      return null;
    }
    return nextSpace.no;
  }

  /**
   * find previous by district
   * @param deliverySpaceNo
   */
  async findPreviousForAdminByDistrict(deliverySpaceNo: number): Promise<any> {
    const checkSpace = await this.deliverySpaceRepo.findOne(deliverySpaceNo);
    if (!checkSpace) {
      throw new NotFoundException();
    }
    const previousSpaceNo = await this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .where('deliverySpace.companyDistrictNo = :companyDistrictNo', {
        companyDistrictNo: checkSpace.companyDistrictNo,
      })
      .AndWherePrevious(deliverySpaceNo)
      .getOne();
    if (!previousSpaceNo) {
      return null;
    }
    return previousSpaceNo.no;
  }

  /**
   * find previous
   * @param deliverySpaceNo
   */
  async findPreviousForAdmin(deliverySpaceNo: number): Promise<any> {
    const checkSpace = await this.deliverySpaceRepo.findOne(deliverySpaceNo);
    if (!checkSpace) {
      throw new NotFoundException();
    }
    const previousSpaceNo = await this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .AndWherePrevious(deliverySpaceNo)
      .getOne();
    if (!previousSpaceNo) {
      return null;
    }
    return previousSpaceNo.no;
  }

  /**
   * find for admin
   * @param adminDeiverySpaceListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminDeliverySpaceListDto: AdminDeliverySpaceListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliverySpace>> {
    console.log(adminDeliverySpaceListDto);
    const qb = this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .CustomLeftJoinAndSelect([
        'deliverySpaceOptions',
        'amenities',
        'contracts',
        'brands',
        'isBested',
      ])
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .AndWhereLike(
        'company',
        'nameKr',
        adminDeliverySpaceListDto.companyName,
        adminDeliverySpaceListDto.exclude('companyName'),
      )
      .AndWhereLike(
        'companyDistrict',
        'nameKr',
        adminDeliverySpaceListDto.companyDistrictName,
        adminDeliverySpaceListDto.exclude('companyDistrictName'),
      )
      .AndWhereLike(
        'deliverySpace',
        'typeName',
        adminDeliverySpaceListDto.typeName,
        adminDeliverySpaceListDto.exclude('typeName'),
      )
      .AndWhereLike(
        'deliverySpace',
        'buildingName',
        adminDeliverySpaceListDto.buildingName,
        adminDeliverySpaceListDto.exclude('buildingName'),
      )
      .AndWhereLike(
        'amenities',
        'amenityName',
        adminDeliverySpaceListDto.amenityName,
        adminDeliverySpaceListDto.exclude('amenityName'),
      )
      .AndWhereLike(
        'deliverySpaceOptions',
        'deliverySpaceOptionName',
        adminDeliverySpaceListDto.deliverySpaceOptionName,
        adminDeliverySpaceListDto.exclude('deliverySpaceOptions'),
      )
      //   .AndWhereLike('deliverySpace', 'size', adminDeiverySpaceListDto.size, adminDeiverySpaceListDto.exclude('size'))
      .AndWhereLessThan(
        'deliverySpace',
        'monthlyRentFee',
        adminDeliverySpaceListDto.monthlyRentFee,
        adminDeliverySpaceListDto.exclude('monthlyRentFee'),
      )
      .AndWhereLessThan(
        'deliverySpace',
        'deposit',
        adminDeliverySpaceListDto.deposit,
        adminDeliverySpaceListDto.exclude('deposit'),
      )
      .AndWhereLessThan(
        'deliverySpace',
        'monthlyUtilityFee',
        adminDeliverySpaceListDto.monthlyUtilityFee,
        adminDeliverySpaceListDto.exclude('monthlyUtilityFee'),
      )
      .AndWhereEqual(
        'isBested',
        'showYn',
        adminDeliverySpaceListDto.isBestedShowYn,
        adminDeliverySpaceListDto.exclude('isBestedShowYn'),
      )
      .AndWhereLike(
        'brands',
        'name',
        adminDeliverySpaceListDto.brandName,
        adminDeliverySpaceListDto.exclude('brandName'),
      )
      .AndWhereEqual(
        'company',
        'no',
        adminDeliverySpaceListDto.companyNo,
        adminDeliverySpaceListDto.exclude('companyNo'),
      )
      .AndWhereEqual(
        'companyDistrict',
        'no',
        adminDeliverySpaceListDto.companyDistrictNo,
        adminDeliverySpaceListDto.exclude('companyDistrictNo'),
      )
      // .andWhere('images.uploadType = :uploadType', {
      //   uploadType: UPLOAD_TYPE.DELIVERY_SPACE,
      // })
      .WhereAndOrder(adminDeliverySpaceListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * create for admin
   * @param adminNo
   * @param adminDeliverySpaceCreateDto
   */
  async createForAdmin(
    adminNo: number,
    adminDeliverySpaceCreateDto: AdminDeliverySpaceCreateDto,
  ): Promise<DeliverySpace> {
    const space = await this.entityManager.transaction(async entityManager => {
      const checkDistrict = await this.companyDistrictRepo.findOne(
        adminDeliverySpaceCreateDto.companyDistrictNo,
      );
      if (!checkDistrict) {
        throw new NotFoundException({
          message: '지점이 존재하지 않습니다.',
        });
      }
      let newDeliverySpace = new DeliverySpace(adminDeliverySpaceCreateDto);
      newDeliverySpace.adminNo = adminNo;
      if (
        newDeliverySpace.images &&
        newDeliverySpace.images.length === 0 &&
        newDeliverySpace.delYn === YN.NO
      ) {
        throw new BadRequestException({
          message: '이미지 하나 이상은 있어야 노출합니다.',
          error: 400,
        });
      }
      if (newDeliverySpace.images && newDeliverySpace.images.length > 0) {
        newDeliverySpace.images = await this.fileUploadService.moveS3File(
          adminDeliverySpaceCreateDto.images,
        );
        if (!newDeliverySpace.images) {
          throw new BadRequestException({
            message: 'Upload failed!',
          });
        }
        // TODO: 정책 정해야함
        newDeliverySpace.picStatus = SPACE_PIC_STATUS.INCOMPLETE;
      }
      // 남은 공실 컬럼
      newDeliverySpace.remainingCount = adminDeliverySpaceCreateDto.quantity;
      newDeliverySpace = await entityManager.save(newDeliverySpace);

      /**
       * best space
       */
      if (adminDeliverySpaceCreateDto.isBestedYn === YN.YES) {
        let newBestMapper = new BestSpaceMapper();
        newBestMapper.spaceNo = newDeliverySpace.no;
        newBestMapper.spaceTypeNo = SPACE_TYPE.ONLY_DELIVERY;
        newBestMapper.showYn = adminDeliverySpaceCreateDto.isBestedShowYn;
        // create new best
        await entityManager.getRepository(BestSpaceMapper).save(newBestMapper);
      }
      //   create mapper for amenity
      if (
        adminDeliverySpaceCreateDto.amenityIds &&
        adminDeliverySpaceCreateDto.amenityIds.length > 0
      ) {
        await Promise.all(
          adminDeliverySpaceCreateDto.amenityIds.map(async amenityId => {
            let newMapper = this.__create_amenity(
              amenityId,
              newDeliverySpace.no,
              adminNo,
              null,
            );
            newMapper = await entityManager.save(newMapper);
          }),
        );
      }
      if (
        adminDeliverySpaceCreateDto.deliverySpaceOptionIds &&
        adminDeliverySpaceCreateDto.deliverySpaceOptionIds.length > 0
      ) {
        await Promise.all(
          adminDeliverySpaceCreateDto.deliverySpaceOptionIds.map(
            async optionId => {
              let newMapper = this.__create_delivery_space_option(
                optionId,
                newDeliverySpace.no,
                adminNo,
                null,
              );
              newMapper = await entityManager.save(newMapper);
            },
          ),
        );
      }
      if (
        adminDeliverySpaceCreateDto.brandIds &&
        adminDeliverySpaceCreateDto.brandIds.length > 0
      ) {
        await Promise.all(
          adminDeliverySpaceCreateDto.brandIds.map(async brandId => {
            let brandMapper = new DeliverySpaceBrandMapper();
            brandMapper.brandNo = brandId;
            brandMapper.deliverySpaceNo = newDeliverySpace.no;
            brandMapper = await entityManager.save(brandMapper);
          }),
        );
      }
      return newDeliverySpace;
    });
    return space;
  }

  /**
   * hard delete
   * @param deliverySpaceNo
   */
  async hardDeleteDeliverySpace(deliverySpaceNo: number) {
    const deliverySpace = await this.deliverySpaceRepo.findOne(deliverySpaceNo);
    if (!deliverySpace) {
      throw new BadRequestException({ message: '존재하지 않는 공간입니다.' });
    }
    await this.entityManager.transaction(async entityManager => {
      await entityManager
        .getRepository(DeliverySpaceOptionSpaceMapper)
        .createQueryBuilder()
        .delete()
        .from(DeliverySpaceOptionSpaceMapper)
        .where('spaceNo = :deliverySpaceNo', {
          deliverySpaceNo: deliverySpaceNo,
        })
        .execute();

      await entityManager
        .getRepository(DeliverySpaceAmenityMapper)
        .createQueryBuilder()
        .delete()
        .from(DeliverySpaceAmenityMapper)
        .where('deliverySpaceNo = :deliverySpaceNo', {
          deliverySpaceNo: deliverySpaceNo,
        })
        .execute();

      // best space mapper
      await entityManager
        .getRepository(BestSpaceMapper)
        .createQueryBuilder()
        .delete()
        .from(BestSpaceMapper)
        .where('spaceNo = :spaceNo', { spaceNo: deliverySpaceNo })
        .andWhere('spaceTypeNo = :spaceTypeNo', {
          spaceTypeNo: SPACE_TYPE.ONLY_DELIVERY,
        })
        .execute();

      await this.deliverySpaceRepo
        .createQueryBuilder('deliverySpaceNo')
        .delete()
        .from(DeliverySpace)
        .where('no = :no', { no: deliverySpaceNo })
        .execute();
    });
  }

  /**
   * update for admin
   * @param deliverySpaceNo
   * @param adminDeliverySpaceUpdateDto
   * @param adminNo
   */
  async updateForAdmin(
    deliverySpaceNo: number,
    adminDeliverySpaceUpdateDto: AdminDeliverySpaceUpdateDto,
    adminNo: number,
  ): Promise<DeliverySpace> {
    console.log(adminDeliverySpaceUpdateDto);
    const deliverySpace = await this.entityManager.transaction(
      async entityManager => {
        let deliverySpace = await this.deliverySpaceRepo.findOne(
          deliverySpaceNo,
        );
        if (!deliverySpaceNo) {
          throw new NotFoundException();
        }
        if (
          adminDeliverySpaceUpdateDto.amenityIds &&
          adminDeliverySpaceUpdateDto.amenityIds.length > 0
        ) {
          // delete amenities first
          await this.amenityMapperRepo
            .createQueryBuilder()
            .delete()
            .from(DeliverySpaceAmenityMapper)
            .where('deliverySpaceNo = :deliverySpaceNo', {
              deliverySpaceNo: deliverySpace.no,
            })
            .execute();
          await Promise.all(
            adminDeliverySpaceUpdateDto.amenityIds.map(async amenityId => {
              let newAmenity = this.__create_amenity(
                amenityId,
                deliverySpace.no,
                adminNo,
                null,
              );
              newAmenity = await entityManager.save(newAmenity);
            }),
          );
        }
        if (
          adminDeliverySpaceUpdateDto.deliverySpaceOptionIds &&
          adminDeliverySpaceUpdateDto.deliverySpaceOptionIds.length > 0
        ) {
          // delete options first
          await this.deliveryOptionMapperRepo
            .createQueryBuilder()
            .delete()
            .from(DeliverySpaceDeliveryOptionMapper)
            .where('deliverySpaceNo = :deliverySpaceNo', {
              deliverySpaceNo: deliverySpace.no,
            })
            .execute();

          adminDeliverySpaceUpdateDto.deliverySpaceOptionIds.map(
            async optionId => {
              let newOption = this.__create_delivery_space_option(
                optionId,
                deliverySpaceNo,
                adminNo,
                null,
              );
              newOption = await entityManager.save(newOption);
            },
          );
        }
        if (
          adminDeliverySpaceUpdateDto.brandIds &&
          adminDeliverySpaceUpdateDto.brandIds.length > 0
        ) {
          // delete brand mapper first
          await this.deliveryBrandMapper
            .createQueryBuilder()
            .delete()
            .from(DeliverySpaceBrandMapper)
            .where('deliverySpaceNo = :deliverySpaceNo', {
              deliverySpaceNo: deliverySpace.no,
            })
            .execute();

          await Promise.all(
            adminDeliverySpaceUpdateDto.brandIds.map(async brandId => {
              let brandMapper = new DeliverySpaceBrandMapper();
              brandMapper.brandNo = brandId;
              brandMapper.deliverySpaceNo = deliverySpace.no;
              brandMapper = await entityManager.save(brandMapper);
            }),
          );
        }
        if (
          adminDeliverySpaceUpdateDto.newImages &&
          adminDeliverySpaceUpdateDto.newImages.length > 0
        ) {
          adminDeliverySpaceUpdateDto.images = [
            ...adminDeliverySpaceUpdateDto.images,
            ...adminDeliverySpaceUpdateDto.newImages,
          ];
        }
        deliverySpace.adminNo = adminNo;
        deliverySpace = deliverySpace.set(adminDeliverySpaceUpdateDto);

        if (adminDeliverySpaceUpdateDto.isBestedYn === YN.YES) {
          // check if bested already
          const check = await entityManager
            .getRepository(BestSpaceMapper)
            .findOne({
              spaceNo: deliverySpaceNo,
              spaceTypeNo: SPACE_TYPE.ONLY_DELIVERY,
            });
          if (check) {
            throw new BadRequestException({
              message: 'Already in best space list.',
            });
          }
          let newBestMapper = new BestSpaceMapper();
          newBestMapper.spaceNo = deliverySpaceNo;
          newBestMapper.spaceTypeNo = SPACE_TYPE.ONLY_DELIVERY;
          newBestMapper.showYn = adminDeliverySpaceUpdateDto.isBestedShowYn;
          await entityManager
            .getRepository(BestSpaceMapper)
            .save(newBestMapper);
        }
        if (adminDeliverySpaceUpdateDto.isBestedYn === YN.NO) {
          await entityManager
            .getRepository(BestSpaceMapper)
            .createQueryBuilder()
            .delete()
            .from(BestSpaceMapper)
            .where('spaceNo = :spaceNo', { spaceNo: deliverySpaceNo })
            .andWhere('spaceTypeNo = :spaceTypeNo', {
              spaceTypeNo: SPACE_TYPE.ONLY_DELIVERY,
            })
            .execute();
        }
        deliverySpace = await entityManager.save(deliverySpace);
        return deliverySpace;
      },
    );
    return deliverySpace;
  }

  //   company user

  /**
   * find for company user
   * @param companyNo
   * @param deliverySpaceListDto
   * @param pagination
   */
  async findAllForCompanyUser(
    companyNo: number,
    deliverySpaceListDto: DeliverySpaceListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliverySpace>> {
    const qb = this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .CustomLeftJoinAndSelect([
        'deliverySpaceOptions',
        'amenities',
        'contracts',
      ])
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('company.no = :no', { no: companyNo })
      // .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .AndWhereLike(
        'companyDistrict',
        'nameKr',
        deliverySpaceListDto.companyDistrictName,
        deliverySpaceListDto.exclude('companyDistrictName'),
      )
      .AndWhereLike(
        'deliverySpace',
        'typeName',
        deliverySpaceListDto.typeName,
        deliverySpaceListDto.exclude('typeName'),
      )
      .AndWhereLike(
        'deliverySpace',
        'buildingName',
        deliverySpaceListDto.buildingName,
        deliverySpaceListDto.exclude('buildingName'),
      )
      .AndWhereLike(
        'amenities',
        'amenityName',
        deliverySpaceListDto.amenityName,
        deliverySpaceListDto.exclude('amenityName'),
      )
      .AndWhereLike(
        'deliverySpaceOptions',
        'deliverySpaceOptionName',
        deliverySpaceListDto.deliverySpaceOptionName,
        deliverySpaceListDto.exclude('deliverySpaceOptions'),
      )
      //   .AndWhereLike('deliverySpace', 'size', adminDeiverySpaceListDto.size, adminDeiverySpaceListDto.exclude('size'))
      .AndWhereEqual(
        'deliverySpace',
        'monthlyRentFee',
        deliverySpaceListDto.monthlyRentFee,
        deliverySpaceListDto.exclude('monthlyRentFee'),
      )
      .AndWhereEqual(
        'companyDistrict',
        'no',
        deliverySpaceListDto.companyDistrictNo,
        deliverySpaceListDto.exclude('companyDistrictNo'),
      )
      .WhereAndOrder(deliverySpaceListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one for company user
   * @param deliverySpaceNo
   * @param companyNo
   */
  async findOneForCompanyUser(
    deliverySpaceNo: number,
    companyNo: number,
  ): Promise<DeliverySpace> {
    const space = await this.deliverySpaceRepo
      .createQueryBuilder('deliverySpace')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .CustomLeftJoinAndSelect(['deliverySpaceOptions', 'amenities'])
      .where('deliverySpace.no = :no', { no: deliverySpaceNo })
      .andWhere('company.no = :companyNo', { companyNo: companyNo })
      .getOne();
    if (!space) {
      throw new NotFoundException();
    }
    const promotionIds = [];
    const promotions = await this.entityManager
      .getRepository(CompanyDistrictPromotionMapper)
      .createQueryBuilder('mapper')
      .where('mapper.companyDistrictNo = :companyDistrictNo', {
        companyDistrictNo: space.companyDistrict.no,
      })
      .select(['mapper.promotionNo'])
      .getMany();

    if (promotions && promotions.length > 0) {
      promotions.map(promotion => {
        promotionIds.push(promotion.promotionNo);
      });
      space.companyDistrict.promotions = await this.entityManager
        .getRepository(CompanyDistrictPromotion)
        .createQueryBuilder('promotions')
        .whereInIds(promotionIds)
        .andWhere('promotions.showYn = :showYn', { showYn: YN.YES })
        .AndWhereBetweenDate(new Date())
        .getMany();
    }

    return space;
  }

  /**
   * create for company user
   * @param companyUserNo
   * @param companyNo
   * @param deliverySpaceCreateDto
   */
  async createForCompanyUser(
    companyUserNo: number,
    companyNo: number,
    deliverySpaceCreateDto: DeliverySpaceCreateDto,
  ): Promise<DeliverySpace> {
    const space = await this.entityManager.transaction(async entityManager => {
      const checkDistrict = await this.companyDistrictRepo.findOne({
        companyNo: companyNo,
        no: deliverySpaceCreateDto.companyDistrictNo,
      });
      if (!checkDistrict) {
        throw new NotFoundException({
          message: '지점이 존재하지 않거나 본인 업체 지점이 아닙니다.',
        });
      }
      let newDeliverySpace = new DeliverySpace(deliverySpaceCreateDto);
      newDeliverySpace.companyUserNo = companyUserNo;
      newDeliverySpace.images = await this.fileUploadService.moveS3File(
        deliverySpaceCreateDto.images,
      );
      newDeliverySpace.remainingCount = deliverySpaceCreateDto.quantity;
      newDeliverySpace = await entityManager.save(newDeliverySpace);
      //   create mapper for amenity
      if (
        deliverySpaceCreateDto.amenityIds &&
        deliverySpaceCreateDto.amenityIds.length > 0
      ) {
        await Promise.all(
          deliverySpaceCreateDto.amenityIds.map(async amenityId => {
            let newMapper = this.__create_amenity(
              amenityId,
              newDeliverySpace.no,
              null,
              companyUserNo,
            );
            newMapper = await entityManager.save(newMapper);
          }),
        );
      }
      if (
        deliverySpaceCreateDto.deliverySpaceOptionIds &&
        deliverySpaceCreateDto.deliverySpaceOptionIds.length > 0
      ) {
        await Promise.all(
          deliverySpaceCreateDto.deliverySpaceOptionIds.map(async optionId => {
            let newMapper = this.__create_delivery_space_option(
              optionId,
              newDeliverySpace.no,
              null,
              companyUserNo,
            );
            newMapper = await entityManager.save(newMapper);
          }),
        );
      }
      newDeliverySpace = await this.deliverySpaceRepo
        .createQueryBuilder('deliverySpace')
        .CustomInnerJoinAndSelect(['companyDistrict'])
        .innerJoinAndSelect('companyDistrict.company', 'company')
        .where('deliverySpace.no = :no', { no: newDeliverySpace.no })
        .getOne();
      // send slack information
      await this.nanudaSlackNotificationService.deliverySpaceAddNotification(
        newDeliverySpace,
      );
      return newDeliverySpace;
    });
    return space;
  }

  /**
   * update dto for company user
   * @param deliverySpaceNo
   * @param companyNo
   * @param deliverySpaceUpdateDto
   */
  async updateByCompanyUser(
    deliverySpaceNo: number,
    companyNo: number,
    companyUserNo: number,
    deliverySpaceUpdateDto: DeliverySpaceUpdateDto,
  ): Promise<DeliverySpace> {
    const deliverySpace = await this.entityManager.transaction(
      async entityManager => {
        let space = await this.deliverySpaceRepo
          .createQueryBuilder('deliverySpace')
          .CustomInnerJoinAndSelect(['companyDistrict'])
          .innerJoinAndSelect('companyDistrict.company', 'company')
          .CustomLeftJoinAndSelect(['contracts'])
          .where('deliverySpace.no = :no', { no: deliverySpaceNo })
          .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
          .andWhere('company.no = :companyNo', { companyNo: companyNo })
          .getOne();

        if (!space) {
          throw new NotFoundException();
        }
        if (deliverySpaceUpdateDto.quantity < space.remainingCount) {
          throw new BadRequestException({
            message: `공실은 ${space.remainingCount}이상이어야합니다.`,
          });
        }
        if (
          deliverySpaceUpdateDto.amenityIds &&
          deliverySpaceUpdateDto.amenityIds.length > 0
        ) {
          // delete first
          await this.amenityMapperRepo
            .createQueryBuilder()
            .delete()
            .from(DeliverySpaceAmenityMapper)
            .where('deliverySpaceNo = :deliverySpaceNo', {
              deliverySpaceNo: deliverySpaceNo,
            })
            .execute();

          // create amenities
          await Promise.all(
            deliverySpaceUpdateDto.amenityIds.map(async amenityId => {
              let newAmenity = this.__create_amenity(
                amenityId,
                deliverySpaceNo,
                null,
                companyUserNo,
              );
              newAmenity = await entityManager.save(newAmenity);
            }),
          );
        }
        if (
          deliverySpaceUpdateDto.deliverySpaceOptionIds &&
          deliverySpaceUpdateDto.deliverySpaceOptionIds.length > 0
        ) {
          await this.deliveryOptionMapperRepo
            .createQueryBuilder()
            .delete()
            .from(DeliverySpaceDeliveryOptionMapper)
            .where('deliverySpaceNo = :deliverySpaceNo', {
              deliverySpaceNo: deliverySpaceNo,
            })
            .execute();
          await Promise.all(
            deliverySpaceUpdateDto.deliverySpaceOptionIds.map(
              async optionId => {
                let option = this.__create_delivery_space_option(
                  optionId,
                  deliverySpaceNo,
                  null,
                  companyUserNo,
                );
                option = await entityManager.save(option);
              },
            ),
          );
        }
        space = space.set(deliverySpaceUpdateDto);
        return await entityManager.save(space);
      },
    );
    return deliverySpace;
  }

  /**
   * delete by company user
   * @param deliverySpaceNo
   * @param companyNo
   */
  async deleteByCompanyUser(deliverySpaceNo: number, companyNo: number) {
    const deliverySpace = await this.entityManager.transaction(
      async entityManager => {
        let space = await this.deliverySpaceRepo
          .createQueryBuilder('deliverySpace')
          .CustomInnerJoinAndSelect(['companyDistrict'])
          .CustomLeftJoinAndSelect(['contracts'])
          .innerJoinAndSelect('companyDistrict.company', 'company')
          .where('deliverySpace.no = :no', { no: deliverySpaceNo })
          .andWhere('company.no = :companyNo', { companyNo: companyNo })
          .getOne();

        if (space.delYn === YN.YES) {
          throw new BadRequestException({ message: 'Already deleted' });
        }
        if (space.contracts && space.contracts.length > 0) {
          throw new BadRequestException({
            message: '계약건들을 먼저 삭제해주세요.',
          });
        }
        space.delYn = YN.YES;
        space = await entityManager.save(space);
        return space;
      },
    );
    return deliverySpace;
  }

  // create new amenity
  private __create_amenity(
    amenityNo: number,
    deliverySpaceNo: number,
    adminNo?: number,
    companyUserNo?: number,
  ): DeliverySpaceAmenityMapper {
    const amenity = new DeliverySpaceAmenityMapper();
    amenity.amenityNo = amenityNo;
    amenity.deliverySpaceNo = deliverySpaceNo;
    if (adminNo) {
      amenity.adminNo = adminNo;
    }
    if (companyUserNo) {
      amenity.companyUserNo = companyUserNo;
    }
    return amenity;
  }

  private __create_delivery_space_option(
    deliverySpaceOptionNo: number,
    deliverySpaceNo: number,
    adminNo?: number,
    companyUserNo?: number,
  ): DeliverySpaceDeliveryOptionMapper {
    const option = new DeliverySpaceDeliveryOptionMapper();
    option.deliverySpaceOptionNo = deliverySpaceOptionNo;
    option.deliverySpaceNo = deliverySpaceNo;
    if (adminNo) {
      option.adminNo = adminNo;
    }
    if (companyUserNo) {
      option.companyUserNo = companyUserNo;
    }
    return option;
  }
}
