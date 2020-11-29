import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
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

    return qb;
  }
}
