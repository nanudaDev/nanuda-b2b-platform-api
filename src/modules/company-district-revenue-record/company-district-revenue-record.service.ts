import { Injectable, NotFoundException } from '@nestjs/common';
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
    const records = qb.getMany();

    if (!records) {
      throw new NotFoundException();
    }

    return records;
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
