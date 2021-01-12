import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDto, BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { DeliverySpaceNndBrandOpRecord } from './delivery-space-nnd-brand-op-record.entity';
import { DeliverySpaceNndBrandOpRecordDto } from './dto';

@Injectable()
export class DeliverySpaceNndBrandOpRecordService extends BaseService {
  constructor(
    @InjectRepository(DeliverySpaceNndBrandOpRecord)
    private readonly nndBrandRecordRepo: Repository<
      DeliverySpaceNndBrandOpRecord
    >,
  ) {
    super();
  }

  /**
   * create brand records
   * @param nndBrandRecordDto
   * @param nndOpRecordNo
   */
  async createBrandRecord(
    nndBrandRecordDto: DeliverySpaceNndBrandOpRecordDto[],
    nndOpRecordNo: number,
  ) {
    const brandRecords = nndBrandRecordDto.map(async dto => {
      let brandRecord = new DeliverySpaceNndBrandOpRecord(dto);
      brandRecord.nndOpRecordNo = nndOpRecordNo;
      brandRecord = await this.nndBrandRecordRepo.save(brandRecord);
    });

    return brandRecords;
  }
}
