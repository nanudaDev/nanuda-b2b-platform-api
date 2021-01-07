import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { BaseService, COMPANY_USER } from 'src/core';
import { SmsNotificationService } from 'src/core/utils';
import { EntityManager, Repository } from 'typeorm';
import { CompanyUser } from '../company-user/company-user.entity';
import { DeliveryFounderConsult } from '../delivery-founder-consult/delivery-founder-consult.entity';
import { DeliveryFounderConsultListDto } from '../delivery-founder-consult/dto';
import { DeliveryFounderConsultReply } from './delivery-founder-consult-reply.entity';
import {
  AdminDeliveryFounderConsultReplyCreateDto,
  AdminDeliveryFounderConsultReplyListDto,
  DeliveryFounderConsultReplyCreateDto,
  DeliveryFounderConsultReplyListDto,
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
      .createQueryBuilder('deliveryConsult')
      .CustomInnerJoinAndSelect(['deliverySpace'])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      //   .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('deliveryConsult.no = :no', {
        no: deliveryFounderConsultNo,
      })
      .getOne();
    if (!checkConsult) {
      throw new NotFoundException();
    }
    // console.log(checkConsult);
    let newReply = new DeliveryFounderConsultReply(
      adminDeliveryFounderConsultReplyCreateDto,
    );
    newReply.adminNo = adminNo;
    newReply.deliveryFounderConsultNo = deliveryFounderConsultNo;
    newReply = await this.deliveryFounderConsultReplyRepo.save(newReply);
    const companyUser = await this.entityManager
      .getRepository(CompanyUser)
      .createQueryBuilder('companyUser')
      .where('companyUser.companyNo = :companyNo', {
        companyNo: checkConsult.deliverySpace.companyDistrict.companyNo,
      })
      .andWhere('companyUser.authCode = :authCode', {
        authCode: COMPANY_USER.ADMIN_COMPANY_USER,
      })
      .getOne();
    //   send sms notification
    await this.smsNotificationService.sendConsultReplyMessage(
      companyUser.phone,
      newReply,
      req,
    );
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
    deliveryFounderConsultReplyNo: number,
    req: Request,
  ): Promise<DeliveryFounderConsultReply> {
    let updateReply = await this.deliveryFounderConsultReplyRepo.findOne({
      where: {
        deliveryFounderConsultNo: deliveryFounderConsultNo,
        no: deliveryFounderConsultReplyNo,
      },
    });
    updateReply.desc = adminDeliveryFounderConsultReplyCreateDto.desc;
    if (updateReply.adminNo !== adminNo) {
      updateReply.adminNo = adminNo;
    }
    updateReply.isUpdatedYn = YN.YES;
    updateReply = await this.deliveryFounderConsultReplyRepo.save(updateReply);
    return updateReply;
  }

  /**
   * find all
   * @param deliveryFounderConsultNo
   * @param adminDeliveryFounderConsultReplyListDto
   * @param pagination
   */
  async findAllForAdmin(
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

  /**
   * find all for admin
   * @param deliveryFounderConsultNo
   * @param deliveryFounderConsultReplyListDto
   * @param pagination
   */
  async findAll(
    deliveryFounderConsultNo: number,
    deliveryFounderConsultReplyListDto: DeliveryFounderConsultReplyListDto,
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
        deliveryFounderConsultReplyListDto.companyUserName,
        deliveryFounderConsultReplyListDto.exclude('companyUserName'),
      )
      .AndWhereLike(
        'admin',
        'name',
        deliveryFounderConsultReplyListDto.adminName,
        deliveryFounderConsultReplyListDto.exclude('adminName'),
      )
      .WhereAndOrder(deliveryFounderConsultReplyListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * create for company user
   * @param deliveryFounderConsultNo
   * @param companyUserNo
   * @param deliveryFounderConsultReplyCreateDto
   */
  async createForCompanyUser(
    deliveryFounderConsultNo: number,
    companyUserNo: number,
    deliveryFounderConsultReplyCreateDto: DeliveryFounderConsultReplyCreateDto,
  ): Promise<DeliveryFounderConsultReply> {
    const checkConsult = await this.entityManager
      .getRepository(DeliveryFounderConsult)
      .findOne(deliveryFounderConsultNo);
    if (!checkConsult) {
      throw new NotFoundException();
    }
    let newReply = new DeliveryFounderConsultReply(
      deliveryFounderConsultReplyCreateDto,
    );
    newReply.companyUserNo = companyUserNo;
    newReply.deliveryFounderConsultNo = deliveryFounderConsultNo;
    newReply = await this.deliveryFounderConsultReplyRepo.save(newReply);
    return newReply;
  }
}
