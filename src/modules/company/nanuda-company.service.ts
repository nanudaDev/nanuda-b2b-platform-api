import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { APPROVAL_STATUS, BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { Company } from './company.entity';

@Injectable()
export class NanudaCompanyService extends BaseService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * find all for nanuda user
   */
  async findAll(): Promise<Company[]> {
    const qb = await this.companyRepo
      .createQueryBuilder('company')
      .where('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .getMany();

    return qb;
  }

  /**
   * find all with pagination
   * @param pagination
   */
  async findWithPagination(
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Company>> {
    const qb = await this.companyRepo
      .createQueryBuilder('company')
      .where('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one
   * @param companyNo
   */
  async findOne(companyNo: number): Promise<Company> {
    const qb = await this.companyRepo
      .createQueryBuilder('company')
      .where('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere('company.no = :no', { no: companyNo })
      .getOne();
    return qb;
  }

  /**
   * find by company no
   * @param companyNo
   */
  async findByCompanyNo(companyNo: number): Promise<CompanyDistrict[]> {
    const qb = this.entityManager
      .getRepository(CompanyDistrict)
      .createQueryBuilder('companyDistrict')
      .CustomInnerJoinAndSelect(['codeManagement'])
      .where('companyDistrict.companyDistrictStatus = :companyDistrictStatus', {
        companyDistrictStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere('companyDistrict.companyNo = :companyNo', {
        companyNo: companyNo,
      })
      .getMany();

    return this.__remove_duplicate(qb);
  }

  private __remove_duplicate(array: any) {
    return array.filter((a: string, b: string) => array.indexOf(a) === b);
  }
}
