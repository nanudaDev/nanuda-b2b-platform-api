import { Injectable } from '@nestjs/common';
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
  async findOne(no: number): Promise<CompanyDistrictRevenueRecord> {
    return await this.companyDistrictRevenueRecordRepo.findOne(no);
  }
}
