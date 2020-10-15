import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import {
  NanudaDeliveryFounderConsultCreateDto,
  DeliveryFounderConsultListDto,
} from './dto';
import { DeliveryFounderConsult } from './delivery-founder-consult.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { B2CNanudaSlackNotificationService } from 'src/core/utils/b2c-nanuda-slack-notification.service';
import { PaginatedRequest, PaginatedResponse } from 'src/common';

@Injectable()
export class NanudaDeliveryFounderConsultService extends BaseService {
  constructor(
    @InjectRepository(DeliveryFounderConsult)
    private readonly deliveryFounderConsultRepo: Repository<
      DeliveryFounderConsult
    >,
    private readonly nanudaSlackNotificationService: B2CNanudaSlackNotificationService,
  ) {
    super();
  }

  /**
   * create new consult
   * @param nanudaDeliveryFounderConsultCreateDto
   */
  async create(
    nanudaDeliveryFounderConsultCreateDto: NanudaDeliveryFounderConsultCreateDto,
  ): Promise<DeliveryFounderConsult> {
    let newConsult = new DeliveryFounderConsult(
      nanudaDeliveryFounderConsultCreateDto,
    );
    newConsult = await this.deliveryFounderConsultRepo.save(newConsult);
    newConsult = await this.deliveryFounderConsultRepo
      .createQueryBuilder('deliveryFounderConsult')
      .CustomInnerJoinAndSelect([
        'deliverySpace',
        'availableTime',
        'nanudaUser',
      ])
      .leftJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .leftJoinAndSelect('companyDistrict.company', 'company')
      .where('deliveryFounderConsult.no = :no', { no: newConsult.no })
      .getOne();
    // slack notification
    await this.nanudaSlackNotificationService.deliveryFounderConsultAdded(
      newConsult,
    );
    return newConsult;
  }

  /**
   * find one for nanuda user
   * @param deliveryFounderConsultNo
   * @param nanudaUserNo
   */
  async findOne(
    deliveryFounderConsultNo: number,
    nanudaUserNo: number,
  ): Promise<DeliveryFounderConsult> {
    const consult = await this.deliveryFounderConsultRepo
      .createQueryBuilder('deliveryFounderConsult')
      .CustomInnerJoinAndSelect(['deliverySpace', 'availableTime'])
      .where('deliveryFounderConsult.no = :no', {
        no: deliveryFounderConsultNo,
      })
      .andWhere('deliveryFounderConsult.nanudaUserNo = :nanudaUserNo', {
        nanudaUserNo: nanudaUserNo,
      })
      .getOne();

    return consult;
  }

  /**
   * find all for user
   * @param deliveryFounderConsultListDto
   * @param pagination
   */
  async findAllForNanudaUser(
    deliveryFounderConsultListDto: DeliveryFounderConsultListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliveryFounderConsult>> {
    const qb = this.deliveryFounderConsultRepo
      .createQueryBuilder('deliveryFounderConsult')
      .CustomInnerJoinAndSelect(['deliverySpace'])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .AndWhereLike(
        'deliveryFounderConsult',
        'hopeFoodCategory',
        deliveryFounderConsultListDto.hopeFoodCategory,
        deliveryFounderConsultListDto.exclude('hopeFoodCategory'),
      )
      .AndWhereBetweenStartAndEndDate(
        deliveryFounderConsultListDto.started,
        deliveryFounderConsultListDto.ended,
        deliveryFounderConsultListDto.exclude('started'),
        deliveryFounderConsultListDto.exclude('ended'),
      )
      //   .where('nanudaUser.no = :nanudaUserNo', {
      //     nanudaUserNo: deliveryFounderConsultListDto.nanudaUserNo,
      //   })
      .WhereAndOrder(deliveryFounderConsultListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }
}
