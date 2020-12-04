import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { DeliveryFounderConsultContract } from './delivery-founder-consult-contract.entity';
import { Repository, EntityManager } from 'typeorm';
import { DeliveryFounderConsultContractHistory } from '../delivery-founder-consult-contract-history/delivery-founder-consult-contract-history.entity';
import {
  AdminDeliveryFounderConsultContractListDto,
  DeliveryFounderConsultContractListDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';

@Injectable()
export class DeliveryFounderConsultContractService extends BaseService {
  constructor(
    @InjectRepository(DeliveryFounderConsultContract)
    private readonly deliveryFounderConsultContractRepo: Repository<
      DeliveryFounderConsultContract
    >,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  //   admin

  /**
   * find for admin
   * @param adminContractDto
   * @param pagination
   */
  async findAllForAdmin(
    adminContractDto: AdminDeliveryFounderConsultContractListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliveryFounderConsultContract>> {
    const qb = this.deliveryFounderConsultContractRepo
      .createQueryBuilder('contract')
      .CustomInnerJoinAndSelect(['deliverySpace', 'nanudaUser'])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .leftJoinAndSelect(
        'deliverySpace.deliveryFounderConsults',
        'deliveryFounderConsults',
      )
      .leftJoinAndSelect('deliverySpace.amenities', 'amenities')
      .leftJoinAndSelect(
        'deliverySpace.deliverySpaceOptions',
        'deliverySpaceOptions',
      )
      .AndWhereEqual(
        'nanudaUser',
        'no',
        adminContractDto.nanudaUserNo,
        adminContractDto.exclude('nanudaUserNo'),
      )
      .AndWhereEqual(
        'company',
        'no',
        adminContractDto.companyNo,
        adminContractDto.exclude('companyNo'),
      )
      .AndWhereLike(
        'company',
        'nameKr',
        adminContractDto.companyNameKr,
        adminContractDto.exclude('companyNameKr'),
      )
      .AndWhereLike(
        'company',
        'nameEng',
        adminContractDto.companyNameEng,
        adminContractDto.exclude('companyNameEng'),
      )
      .AndWhereEqual(
        'deliverySpace',
        'no',
        adminContractDto.deliverySpaceNo,
        adminContractDto.exclude('deliverySpaceNo'),
      )
      .AndWhereLike(
        'deliverySpace',
        'typeName',
        adminContractDto.deliverySpaceTypeName,
        adminContractDto.exclude('deliverySpaceTypeName'),
      )
      .AndWhereEqual(
        'deliverySpace',
        'size',
        adminContractDto.deliverySpaceSize,
        adminContractDto.exclude('deliverySpaceSize'),
      )
      .AndWhereEqual(
        'companyDistrict',
        'no',
        adminContractDto.companyDistrictNo,
        adminContractDto.exclude('companyDistrictNo'),
      )
      .AndWhereLike(
        'companyDistrict',
        'nameKr',
        adminContractDto.companyDistrictName,
        adminContractDto.exclude('companyDistrictName'),
      )
      .AndWhereLike(
        'deliveryFounderConsults',
        'hopeFoodCategory',
        adminContractDto.hopeFoodCategory,
        adminContractDto.exclude('hopeFoodCategory'),
      )
      .AndWhereLike(
        'amenities',
        'amenityName',
        adminContractDto.amenityName,
        adminContractDto.exclude('amenityName'),
      )
      .AndWhereLike(
        'deliverySpaceOptions',
        'deliverySpaceOptionName',
        adminContractDto.deliverySpaceOptionsName,
        adminContractDto.exclude('deliverySpaceOptionsName'),
      )
      .WhereAndOrder(adminContractDto)
      .Paginate(pagination);
    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  async findOneForAdmin(
    deliveryFounderConsultContractNo: number,
  ): Promise<DeliveryFounderConsultContract> {
    const contract = await this.deliveryFounderConsultContractRepo
      .createQueryBuilder('contract')
      .CustomInnerJoinAndSelect(['deliverySpace', 'nanudaUser'])
      .where('contract.no = :no', { no: deliveryFounderConsultContractNo })
      .getOne();

    return contract;
  }

  /**
   * remove user from contract table for admin
   * @param deliveryFounderConsultNo
   */
  async expiredContractForAdmin(
    deliveryFounderConsultNo: number,
  ): Promise<DeliveryFounderConsultContract> {
    const contract = await this.entityManager.transaction(
      async entityManager => {
        const contract = await this.deliveryFounderConsultContractRepo.findOne(
          deliveryFounderConsultNo,
        );
        let contractHistory = new DeliveryFounderConsultContractHistory(
          contract,
        );
        contractHistory = await entityManager.save(contractHistory);
        await this.deliveryFounderConsultContractRepo
          .createQueryBuilder()
          .delete()
          .from(DeliveryFounderConsultContract)
          .where('no = :no', { no: deliveryFounderConsultNo })
          .execute();

        return contract;
      },
    );
    return contract;
  }

  // company user
  async findAllForCompanyUser(
    contractDto: DeliveryFounderConsultContractListDto,
    pagination: PaginatedRequest,
    companyNo: number,
  ): Promise<PaginatedResponse<DeliveryFounderConsultContract>> {
    const qb = this.deliveryFounderConsultContractRepo
      .createQueryBuilder('contract')
      .CustomInnerJoinAndSelect(['deliverySpace', 'nanudaUser'])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .leftJoinAndSelect(
        'deliverySpace.deliveryFounderConsults',
        'deliveryFounderConsults',
      )
      .leftJoinAndSelect('deliverySpace.amenities', 'amenities')
      .leftJoinAndSelect(
        'deliverySpace.deliverySpaceOptions',
        'deliverySpaceOptions',
      )
      .where('company.no = :no', { no: companyNo })
      .AndWhereEqual(
        'nanudaUser',
        'no',
        contractDto.nanudaUserNo,
        contractDto.exclude('nanudaUserNo'),
      )
      .AndWhereEqual(
        'deliverySpace',
        'no',
        contractDto.deliverySpaceNo,
        contractDto.exclude('deliverySpaceNo'),
      )
      .AndWhereLike(
        'deliverySpace',
        'typeName',
        contractDto.deliverySpaceTypeName,
        contractDto.exclude('deliverySpaceTypeName'),
      )
      .AndWhereEqual(
        'deliverySpace',
        'size',
        contractDto.deliverySpaceSize,
        contractDto.exclude('deliverySpaceSize'),
      )
      .AndWhereEqual(
        'companyDistrict',
        'no',
        contractDto.companyDistrictNo,
        contractDto.exclude('companyDistrictNo'),
      )
      .AndWhereLike(
        'companyDistrict',
        'nameKr',
        contractDto.companyDistrictName,
        contractDto.exclude('companyDistrictName'),
      )
      .AndWhereLike(
        'deliveryFounderConsults',
        'hopeFoodCategory',
        contractDto.hopeFoodCategory,
        contractDto.exclude('hopeFoodCategory'),
      )
      .AndWhereLike(
        'amenities',
        'amenityName',
        contractDto.amenityName,
        contractDto.exclude('amenityName'),
      )
      .AndWhereLike(
        'deliverySpaceOptions',
        'deliverySpaceOptionName',
        contractDto.deliverySpaceOptionsName,
        contractDto.exclude('deliverySpaceOptionsName'),
      )
      .WhereAndOrder(contractDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find one
   * @param companyNo
   * @param contractNo
   */
  async findOneForCompanyUser(
    companyNo: number,
    contractNo: number,
  ): Promise<DeliveryFounderConsultContract> {
    const contract = await this.deliveryFounderConsultContractRepo
      .createQueryBuilder('contract')
      .CustomInnerJoinAndSelect(['deliverySpace', 'nanudaUser'])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('contract.no = :no', { no: contractNo })
      .andWhere('company.no = :companyNo', { companyNo: companyNo })
      .getOne();

    if (!contract) {
      throw new NotFoundException();
    }
    return contract;
  }

  /**
   * remove user from contract table for admin
   * @param deliveryFounderConsultNo
   */
  async expiredContractForCompanyUser(
    contractNo: number,
    companyNo: number,
  ): Promise<DeliveryFounderConsultContract> {
    const contract = await this.entityManager.transaction(
      async entityManager => {
        const contract = await this.deliveryFounderConsultContractRepo
          .createQueryBuilder('contract')
          .CustomInnerJoinAndSelect(['deliverySpace'])
          .innerJoinAndSelect(
            'deliverySpace.companyDistrict',
            'companyDistrict',
          )
          .innerJoinAndSelect('companyDistrict.company', 'company')
          .where('company.no = :companyNo', { companyNo: companyNo })
          .andWhere('contract.no = :no', { no: contractNo })
          .getOne();

        if (!contract) {
          throw new NotFoundException({
            message: '존재하지 않거나 본인 업체의 계약건이 아닙니다.',
            error: 404,
          });
        }
        let contractHistory = new DeliveryFounderConsultContractHistory(
          contract,
        );
        contractHistory = await entityManager.save(contractHistory);
        await this.deliveryFounderConsultContractRepo
          .createQueryBuilder()
          .delete()
          .from(DeliveryFounderConsultContract)
          .where('no = :no', { no: contractNo })
          .execute();
        // update delivery space remaining count
        let space = await this.entityManager
          .getRepository(DeliverySpace)
          .findOne(contract.deliverySpaceNo);
        space.remainingCount = space.remainingCount + 1;
        space = await this.entityManager
          .getRepository(DeliverySpace)
          .save(space);

        return contract;
      },
    );
    return contract;
  }
}
