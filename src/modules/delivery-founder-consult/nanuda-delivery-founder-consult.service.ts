import { Injectable } from '@nestjs/common';
import {
  APPROVAL_STATUS,
  BaseService,
  COMPANY_USER,
  FOUNDER_CONSULT,
  SPACE_TYPE,
} from 'src/core';
import {
  NanudaDeliveryFounderConsultCreateDto,
  DeliveryFounderConsultListDto,
  WithoutLoginDeliveryFounderConsultCreateDto,
} from './dto';
import { DeliveryFounderConsult } from './delivery-founder-consult.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { B2CNanudaSlackNotificationService } from 'src/core/utils/b2c-nanuda-slack-notification.service';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { NanudaSmsNotificationService } from 'src/core/utils';
import { Request } from 'express';
import { Admin } from '../admin';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { CompanyUser } from '../company-user/company-user.entity';

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

  /**
   * create without nanuda user login and bulk insert
   * @param withoutLoginCreateDto
   */
  async createForNanudaUserWithoutLogin(
    withoutLoginCreateDto: WithoutLoginDeliveryFounderConsultCreateDto,
    req?: Request,
  ) {
    if (
      withoutLoginCreateDto.phone &&
      withoutLoginCreateDto.phone.includes('-')
    ) {
      withoutLoginCreateDto.phone = withoutLoginCreateDto.phone.replace(
        /-/g,
        '',
      );
    }
    const checkIfUserExists = await this.entityManager
      .getRepository(NanudaUser)
      .findOne({
        where: {
          name: withoutLoginCreateDto.name,
          phone: withoutLoginCreateDto.phone,
        },
      });
    if (!checkIfUserExists) {
      let newUser = new NanudaUser();
      newUser.phone = withoutLoginCreateDto.phone;
      newUser.name = withoutLoginCreateDto.name;
      newUser.serviceYn = YN.NO;
      newUser.marketYn = YN.NO;
      newUser = await this.entityManager
        .getRepository(NanudaUser)
        .save(newUser);
      withoutLoginCreateDto.nanudaUserNo = newUser.no;
    } else {
      withoutLoginCreateDto.nanudaUserNo = checkIfUserExists.no;
    }

    // create delivery founder consults as a cart
    // need new slack and sms messages
    const createDeliveryFounderConsults = await this.entityManager.transaction(
      async entityManager => {
        const newConsults = [];
        await Promise.all(
          withoutLoginCreateDto.deliverySpaceNos.map(deliverySpaceNo => {
            const newConsult = new DeliveryFounderConsult();
            newConsult.nanudaUserNo = withoutLoginCreateDto.nanudaUserNo;
            newConsult.deliverySpaceNo = deliverySpaceNo;
            newConsult.hopeTime = withoutLoginCreateDto.hopeTime;
            newConsult.status = FOUNDER_CONSULT.F_DIST_COMPLETE;
            newConsult.isConsultedYn = YN.NO;
            newConsults.push(newConsult);
          }),
        );
        // delivery founder consult ids
        const deliveryFounderConsultIds = [];
        await Promise.all(
          newConsults.map(async consult => {
            const newConsult = await this.deliveryFounderConsultRepo.save(
              consult,
            );
            deliveryFounderConsultIds.push(newConsult.no);
          }),
        );
        // send information to applied user
        // TODO: Compose message to send to end user
        const deliverySpaces = await entityManager
          .getRepository(DeliverySpace)
          .createQueryBuilder('deliverySpace')
          .CustomInnerJoinAndSelect(['companyDistrict'])
          .innerJoinAndSelect('companyDistrict.company', 'company')
          .AndWhereIn(
            'deliverySpace',
            'no',
            withoutLoginCreateDto.deliverySpaceNos,
          )
          .getMany();

        let companyIds = [];
        deliverySpaces.map(deliverySpace => {
          companyIds.push({
            companyNo: deliverySpace.companyDistrict.companyNo,
            // districtName: deliverySpace.companyDistrict.nameKr,
          });
        });

        // remove duplicates
        companyIds = this.__remove_duplicate(companyIds, 'companyNo');
        // send information to company
        await Promise.all(
          companyIds.map(async companyId => {
            const companyDistricts = await this.deliveryFounderConsultRepo
              .createQueryBuilder('deliveryFounderConsult')
              .CustomInnerJoinAndSelect(['deliverySpace', 'nanudaUser'])
              .innerJoinAndSelect(
                'deliverySpace.companyDistrict',
                'companyDistrict',
              )
              .innerJoinAndSelect('companyDistrict.company', 'company')
              // .leftJoinAndSelect('company.companyUsers', 'companyUsers')
              .where('company.no = :no', { no: companyId.companyNo })
              .AndWhereIn(
                'deliveryFounderConsult',
                'no',
                deliveryFounderConsultIds,
              )
              .getMany();

            const masterCompanyUser = await entityManager
              .getRepository(CompanyUser)
              .findOne({
                where: {
                  companyNo: companyId.companyNo,
                  companyUserStatus: APPROVAL_STATUS,
                  authCode: COMPANY_USER.ADMIN_COMPANY_USER,
                },
              });
            console.log(masterCompanyUser);
            // TODO: Compose sms message to send to company user
            // await this.smsNotificationService.notifyCompanyAdmin
          }),
        );

        // send notification to admins
      },
    );

    return createDeliveryFounderConsults;
  }

  private __remove_duplicate(array: any[], key: string) {
    return [...new Map(array.map(item => [item[key], item])).values()];
  }
}
