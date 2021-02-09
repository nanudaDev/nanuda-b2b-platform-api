import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { APPROVAL_STATUS, BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { CompanyDistrictRevenueRecord } from './company-district-revenue-record.entity';

@Injectable()
export class CompanyDistrictRevenueRecordService extends BaseService {
  constructor(
    @InjectRepository(CompanyDistrictRevenueRecord)
    private readonly companyDistrictRevenueRecordRepo: Repository<
      CompanyDistrictRevenueRecord
    >,
  ) {
    super();
  }

  /**
   * repository find one example
   * @param no
   */
  async findOne(no: number): Promise<CompanyDistrictRevenueRecord> {
    return await this.companyDistrictRevenueRecordRepo.findOne({
      where: { no: no },
    });
  }

  //NATE TODO: find one with query builder
  async findOneWithQueryBuilder(
    no: number,
    year: number,
  ): Promise<CompanyDistrictRevenueRecord> {
    const qb = await this.companyDistrictRevenueRecordRepo
      .createQueryBuilder('revenueRecord')
      // .innerJoinAndSelect('revenueRecord.companyDistrict', 'companyDistrict')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .leftJoinAndSelect('companyDistrict.deliverySpaces', 'deliverySpaces')
      .where('revenueRecord.no = :no', { no: no })
      .andWhere('revenueRecord.year = :year', { year: year })
      .andWhere('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere(
        'companyDistrict.companyDistrictStatus = :companyDistrictStatus',
        { companyDistrictStatus: APPROVAL_STATUS.APPROVAL },
      )
      .getOne();

    if (!qb) {
      throw new NotFoundException();
    }

    return qb;
  }
}
