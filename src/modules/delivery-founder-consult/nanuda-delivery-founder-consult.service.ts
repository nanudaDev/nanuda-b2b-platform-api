import { Injectable } from '@nestjs/common';
import { BaseService, SPACE_TYPE } from 'src/core';
import {
  NanudaDeliveryFounderConsultCreateDto,
  DeliveryFounderConsultListDto,
} from './dto';
import { DeliveryFounderConsult } from './delivery-founder-consult.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { B2CNanudaSlackNotificationService } from 'src/core/utils/b2c-nanuda-slack-notification.service';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { NanudaSmsNotificationService } from 'src/core/utils';
import { Request } from 'express';
import { Admin } from '../admin';

@Injectable()
export class NanudaDeliveryFounderConsultService extends BaseService {
  constructor(
    @InjectRepository(DeliveryFounderConsult)
    private readonly deliveryFounderConsultRepo: Repository<
      DeliveryFounderConsult
    >,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly nanudaSlackNotificationService: B2CNanudaSlackNotificationService,
    private readonly nanudaSmsNotificationService: NanudaSmsNotificationService,
  ) {
    super();
  }

  /**
   * create new consult
   * @param nanudaDeliveryFounderConsultCreateDto
   */
  async create(
    nanudaDeliveryFounderConsultCreateDto: NanudaDeliveryFounderConsultCreateDto,
    req: Request,
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
    await this.nanudaSmsNotificationService.sendDeliveryFounderConsultMessage(
      newConsult,
      req,
    );
    // 담당자엑 문자하기
    const admins = await this.entityManager
      .getRepository(Admin)
      .find({ where: { spaceTypeNo: SPACE_TYPE.ONLY_DELIVERY } });
    await this.nanudaSmsNotificationService.alertAdminNotification(
      newConsult,
      admins,
      req,
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
