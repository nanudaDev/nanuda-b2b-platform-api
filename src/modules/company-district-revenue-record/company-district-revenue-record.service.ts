import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { APPROVAL_STATUS, BaseService } from 'src/core';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Admin } from '../admin/admin.entity';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { CompanyUser } from '../company-user/company-user.entity';
import { CompanyDistrictRevenueRecord } from './company-district-revenue-record.entity';
import {
  CompanyDistrictRevenueRecordUpdateDto,
  CompanyDistrictRevenueRecordCreateDto,
  CompanyDistrictRevenueRecordListDto,
} from './dto';

@Injectable()
export class CompanyDistrictRevenueRecordService extends BaseService {
  constructor(
    @InjectRepository(CompanyDistrictRevenueRecord)
    private readonly companyDistrictRevenueRecordRepo: Repository<
      CompanyDistrictRevenueRecord
    >,
    @InjectRepository(CompanyDistrict)
    private readonly companyDistrictRepo: Repository<CompanyDistrict>,
  ) {
    super();
  }

  async findOne(
    companyUser: CompanyUser,
    no: number,
  ): Promise<CompanyDistrictRevenueRecord> {
    return this.__build_record(companyUser)
      .andWhere('revenueRecord.no = :recordNo', { recordNo: no })
      .getOne();
  }

  async findAll(
    companyUser: CompanyUser,
    companyDistrictRevenueRecordListDto: CompanyDistrictRevenueRecordListDto,
  ): Promise<CompanyDistrictRevenueRecord[]> {
    const qb = this.__build_record(companyUser).AndWhereEqual(
      'companyDistrict',
      'no',
      companyDistrictRevenueRecordListDto.companyDistrictNo,
      companyDistrictRevenueRecordListDto.exclude('companyDistrictNo'),
    );
    if (companyDistrictRevenueRecordListDto.year) {
      qb.andWhere('revenueRecord.year = :year', {
        year: companyDistrictRevenueRecordListDto.year,
      });
    }
    qb.orderBy('revenueRecord.year', 'DESC');
    const records = await qb.getMany();
    return records;
  }

  /**
   * create new record
   * @param companyUser
   * @param companyDistrictRevenueRecordCreateDto
   */
  async createRecord(
    companyUser: CompanyUser,
    companyDistrictRevenueRecordCreateDto: CompanyDistrictRevenueRecordCreateDto,
  ): Promise<CompanyDistrictRevenueRecord> {
    // 해당 district가 companyUser의 district 일때만 save 함
    const theDistrict = await this.companyDistrictRepo
      .createQueryBuilder('companyDistrict')
      .where('companyDistrict.companyNo = :companyNo', {
        companyNo: companyUser.companyNo,
      })
      .andWhere('companyDistrict.no = :no', {
        no: companyDistrictRevenueRecordCreateDto.companyDistrictNo,
      })
      .getOne();

    if (!theDistrict) {
      throw new BadRequestException('NOT YOUR DISTRICT');
    }
    return await this.companyDistrictRevenueRecordRepo.save(
      companyDistrictRevenueRecordCreateDto,
    );
  }

  async updateRecord(
    companyUser: CompanyUser,
    id: number,
    companyDistrictRevenueRecordUpdateDto: CompanyDistrictRevenueRecordUpdateDto,
  ): Promise<CompanyDistrictRevenueRecord> {
    const requestedRecord = await this.findOne(companyUser, id);
    if (!requestedRecord) {
      throw new NotFoundException();
    }
    requestedRecord.set(companyDistrictRevenueRecordUpdateDto);
    return await this.companyDistrictRevenueRecordRepo.save(requestedRecord);
  }

  async findAllForAdmin(
    id: number,
    companyDistrictRevenueRecordListDto: CompanyDistrictRevenueRecordListDto,
  ): Promise<CompanyDistrictRevenueRecord[]> {
    const qb = this.companyDistrictRevenueRecordRepo
      .createQueryBuilder('revenueRecord')
      .innerJoin('revenueRecord.companyDistrict', 'companyDistrict')
      .AndWhereEqual(
        'companyDistrict',
        'no',
        id,
        companyDistrictRevenueRecordListDto.exclude('companyDistrictNo'),
      );
    if (companyDistrictRevenueRecordListDto.year) {
      qb.andWhere('revenueRecord.year = :year', {
        year: companyDistrictRevenueRecordListDto.year,
      });
    }
    qb.orderBy('revenueRecord.year', 'DESC');
    const records = await qb.getMany();
    return records;
  }

  private __build_record(
    companyUser: CompanyUser,
  ): SelectQueryBuilder<CompanyDistrictRevenueRecord> {
    const qb = this.companyDistrictRevenueRecordRepo
      .createQueryBuilder('revenueRecord')
      // .CustomInnerJoinAndSelect(['companyDistrict'])
      .innerJoin('revenueRecord.companyDistrict', 'companyDistrict')
      .innerJoin('companyDistrict.company', 'company')
      .where('company.no = :companyNo', { companyNo: companyUser.companyNo });
    return qb;
  }
}
