import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { DeliveryFounderConsultReply } from './delivery-founder-consult-reply.entity';
import { AdminDeliveryFounderConsultReplyCreateDto } from './dto';

@Injectable()
export class DeliveryFounderConsultReplyService extends BaseService {
  constructor(
    @InjectRepository(DeliveryFounderConsultReply)
    private readonly deliveryFounderConsultReplyRepo: Repository<
      DeliveryFounderConsultReply
    >,
    @InjectEntityManager() private readonly entityManager: EntityManager,
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
    adminDeliveryFounderConsultReplyCreateDto: AdminDeliveryFounderConsultReplyCreateDto,
    adminNo: number,
    req: Request,
  ): Promise<DeliveryFounderConsultReply> {
    let newReply = new DeliveryFounderConsultReply(
      adminDeliveryFounderConsultReplyCreateDto,
    );
    newReply.adminNo = adminNo;
    newReply = await this.deliveryFounderConsultReplyRepo.save(newReply);
    return newReply;
  }
}
