import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDto, BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { DeliverySpaceNndBrandOpRecord } from './delivery-space-nnd-brand-op-record.entity';

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

  async createBrandRecord(brandNos: number[], nndRecordNo: number) {
    const brandRecords = brandNos.map(async brandNo => {
      let brandRecord = new DeliverySpaceNndBrandOpRecord({brandNo: brandNo, nndOpRecordNo: nndRecordNo})
      brandRecord = await this.nndBrandRecordRepo.save(brandRecord)
    });

    return brandRecords
  }
}
