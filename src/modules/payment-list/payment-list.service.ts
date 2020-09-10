import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentList } from './payment-list.entity';
import { Repository } from 'typeorm';
import { AdminPaymentListDto } from './dto';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';

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
      .CustomLeftJoinAndSelect(['nanudaKitchenMaster'])
      .AndWhereLike(
        'nanudaKitchenMaster',
        'nanudaName',
        adminPaymentListDto.nanudaKitchenMasterName,
        adminPaymentListDto.exclude('nanudaKitchenMasterName'),
      )
      .AndWhereLike(
        'paymentList',
        'totalAmount',
        adminPaymentListDto.totalAmount,
        adminPaymentListDto.exclude('totalAmount'),
      )
      .AndWhereLike(
        'paymentList',
        'businessNo',
        adminPaymentListDto.businessNo,
        adminPaymentListDto.exclude('businessNo'),
      )
      .AndWhereLike(
        'paymentList',
        'shopName',
        adminPaymentListDto.shopName,
        adminPaymentListDto.exclude('shopName'),
      );
    if (adminPaymentListDto.started) {
      qb.AndWhereBetweenStartAndEndDate(
        adminPaymentListDto.started,
        null,
        adminPaymentListDto.exclude('started'),
      );
    }
    qb.WhereAndOrder(adminPaymentListDto);
    qb.Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find one for payment list
   * @param paymentListNo
   */
  async findOne(paymentListNo: number): Promise<PaymentList> {
    const qb = await this.paymentListRepo
      .createQueryBuilder('paymentList')
      .CustomLeftJoinAndSelect(['nanudaKitchenMaster'])
      .where('paymentList.paymentListNo = :paymentListNo', {
        paymentListNo: paymentListNo,
      })
      .getOne();

    return qb;
  }

  /**
   * get total revenue
   * @param adminPaymentListDto
   */
  async getTotalRevenue(adminPaymentListDto: AdminPaymentListDto) {
    const qb = this.paymentListRepo
      .createQueryBuilder('paymentList')
      //   AndWhereLike...
      .CustomLeftJoinAndSelect(['nanudaKitchenMaster'])
      .where('paymentList.cardCancelFl = :cardCancelFl', {
        cardCancelFl: YN.NO,
      })
      .AndWhereLike(
        'nanudaKitchenMaster',
        'nanudaName',
        adminPaymentListDto.nanudaKitchenMasterName,
        adminPaymentListDto.exclude('nanudaKitchenMasterName'),
      )
      .AndWhereLike(
        'paymentList',
        'totalAmount',
        adminPaymentListDto.totalAmount,
        adminPaymentListDto.exclude('totalAmount'),
      )
      .AndWhereBetweenStartAndEndDate(
        adminPaymentListDto.started,
        null,
        adminPaymentListDto.exclude('started'),
      )
      .select('SUM(paymentList.totalAmount)', 'sum')
      .getRawOne();
    return await qb;
  }
}
