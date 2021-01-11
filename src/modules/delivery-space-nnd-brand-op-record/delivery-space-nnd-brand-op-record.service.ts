import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDto, BaseService } from 'src/core';
import { Repository } from 'typeorm';

@Injectable()
export class DeliverySpaceNndBrandOpRecord extends BaseService {
  constructor(
    @InjectRepository(DeliverySpaceNndBrandOpRecord)
    private readonly nndBrandRecordRepo: Repository<
      DeliverySpaceNndBrandOpRecord
    >,
  ) {
    super();
  }

  async createBrandRecord(brandNos: number[], nndRecordNo: number) {
    brandNos.map(async brandNo => {});
  }
}
