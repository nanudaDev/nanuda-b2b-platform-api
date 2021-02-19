import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NumberOfBytesType } from 'aws-sdk/clients/kms';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { APPROVAL_STATUS, BaseService } from 'src/core';
import { Repository } from 'typeorm';
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
  ) {
    super();
  }

  /**
   * 기록 상세
   * @param no
   */
  async findOne(no: number): Promise<CompanyDistrictRevenueRecord> {
    return await this.companyDistrictRevenueRecordRepo.findOne({
      where: { no: no },
    });
  }

  /**
   * 기록 리스트
   * @param districtNo
   * @param year
   */
  async findAll(
    companyDistrictRecordRevenueListDto: CompanyDistrictRevenueRecordListDto,
    companyNo: number,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrictRevenueRecord>> {
    // return await this.companyDistrictRevenueRecordRepo.find({
    //   where: { companyDistrictNo: districtNo },
    // });
    const qb = this.companyDistrictRevenueRecordRepo
      .createQueryBuilder('revenueRecord')
      .CustomInnerJoinAndSelect(['companyDistrict'])
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('company.no = :companyNo', { companyNo: companyNo })
      .AndWhereEqual(
        'companyDistrict',
        'no',
        companyDistrictRecordRevenueListDto.companyDistrictNo,
        companyDistrictRecordRevenueListDto.exclude('companyDistrictNo'),
      )
      .AndWhereLike(
        'companyDistrict',
        'nameKr',
        companyDistrictRecordRevenueListDto.companyDistrictName,
        companyDistrictRecordRevenueListDto.exclude('companyDistrictName'),
      )
      .AndWhereLike(
        'revenueRecord.year',
        'year',
        companyDistrictRecordRevenueListDto.year,
        companyDistrictRecordRevenueListDto.exclude('year'),
      )
      .Paginate(pagination)
      // .WhereAndOrder(companyDistrictRecordRevenueListDto)
      .getManyAndCount();

    const [items, totalCount] = await qb;
    return { items, totalCount };
  }

  /**
   * 기록 생성
   * @param companyDistrictRevenueRecordCreateDto
   */
  async createRecord(
    companyDistrictRevenueRecordCreateDto: CompanyDistrictRevenueRecordCreateDto,
  ): Promise<CompanyDistrictRevenueRecord> {
    // return await this.companyDistrictRevenueRecordRepo.save(
    //   companyDistrictRevenueRecordCreateDto,
    // );
    let newRecord = new CompanyDistrictRevenueRecord(
      companyDistrictRevenueRecordCreateDto,
    );
    newRecord = await this.companyDistrictRevenueRecordRepo.save(newRecord);
    return newRecord;
  }

  /**
   * 기록 업데이트
   * @param id
   * @param companyDistrictRevenueRecordUpdateDto
   */
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
