import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Amenity } from './amenity.entity';
import { Repository, EntityManager } from 'typeorm';
import {
  AmenityListDto,
  AdminAmenityListDto,
  AdminAmenityCreateDto,
  AdminAmenityUpdateDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { CompanyDistrictAmenityMapper } from '../company-district-amenity-mapper/company-district-amenity-mapper.entity';
import { DeliverySpaceAmenityMapper } from '../delivery-space-amenity-mapper/delivery-space-amenity-mapper.entity';
import { AmenitySpaceMapper } from '../amenity-space-mapper/amenity-space-mapper.entity';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class AmenityService extends BaseService {
  constructor(
    @InjectRepository(Amenity)
    private readonly amenityRepo: Repository<Amenity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private fileUploadService: FileUploadService,
  ) {
    super();
  }

  async findAll(
    adminAmenityListDto: AmenityListDto | AdminAmenityListDto,
  ): Promise<Amenity[]> {
    const qb = this.amenityRepo
      .createQueryBuilder('amenity')
      .WhereAndOrder(adminAmenityListDto)
      .getMany();
    return await qb;
  }

  /**
   * find all with pagination
   * @param adminAmenityListDto
   * @param pagination
   */
  async findAllPaginate(
    adminAmenityListDto: AdminAmenityListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Amenity>> {
    const qb = this.amenityRepo
      .createQueryBuilder('amenity')
      .WhereAndOrder(adminAmenityListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * create
   * @param adminAmenityCreateDto
   */
  async createAmenity(
    adminAmenityCreateDto: AdminAmenityCreateDto,
  ): Promise<Amenity> {
    if (adminAmenityCreateDto.image && adminAmenityCreateDto.image.length > 0) {
      adminAmenityCreateDto.image = await this.fileUploadService.moveS3File(
        adminAmenityCreateDto.image,
      );
      if (!adminAmenityCreateDto.image) {
        throw new BadRequestException('Upload failed!');
      }
    }
    const amenity = new Amenity(adminAmenityCreateDto);
    return await this.amenityRepo.save(amenity);
  }

  /**
   * amenity update
   * @param amenityNo
   * @param adminAmenityUpdateDto
   */
  async update(
    amenityNo: number,
    adminAmenityUpdateDto: AdminAmenityUpdateDto,
  ): Promise<Amenity> {
    let amenity = await this.amenityRepo.findOne(amenityNo);
    if (adminAmenityUpdateDto.image && adminAmenityUpdateDto.image.length > 0) {
      adminAmenityUpdateDto.image = await this.fileUploadService.moveS3File(
        adminAmenityUpdateDto.image,
      );
      if (!adminAmenityUpdateDto.image) {
        throw new BadRequestException('Upload failed!');
      }
    }
    amenity = amenity.set(adminAmenityUpdateDto);
    amenity = await this.amenityRepo.save(amenity);
    return amenity;
  }

  /**
   * delete amenity
   * @param amenityNo
   */
  async deleteAmenity(amenityNo: number) {
    await this.entityManager.transaction(async entityManager => {
      // delete from company district first
      await entityManager
        .createQueryBuilder()
        .delete()
        .from(CompanyDistrictAmenityMapper)
        .where('amenityNo = :amenityNo', { amenityNo: amenityNo })
        .execute();

      // delete from delivery space
      await entityManager
        .createQueryBuilder()
        .delete()
        .from(DeliverySpaceAmenityMapper)
        .where('amenityNo = :amenityNo', { amenityNo: amenityNo })
        .execute();

      // delete from space
      await entityManager
        .createQueryBuilder()
        .delete()
        .from(AmenitySpaceMapper)
        .where('amenityNo = :amenityNo', { amenityNo: amenityNo })
        .execute();

      await entityManager
        .createQueryBuilder()
        .delete()
        .from(Amenity)
        .where('no = :no', { no: amenityNo })
        .execute();
    });
  }
}
