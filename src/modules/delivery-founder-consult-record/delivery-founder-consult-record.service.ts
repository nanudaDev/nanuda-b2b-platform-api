import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ORDER_BY_VALUE,
  PaginatedRequest,
  PaginatedResponse,
} from 'src/common';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { DeliveryFounderConsultRecord } from './delivery-founder-consult-record.entity';

@Injectable()
export class DeliveryFounderConsultRecordService extends BaseService {
  constructor(
    @InjectRepository(DeliveryFounderConsultRecord)
    private readonly deliveryFounderConsulltRecordRepo: Repository<
      DeliveryFounderConsultRecord
    >,
  ) {
    super();
  }

  /**
   * find records
   * @param deliveryFounderConsultNo
   * @param pagination
   */
  async findForConsult(
    deliveryFounderConsultNo: number,
  ): Promise<DeliveryFounderConsultRecord[]> {
    const qb = this.deliveryFounderConsulltRecordRepo
      .createQueryBuilder('record')
      .CustomInnerJoinAndSelect(['prevDeliverySpace', 'newDeliverySpace'])
      .innerJoinAndSelect(
        'prevDeliverySpace.companyDistrict',
        'prevCompanyDistrict',
      )
      .innerJoinAndSelect('prevCompanyDistrict.company', 'prevCompany')
      .innerJoinAndSelect(
        'newDeliverySpace.companyDistrict',
        'newCompanyDistrict',
      )
      .innerJoinAndSelect('newCompanyDistrict.company', 'newCompany')
      .where('record.deliveryFounderConsultNo = :deliveryFounderConsultNo', {
        deliveryFounderConsultNo: deliveryFounderConsultNo,
      })
      .orderBy('record.no', ORDER_BY_VALUE.DESC)
      .getMany();

    return qb;
  }
}
