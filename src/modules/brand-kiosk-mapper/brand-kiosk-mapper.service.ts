import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { YN } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { PaymentList } from '../payment-list/payment-list.entity';
import { BrandKioskMapper } from './brand-kiosk-mapper.entity';
import { AdminBrandKioskMapperDto } from './dto';

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
  async findRevenueForBrand(
    adminBrandKioskMapperDto: AdminBrandKioskMapperDto,
  ) {
    if (!adminBrandKioskMapperDto.started) {
      adminBrandKioskMapperDto.started = new Date();
    }
    const qb = await this.brandKioskMapperRepo
      .createQueryBuilder('brandKioskMapper')
      .where('brandKioskMapper.brandNo = :brandNo', {
        brandNo: adminBrandKioskMapperDto.brandNo,
      })
      .select(['brandKioskMapper.kioskNo'])
      .getMany();
    const ids = [];
    qb.map(id => {
      ids.push(id.kioskNo);
    });

    console.log(ids);
    if (ids && ids.length > 0) {
      const qb2 = await this.kitchenEntityManager
        .getRepository(PaymentList)
        .createQueryBuilder('paymentList')
        .CustomLeftJoinAndSelect(['nanudaKitchenMaster'])
        .where('paymentList.cardCancelFl = :cardCancelFl', {
          cardCancelFl: YN.NO,
        })
        .IN('nanudaNo', ids)
        .AndWhereBetweenStartAndEndDate(
          adminBrandKioskMapperDto.started,
          adminBrandKioskMapperDto.ended,
        )
        .groupBy('paymentList.nanudaNo')
        .select('SUM(paymentList.totalAmount)', 'sum')
        .addSelect('paymentList.nanudaKitchenMaster', 'nanudaNo')
        .addSelect('nanudaKitchenMaster.nanudaName', 'nanudaName')
        .getRawMany();

      return qb2;
    } else {
      return null;
    }
  }
}
