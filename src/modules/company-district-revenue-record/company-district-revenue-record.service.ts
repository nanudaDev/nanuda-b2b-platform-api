import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { APPROVAL_STATUS, BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { CompanyDistrictRevenueRecord } from './company-district-revenue-record.entity';
import {
  CompanyDistrictRevenueRecordUpdateDto,
  CompanyDistrictRevenueRecordCreateDto,
} from './dto';

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
    return await this.companyDistrictRevenueRecordRepo.findOne({
      where: { no: no },
    });
  }

  async findAll(
    districtNo: number,
    year: string,
  ): Promise<CompanyDistrictRevenueRecord[]> {
    // return await this.companyDistrictRevenueRecordRepo.find({
    //   where: { companyDistrictNo: districtNo },
    // });
    const qb = await this.companyDistrictRevenueRecordRepo
      .createQueryBuilder('revenueRecord')
      .where('revenueRecord.companyDistrictNo = :no', { no: districtNo });
    if (year) {
      qb.andWhere('revenueRecord.year = :year', { year: year });
    }
    qb.orderBy('revenueRecord.year', 'DESC');
    const records = qb.getMany();

    if (!records) {
      throw new NotFoundException();
    }

    return records;
  }

  async createRecord(
    companyDistrictRevenueRecordCreateDto: CompanyDistrictRevenueRecordCreateDto,
  ): Promise<CompanyDistrictRevenueRecord> {
    return await this.companyDistrictRevenueRecordRepo.save(
      companyDistrictRevenueRecordCreateDto,
    );
  }

  async updateRecord(
    id: number,
    companyDistrictRevenueRecordUpdateDto: CompanyDistrictRevenueRecordUpdateDto,
  ): Promise<CompanyDistrictRevenueRecord> {
    const requestedRecord = await this.findOne(id);
    if (!requestedRecord) {
      throw new NotFoundException();
    }
    requestedRecord.set(companyDistrictRevenueRecordUpdateDto);
    return await this.companyDistrictRevenueRecordRepo.save(requestedRecord);
  }
}
