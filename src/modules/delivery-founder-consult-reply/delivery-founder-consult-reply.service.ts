import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseService } from 'src/core';
import { SmsNotificationService } from 'src/core/utils';
import { EntityManager, Repository } from 'typeorm';
import { DeliveryFounderConsult } from '../delivery-founder-consult/delivery-founder-consult.entity';
import { DeliveryFounderConsultReply } from './delivery-founder-consult-reply.entity';
import {
  AdminDeliveryFounderConsultReplyCreateDto,
  AdminDeliveryFounderConsultReplyListDto,
} from './dto';

@Injectable()
export class DeliveryFounderConsultReplyService extends BaseService {
  constructor(
    @InjectRepository(DeliveryFounderConsultReply)
    private readonly deliveryFounderConsultReplyRepo: Repository<
      DeliveryFounderConsultReply
    >,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly smsNotificationService: SmsNotificationService,
  ) {
    super();
  }

  /**
   *
   * @param adminDeliveryFounderConsultReplyCreateDto
   * @param adminNo
   * @param req
   */
  async createForAdmin(
    deliveryFounderConsultNo: number,
    adminDeliveryFounderConsultReplyCreateDto: AdminDeliveryFounderConsultReplyCreateDto,
    adminNo: number,
    req: Request,
  ): Promise<DeliveryFounderConsultReply> {
    const checkConsult = await this.entityManager
      .getRepository(DeliveryFounderConsult)
      .findOne(deliveryFounderConsultNo);
    if (!checkConsult) {
      throw new NotFoundException();
    }
    let newReply = new DeliveryFounderConsultReply(
      adminDeliveryFounderConsultReplyCreateDto,
    );
    newReply.adminNo = adminNo;
    newReply.deliveryFounderConsultNo = deliveryFounderConsultNo;
    newReply = await this.deliveryFounderConsultReplyRepo.save(newReply);
    return newReply;
  }

  /**
   * update reply for admin
   * @param adminDeliveryFounderConsultReplyCreateDto
   * @param adminNo
   * @param deliveryFounderConsultNo
   * @param req
   */
  async updateForAdmin(
    adminDeliveryFounderConsultReplyCreateDto: AdminDeliveryFounderConsultReplyCreateDto,
    adminNo: number,
    deliveryFounderConsultNo: number,
    req: Request,
  ): Promise<DeliveryFounderConsultReply> {
    let updateReply = await this.deliveryFounderConsultReplyRepo.findOne({
      where: { deliveryFounderConsultNo: deliveryFounderConsultNo },
    });
    updateReply.desc = adminDeliveryFounderConsultReplyCreateDto.desc;
    if (updateReply.adminNo !== adminNo) {
      updateReply.adminNo = adminNo;
    }
    updateReply = await this.deliveryFounderConsultReplyRepo.save(updateReply);
    return updateReply;
  }

  /**
   * find all
   * @param deliveryFounderConsultNo
   * @param adminDeliveryFounderConsultReplyListDto
   * @param pagination
   */
  async findAll(
    deliveryFounderConsultNo: number,
    adminDeliveryFounderConsultReplyListDto: AdminDeliveryFounderConsultReplyListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliveryFounderConsultReply>> {
    const qb = this.deliveryFounderConsultReplyRepo
      .createQueryBuilder('deliveryFounderConsultReply')
      .CustomInnerJoinAndSelect(['deliveryFounderConsult'])
      .CustomLeftJoinAndSelect(['companyUser', 'admin'])
      .where(
        'deliveryFounderConsultReply.deliveryFounderConsultNo = :consultNo',
        { consultNo: deliveryFounderConsultNo },
      )
      .AndWhereLike(
        'companyUser',
        'name',
        adminDeliveryFounderConsultReplyListDto.companyUserName,
        adminDeliveryFounderConsultReplyListDto.exclude('companyUserName'),
      )
      .AndWhereLike(
        'admin',
        'name',
        adminDeliveryFounderConsultReplyListDto.adminName,
        adminDeliveryFounderConsultReplyListDto.exclude('adminName'),
      )
      .WhereAndOrder(adminDeliveryFounderConsultReplyListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }
}
