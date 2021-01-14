import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { DeliverySpaceNndOpRecord } from './delivery-space-nnd-op-record.entity';
import { AdminDeliverySpaceNndOpRecordCreateDto } from './dto';

@Injectable()
export class DeliverySpaceNndOpRecordService extends BaseService {
  constructor(
    @InjectRepository(DeliverySpaceNndOpRecord)
    private readonly nndRecordRepo: Repository<DeliverySpaceNndOpRecord>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * find all
   * @param deliverySpaceNo
   * @param pagination
   */
  async findAll(
    deliverySpaceNo: number,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliverySpaceNndOpRecord>> {
    const qb = this.nndRecordRepo
      .createQueryBuilder('nndRecord')
      .CustomLeftJoinAndSelect(['nndBrandRecord'])
      .where('nndRecord.deliverySpaceNo = :deliverySpaceNo', {
        deliverySpaceNo: deliverySpaceNo,
      })
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * create new delivery space operating record
   * @param adminDeliverySpaceNndRecordCreateDto
   */
  async createRecord(
    adminDeliverySpaceNndRecordCreateDto: AdminDeliverySpaceNndOpRecordCreateDto,
  ): Promise<DeliverySpaceNndOpRecord> {
    let newRecord = new DeliverySpaceNndOpRecord(
      adminDeliverySpaceNndRecordCreateDto,
    );
    newRecord = await this.nndRecordRepo.save(newRecord);
    return newRecord;
  }
}
