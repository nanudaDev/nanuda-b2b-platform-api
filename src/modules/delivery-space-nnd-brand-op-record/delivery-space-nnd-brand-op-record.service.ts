import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { YN } from 'src/common';
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

  /**
   * 특정한 기록에 해당하는 브랜드 찾기
   * @param nndOpRecordNo
   */
  async findAllForRecord(
    nndOpRecordNo: number,
  ): Promise<DeliverySpaceNndBrandOpRecord[]> {
    const qb = await this.nndBrandRecordRepo
      .createQueryBuilder('nndBrandOpRecord')
      .CustomInnerJoinAndSelect(['brand'])
      .where('nndBrandOpRecord.nndOpRecordNo = :nndOpRecordNo', {
        nndOpRecordNo: nndOpRecordNo,
      })
      .getMany();

    return qb;
  }

  /**
   * update existing operating brand
   * @param nndOpRecordNo
   * @param nndBrandOpRecordNo
   */
  async updateOperatingBrand(
    nndOpRecordNo: number,
    nndBrandOpRecordNo: number,
  ): Promise<DeliverySpaceNndBrandOpRecord> {
    await this.nndBrandRecordRepo
      .createQueryBuilder()
      .update(DeliverySpaceNndBrandOpRecord)
      .set({
        isOperatedYn: YN.NO,
      })
      .where('nndOpRecordNo = :nndOpRecordNo', { nndOpRecordNo: nndOpRecordNo })
      .execute();

    let newOperatingBrand = await this.nndBrandRecordRepo.findOne(
      nndBrandOpRecordNo,
    );
    newOperatingBrand.isOperatedYn = YN.YES;
    return newOperatingBrand;
  }
}
