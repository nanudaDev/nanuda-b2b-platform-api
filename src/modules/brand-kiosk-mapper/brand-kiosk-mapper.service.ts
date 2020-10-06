import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { PaymentList } from '../payment-list/payment-list.entity';
import { BrandKioskMapper } from './brand-kiosk-mapper.entity';

@Injectable()
export class BrandKioskMapperService extends BaseService {
  constructor(
    @InjectRepository(BrandKioskMapper)
    private readonly brandKioskMapperRepo: Repository<BrandKioskMapper>,
    @InjectEntityManager('kitchen')
    private readonly kitchenEntityManager: EntityManager,
  ) {
    super();
  }

  /**
   * get revenue for each district by brand
   * TODO: group by district and show revenue
   * @param brandNo
   */
  async findRevenueForBrand(brandNo: number) {
    const qb = await this.brandKioskMapperRepo
      .createQueryBuilder('brandKioskMapper')
      .where('brandKioskMapper.brandNo = :brandNo', { brandNo: brandNo })
      .select(['brandKioskMapper.kioskNo'])
      .getMany();

    const ids = [];
    qb.map(id => {
      ids.push(id.kioskNo);
    });

    const qb2 = await this.kitchenEntityManager
      .getRepository(PaymentList)
      .createQueryBuilder('paymentList')
      .CustomLeftJoinAndSelect(['nanudaKitchenMaster'])
      .IN('nanudaNo', ids)
      .groupBy('paymentList.nanudaNo')
      .select('SUM(paymentList.totalAmount)', 'sum')
      .addSelect('paymentList.nanudaKitchenMaster', 'nanudaNo')
      .addSelect('nanudaKitchenMaster.nanudaName', 'nanudaName')
      .getRawMany();

    return qb2;
  }
}
