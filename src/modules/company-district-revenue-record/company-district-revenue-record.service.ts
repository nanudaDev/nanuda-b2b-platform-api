import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
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
    // return await this.companyDistrictRevenueRecordRepo.findOne(no);
    return await this.companyDistrictRevenueRecordRepo.findOne(no);
  }

  //NATE TODO: find one with query builder
  async findOneWithQueryBuilder(
    no: number,
  ): Promise<CompanyDistrictRevenueRecord> {
    const qb = await this.companyDistrictRevenueRecordRepo
      .createQueryBuilder('revenueRecord')
      .where('revenueRecord.no = :no', { no: no })
      .getOne();
    if (!qb) {
      throw new NotFoundException();
    }

    return qb;
  }
}
