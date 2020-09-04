import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentList } from './payment-list.entity';
import { Repository } from 'typeorm';
import { AdminPaymentListDto } from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';

@Injectable()
export class PaymentListService extends BaseService {
  constructor(
    @InjectRepository(PaymentList, 'kitchen')
    private readonly paymentListRepo: Repository<PaymentList>,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminPaymentListDto
   * @param pagination
   */
  async findAll(
    adminPaymentListDto: AdminPaymentListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<PaymentList>> {
    const qb = this.paymentListRepo
      .createQueryBuilder('paymentList')
      //   AndWhereLike...
      .WhereAndOrder(adminPaymentListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }
}
