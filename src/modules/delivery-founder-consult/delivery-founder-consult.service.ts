import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { DeliveryFounderConsult } from './delivery-founder-consult.entity';
import { Repository, EntityManager } from 'typeorm';
import {
  BaseService,
  FOUNDER_CONSULT,
  BaseDto,
  B2B_FOUNDER_CONSULT,
  SPACE_TYPE,
  APPROVAL_STATUS,
  COMPANY_USER,
} from '../../core';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { NanudaUserUpdateHistory } from '../nanuda-user-update-history/nanuda-user-update-history.entity';
import {
  NanudaSlackNotificationService,
  SmsNotificationService,
} from 'src/core/utils';
import {
  AdminDeliveryFounderConsultListDto,
  AdminDeliveryFounderConsultUpdateDto,
  DeliveryFounderConsultListDto,
  AdminDeliveryFounderConsultCreateDto,
  DeliveryFounderConsultUpdateDto,
} from './dto';
import { DeliverySpaceService } from '../delivery-space/delivery-space.service';
import { DeliveryFounderConsultContract } from '../delivery-founder-consult-contract/delivery-founder-consult-contract.entity';
import { Brand } from '../brand/brand.entity';
import { Request } from 'express';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { CompanyDistrictPromotionMapper } from '../company-district-promotion-mapper/company-district-promotion-mapper.entity';
import { CompanyDistrictPromotion } from '../company-district-promotion/company-district-promotion.entity';
import { DeliveryFounderConsultRecord } from '../delivery-founder-consult-record/delivery-founder-consult-record.entity';
import { CompanyUser } from '../company-user/company-user.entity';

@Injectable()
export class DeliveryFounderConsultService extends BaseService {
  constructor(
    private readonly deliverySpaceService: DeliverySpaceService,
    @InjectRepository(DeliveryFounderConsult)
    private readonly deliveryFounderConsultRepo: Repository<
      DeliveryFounderConsult
    >,
    @InjectRepository(NanudaUser)
    private readonly nanudaUserRepo: Repository<NanudaUser>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly nanudaSlackNotificationService: NanudaSlackNotificationService,
    private readonly smsNotificationService: SmsNotificationService,
  ) {
    super();
  }

  // admin services

  /**
   * find for admin
   * @param adminDeliveryFounderConsultListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminDeliveryFounderConsultListDto: AdminDeliveryFounderConsultListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliveryFounderConsult>> {
    if (
      adminDeliveryFounderConsultListDto.phone &&
      adminDeliveryFounderConsultListDto.phone.includes('-')
    ) {
      adminDeliveryFounderConsultListDto.phone = adminDeliveryFounderConsultListDto.phone.replace(
        /-/g,
        '',
      );
    }
    const qb = this.deliveryFounderConsultRepo
      .createQueryBuilder('deliveryConsult')
      .CustomLeftJoinAndSelect([
        'deliverySpace',
        'codeManagement',
        'availableTime',
        'nanudaUser',
        'admin',
      ])
      .leftJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .leftJoinAndSelect('deliverySpace.contracts', 'contracts')
      .leftJoinAndSelect('companyDistrict.company', 'company')
      .leftJoinAndSelect('nanudaUser.genderInfo', 'genderInfo')
      .AndWhereLike(
        'companyDistrict',
        'nameKr',
        adminDeliveryFounderConsultListDto.companyDistrictNameKr,
        adminDeliveryFounderConsultListDto.exclude('companyDistrictNameKr'),
      )
      .AndWhereLike(
        'companyDistrict',
        'nameEng',
        adminDeliveryFounderConsultListDto.companyDistrictNameEng,
        adminDeliveryFounderConsultListDto.exclude('companyDistrictNameEng'),
      )
      .AndWhereLike(
        'company',
        'nameKr',
        adminDeliveryFounderConsultListDto.companyNameKr,
        adminDeliveryFounderConsultListDto.exclude('companyNameKr'),
      )
      .AndWhereLike(
        'company',
        'nameEng',
        adminDeliveryFounderConsultListDto.companyNameEng,
        adminDeliveryFounderConsultListDto.exclude('companyNameEng'),
      )
      .AndWhereLike(
        'nanudaUser',
        'phone',
        adminDeliveryFounderConsultListDto.phone,
        adminDeliveryFounderConsultListDto.exclude('phone'),
      )
      .AndWhereLike(
        'nanudaUser',
        'name',
        adminDeliveryFounderConsultListDto.nanudaUserName,
        adminDeliveryFounderConsultListDto.exclude('nanudaUserName'),
      )
      .AndWhereLike(
        'companyDistrict',
        'address',
        adminDeliveryFounderConsultListDto.address,
        adminDeliveryFounderConsultListDto.exclude('address'),
      )
      .AndWhereLike(
        'admin',
        'name',
        adminDeliveryFounderConsultListDto.adminUserName,
        adminDeliveryFounderConsultListDto.exclude('adminUserName'),
      )
      .AndWhereLike(
        'deliveryConsult',
        'hopeFoodCategory',
        adminDeliveryFounderConsultListDto.hopeFoodCategory,
        adminDeliveryFounderConsultListDto.exclude('hopeFoodCategory'),
      )
      .AndWhereEqual(
        'company',
        'no',
        adminDeliveryFounderConsultListDto.companyNo,
        adminDeliveryFounderConsultListDto.exclude('companyNo'),
      )
      .AndWhereEqual(
        'deliverySpace',
        'no',
        adminDeliveryFounderConsultListDto.deliverySpaceNo,
        adminDeliveryFounderConsultListDto.exclude('deliverySpaceNo'),
      )
      .AndWhereEqual(
        'nanudaUser',
        'gender',
        adminDeliveryFounderConsultListDto.gender,
        adminDeliveryFounderConsultListDto.exclude('gender'),
      )
      .AndWhereEqual(
        'admin',
        'no',
        adminDeliveryFounderConsultListDto.adminNo,
        adminDeliveryFounderConsultListDto.exclude('adminNo'),
      )
      // .AndWhereBetweenOpenedAt(
      //   adminDeliveryFounderConsultListDto.startDate,
      //   adminDeliveryFounderConsultListDto.endDate,
      //   adminDeliveryFounderConsultListDto.exclude('startDate'),
      //   adminDeliveryFounderConsultListDto.exclude('endDate'),
      // )
      // if (adminDeliveryFounderConsultListDto.startDate) {
      //   qb.AndWhereBetweenStartAndEndDate(
      //     adminDeliveryFounderConsultListDto.startDate,
      //     adminDeliveryFounderConsultListDto.endDate,
      //   );
      // } else {
      //   throw new BadRequestException({ message: 'Needs start date!' });
      // }
      .AndWhereBetweenStartAndEndDate(
        adminDeliveryFounderConsultListDto.started,
        adminDeliveryFounderConsultListDto.ended,
        adminDeliveryFounderConsultListDto.exclude('started'),
        adminDeliveryFounderConsultListDto.exclude('ended '),
      );
    qb.WhereAndOrder(adminDeliveryFounderConsultListDto);
    qb.Paginate(pagination);
    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * get excel data
   * @param adminDeliveryFounderConsultListDto
   */
  async excelExportJson(
    adminDeliveryFounderConsultListDto: AdminDeliveryFounderConsultListDto,
  ): Promise<DeliveryFounderConsult[]> {
    if (
      adminDeliveryFounderConsultListDto.phone &&
      adminDeliveryFounderConsultListDto.phone.includes('-')
    ) {
      adminDeliveryFounderConsultListDto.phone = adminDeliveryFounderConsultListDto.phone.replace(
        /-/g,
        '',
      );
    }
    const qb = this.deliveryFounderConsultRepo
      .createQueryBuilder('deliveryConsult')
      .CustomLeftJoinAndSelect([
        'deliverySpace',
        'codeManagement',
        'availableTime',
        'nanudaUser',
        'admin',
      ])
      .leftJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .leftJoinAndSelect('deliverySpace.contracts', 'contracts')
      .leftJoinAndSelect('companyDistrict.company', 'company')
      .leftJoinAndSelect('nanudaUser.genderInfo', 'genderInfo')
      .AndWhereLike(
        'companyDistrict',
        'nameKr',
        adminDeliveryFounderConsultListDto.companyDistrictNameKr,
        adminDeliveryFounderConsultListDto.exclude('companyDistrictNameKr'),
      )
      .AndWhereLike(
        'companyDistrict',
        'nameEng',
        adminDeliveryFounderConsultListDto.companyDistrictNameEng,
        adminDeliveryFounderConsultListDto.exclude('companyDistrictNameEng'),
      )
      .AndWhereLike(
        'company',
        'nameKr',
        adminDeliveryFounderConsultListDto.companyNameKr,
        adminDeliveryFounderConsultListDto.exclude('companyNameKr'),
      )
      .AndWhereLike(
        'company',
        'nameEng',
        adminDeliveryFounderConsultListDto.companyNameEng,
        adminDeliveryFounderConsultListDto.exclude('companyNameEng'),
      )
      .AndWhereLike(
        'nanudaUser',
        'phone',
        adminDeliveryFounderConsultListDto.phone,
        adminDeliveryFounderConsultListDto.exclude('phone'),
      )
      .AndWhereLike(
        'nanudaUser',
        'name',
        adminDeliveryFounderConsultListDto.nanudaUserName,
        adminDeliveryFounderConsultListDto.exclude('nanudaUserName'),
      )
      .AndWhereLike(
        'companyDistrict',
        'address',
        adminDeliveryFounderConsultListDto.address,
        adminDeliveryFounderConsultListDto.exclude('address'),
      )
      .AndWhereLike(
        'admin',
        'name',
        adminDeliveryFounderConsultListDto.adminUserName,
        adminDeliveryFounderConsultListDto.exclude('adminUserName'),
      )
      .AndWhereLike(
        'deliveryConsult',
        'hopeFoodCategory',
        adminDeliveryFounderConsultListDto.hopeFoodCategory,
        adminDeliveryFounderConsultListDto.exclude('hopeFoodCategory'),
      )
      .AndWhereEqual(
        'company',
        'no',
        adminDeliveryFounderConsultListDto.companyNo,
        adminDeliveryFounderConsultListDto.exclude('companyNo'),
      )
      .AndWhereEqual(
        'deliverySpace',
        'no',
        adminDeliveryFounderConsultListDto.deliverySpaceNo,
        adminDeliveryFounderConsultListDto.exclude('deliverySpaceNo'),
      )
      .AndWhereEqual(
        'nanudaUser',
        'gender',
        adminDeliveryFounderConsultListDto.gender,
        adminDeliveryFounderConsultListDto.exclude('gender'),
      )
      // .AndWhereBetweenOpenedAt(
      //   adminDeliveryFounderConsultListDto.startDate,
      //   adminDeliveryFounderConsultListDto.endDate,
      //   adminDeliveryFounderConsultListDto.exclude('startDate'),
      //   adminDeliveryFounderConsultListDto.exclude('endDate'),
      // )
      .WhereAndOrder(adminDeliveryFounderConsultListDto);

    return await qb.getMany();
  }

  /**
   * find one for admin
   * @param deliveryFounderConsultNo
   */
  async findOneForAdmin(
    deliveryFounderConsultNo: number,
  ): Promise<DeliveryFounderConsult> {
    const consult = await this.deliveryFounderConsultRepo
      .createQueryBuilder('deliveryConsult')
      // .CustomInnerJoinAndSelect([
      //   'deliverySpace',
      //   'codeManagement',
      //   'availableTime',
      //   'companyDecisionStatusCode',
      // ])
      .CustomLeftJoinAndSelect([
        'nanudaUser',
        'admin',
        'companyUser',
        'deliverySpace',
        'codeManagement',
        'availableTime',
        'companyDecisionStatusCode',
      ])
      .leftJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .leftJoinAndSelect('deliverySpace.contracts', 'contracts')
      .leftJoinAndSelect('companyDistrict.company', 'company')
      .leftJoinAndSelect('deliverySpace.amenities', 'amenities')
      .leftJoinAndSelect(
        'deliverySpace.deliverySpaceOptions',
        'deliverySpaceOptions',
      )
      .leftJoinAndSelect('company.codeManagement', 'companyStatus')
      .leftJoinAndSelect('nanudaUser.genderInfo', 'genderInfo')
      .where('deliveryConsult.no = :no', { no: deliveryFounderConsultNo })
      .getOne();

    return consult;
  }

  /**
   * update for admin
   * @param deliveryFounderConsultNo
   * @param adminDeliveryFounderConsultUpdateDto
   */
  async updateForAdmin(
    deliveryFounderConsultNo: number,
    adminDeliveryFounderConsultUpdateDto: AdminDeliveryFounderConsultUpdateDto,
    req?: Request,
  ): Promise<DeliveryFounderConsult> {
    const deliveryFounderConsult = await this.entityManager.transaction(
      async entityManager => {
        let deliveryFounderConsult = await this.deliveryFounderConsultRepo
          .createQueryBuilder('deliveryConsult')
          .CustomInnerJoinAndSelect(['deliverySpace'])
          .innerJoinAndSelect(
            'deliverySpace.companyDistrict',
            'companyDistrict',
          )
          .innerJoinAndSelect('companyDistrict.company', 'company')
          .where('deliveryConsult.no = :no', { no: deliveryFounderConsultNo })
          .getOne();
        if (!deliveryFounderConsult) {
          throw new NotFoundException({
            message: '존재하지 않습니다.',
          });
        }
        deliveryFounderConsult = deliveryFounderConsult.set(
          adminDeliveryFounderConsultUpdateDto,
        );
        if (
          adminDeliveryFounderConsultUpdateDto.status ===
          FOUNDER_CONSULT.F_DIST_COMPLETE
        ) {
          deliveryFounderConsult.deliveredAt = new Date();
          // 문자 발송
          // find master account for company
          const user = await this.entityManager
            .getRepository(CompanyUser)
            .createQueryBuilder('companyUser')
            .where('companyUser.companyNo = :companyNo', {
              companyNo:
                deliveryFounderConsult.deliverySpace.companyDistrict.companyNo,
            })
            .andWhere('companyUser.authCode = :authCode', {
              authCode: COMPANY_USER.ADMIN_COMPANY_USER,
            })
            .getOne();
          // send message
          await this.smsNotificationService.sendConsultMessage(
            user.phone,
            deliveryFounderConsult.deliverySpace.companyDistrict.company.nameKr,
            deliveryFounderConsult.deliverySpace.companyDistrict.nameKr,
            req,
          );
        }
        deliveryFounderConsult = await entityManager.save(
          deliveryFounderConsult,
        );
        if (adminDeliveryFounderConsultUpdateDto.gender) {
          const nanudaUser = await this.nanudaUserRepo.findOne(
            deliveryFounderConsult.nanudaUserNo,
          );
          nanudaUser.gender = adminDeliveryFounderConsultUpdateDto.gender;
          await entityManager.save(nanudaUser);
          const nanudaUserUpdateHistory = new NanudaUserUpdateHistory(
            nanudaUser,
          );
          nanudaUserUpdateHistory.nanudaUserNo = nanudaUser.no;
          await entityManager.save(nanudaUserUpdateHistory);
        }
        // change delivery space no
        if (adminDeliveryFounderConsultUpdateDto.newDeliverySpaceNo) {
          // check if delivery space is ok
          const checkDeliverySpace = await entityManager
            .getRepository(DeliverySpace)
            .createQueryBuilder('deliverySpace')
            .CustomInnerJoinAndSelect(['companyDistrict'])
            .innerJoinAndSelect('companyDistrict.company', 'company')
            .where(
              'companyDistrict.companyDistrictStatus = :companyDistrictStatus',
              { companyDistrictStatus: APPROVAL_STATUS.APPROVAL },
            )
            .andWhere('company.companyStatus = :companyStatus', {
              companyStatus: APPROVAL_STATUS.APPROVAL,
            })
            .andWhere('deliverySpace.no = :no', {
              no: adminDeliveryFounderConsultUpdateDto.newDeliverySpaceNo,
            })
            .andWhere('deliverySpace.delYn', { delYn: YN.NO })
            .andWhere('deliverySpace.showYn', { showYn: YN.YES })
            .andWhere('deliverySpace.remainingCount > 0')
            .getOne();

          if (!checkDeliverySpace) {
            throw new BadRequestException('등록할 수 없는 공간입니다.');
          }
          // create new record of change
          let newRecord = new DeliveryFounderConsultRecord();
          newRecord.prevDeliverySpaceNo =
            deliveryFounderConsult.deliverySpaceNo;
          newRecord.deliveryFounderConsultNo = deliveryFounderConsult.no;
          newRecord.newDeliverySpaceNo =
            adminDeliveryFounderConsultUpdateDto.newDeliverySpaceNo;
          await entityManager.save(newRecord);
        }
        // do not need to check off gender anymore Friday 11/22/2020
        // const nanudaUser = await this.nanudaUserRepo.findOne(
        //   deliveryFounderConsult.nanudaUserNo,
        // );
        // if (
        //   !nanudaUser.gender &&
        //   adminDeliveryFounderConsultUpdateDto.status ===
        //     FOUNDER_CONSULT.F_DIST_COMPLETE
        // ) {
        //   throw new BadRequestException({
        //     message: '사용자 성별을 제시해주세요.',
        //     error: 400,
        //   });
        // }
        // when contracted
        if (
          adminDeliveryFounderConsultUpdateDto.companyDecisionStatus ===
          B2B_FOUNDER_CONSULT.B2B_F_CONTRACT_COMPLETE
        ) {
          let contract = await this.__create_contract(deliveryFounderConsult);
          contract = await entityManager.save(contract);
          await this.nanudaSlackNotificationService.completeContractNotification(
            await entityManager
              .getRepository(DeliveryFounderConsultContract)
              .createQueryBuilder('contract')
              .CustomInnerJoinAndSelect(['nanudaUser', 'deliverySpace'])
              .innerJoinAndSelect(
                'deliverySpace.companyDistrict',
                'companyDistrict',
              )
              .innerJoinAndSelect('companyDistrict.company', 'company')
              .where('contract.no = :no', { no: contract.no })
              .getOne(),
          );
        }
        return deliveryFounderConsult;
      },
    );
    return deliveryFounderConsult;
  }

  /**
   * create for admin
   * @param adminDeliveryFounderConsultCreateDto
   */
  async createForAdmin(
    adminDeliveryFounderConsultCreateDto: AdminDeliveryFounderConsultCreateDto,
  ): Promise<DeliveryFounderConsult> {
    let deliveryFounderConsult = new DeliveryFounderConsult(
      adminDeliveryFounderConsultCreateDto,
    );
    // check if user has gender
    const nanudaUser = await this.nanudaUserRepo.findOne(
      adminDeliveryFounderConsultCreateDto.nanudaUserNo,
    );
    // if (
    //   !nanudaUser.gender &&
    //   adminDeliveryFounderConsultCreateDto.status ===
    //     FOUNDER_CONSULT.F_DIST_COMPLETE
    // ) {
    //   throw new BadRequestException({
    //     message: '사용자 성별을 제시해주세요.',
    //     error: 400,
    //   });
    // }
    deliveryFounderConsult = await this.deliveryFounderConsultRepo.save(
      deliveryFounderConsult,
    );
    return await this.findOneForAdmin(deliveryFounderConsult.no);
  }

  /**
   * reverse read status
   * @param deliveryFounderConsultNo
   */
  async reverseReadStatus(
    deliveryFounderConsultNo: number,
  ): Promise<DeliveryFounderConsult> {
    let deliveryFounderConsult = await this.deliveryFounderConsultRepo.findOne(
      deliveryFounderConsultNo,
    );
    if (deliveryFounderConsult.viewCount === YN.NO) {
      throw new BadRequestException({
        message: '미열람 처리가 된 신청서입니다.',
      });
    }
    deliveryFounderConsult.viewCount = YN.NO;
    deliveryFounderConsult.companyUserNo = null;
    deliveryFounderConsult.openedAt = null;
    deliveryFounderConsult = await this.deliveryFounderConsultRepo.save(
      deliveryFounderConsult,
    );
    return deliveryFounderConsult;
  }

  // company service

  /**
   * find all for company user
   * @param companyNo
   * @param deliveryFounderConsultListDto
   * @param pagination
   */
  async findForCompanyUser(
    companyNo: number,
    deliveryFounderConsultListDto: DeliveryFounderConsultListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliveryFounderConsult>> {
    const qb = this.deliveryFounderConsultRepo
      .createQueryBuilder('deliveryConsult')
      .CustomInnerJoinAndSelect([
        'deliverySpace',
        'codeManagement',
        'availableTime',
        'companyDecisionStatusCode',
      ])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .innerJoin('deliveryConsult.nanudaUser', 'nanudaUser')
      .leftJoinAndSelect('nanudaUser.genderInfo', 'genderInfo')
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .leftJoinAndSelect('deliverySpace.contracts', 'contracts')
      // .leftJoinAndSelect('companyDistrict.promotions', 'promotions')
      .addSelect(['nanudaUser.name', 'nanudaUser.gender'])
      .where('company.no = :no', { no: companyNo })
      .andWhere('deliveryConsult.status = :status', {
        status: FOUNDER_CONSULT.F_DIST_COMPLETE,
      })
      // .andWhere('promotions.showYn = :showYn', { showYn: YN.YES })
      // .AndWhereJoinBetweenDate('promotions', new Date())
      .AndWhereLike(
        'companyDistrict',
        'nameKr',
        deliveryFounderConsultListDto.companyDistrictNameKr,
        deliveryFounderConsultListDto.exclude('companyDistrictNameKr'),
      )
      .AndWhereLike(
        'companyDistrict',
        'address',
        deliveryFounderConsultListDto.address,
        deliveryFounderConsultListDto.exclude('address'),
      )
      .AndWhereLike(
        'companyDistrict',
        'nameEng',
        deliveryFounderConsultListDto.companyDistrictNameEng,
        deliveryFounderConsultListDto.exclude('companyDistrictNameEng'),
      )
      .AndWhereEqual(
        'deliverySpace',
        'no',
        deliveryFounderConsultListDto.deliverySpaceNo,
        deliveryFounderConsultListDto.exclude('deliverySpaceNo'),
      )
      .AndWhereEqual(
        'nanudaUser',
        'gender',
        deliveryFounderConsultListDto.gender,
        deliveryFounderConsultListDto.exclude('gender'),
      )
      .AndWhereLike(
        'deliveryConsult',
        'hopeFoodCategory',
        deliveryFounderConsultListDto.hopeFoodCategory,
        deliveryFounderConsultListDto.exclude('hopeFoodCategory'),
      )
      .AndWhereLike(
        'deliveryConsult',
        'createdAt',
        deliveryFounderConsultListDto.created,
        deliveryFounderConsultListDto.exclude('created'),
      )
      // .WhereAndOrder(founderConsultListDto)
      // .orderBy('deliveryConsult.no', ORDER_BY_VALUE.DESC)
      .Paginate(pagination)
      .AndWhereBetweenOpenedAt(
        deliveryFounderConsultListDto.started,
        deliveryFounderConsultListDto.ended,
        deliveryFounderConsultListDto.exclude('started'),
        deliveryFounderConsultListDto.exclude('ended'),
      )
      .WhereAndOrder(deliveryFounderConsultListDto);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find one for company user
   * @param companyNo
   * @param deliveryFounderConsultNo
   * @param companyUserNo
   */
  async findOneForCompanyUser(
    companyNo: number,
    deliveryFounderConsultNo: number,
    companyUserNo: number,
  ): Promise<DeliveryFounderConsult> {
    const qb = await this.deliveryFounderConsultRepo
      .createQueryBuilder('deliveryConsult')
      .CustomInnerJoinAndSelect([
        'deliverySpace',
        'codeManagement',
        'availableTime',
        'companyDecisionStatusCode',
      ])
      .CustomLeftJoinAndSelect(['companyUser'])
      .leftJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .leftJoinAndSelect('deliverySpace.contracts', 'contracts')
      .leftJoinAndSelect('deliverySpace.amenities', 'amenities')
      .leftJoinAndSelect(
        'deliverySpace.deliverySpaceOptions',
        'deliverySpaceOptions',
      )
      .leftJoinAndSelect('companyDistrict.company', 'company')
      // .leftJoinAndSelect('companyDistrict.promotions', 'promotions')
      .leftJoinAndSelect('deliveryConsult.nanudaUser', 'nanudaUser')
      .leftJoinAndSelect('nanudaUser.genderInfo', 'genderInfo')
      .where('deliveryConsult.no = :no', { no: deliveryFounderConsultNo })
      .andWhere('company.no = :companyNo', { companyNo: companyNo })
      // .andWhere('promotions.showYn = :showYn', { showYn: YN.YES })
      // .AndWhereJoinBetweenDate('promotions', new Date())
      .getOne();

    if (!qb) {
      throw new BadRequestException({
        message: '업체 공간이 아닙니다.',
        error: 400,
      });
    }
    if (qb.status !== FOUNDER_CONSULT.F_DIST_COMPLETE) {
      throw new BadRequestException({
        message: '1차 상담이 완료되지 못했습니다. 완료 후 확인 바랍니다.',
        error: 400,
      });
    }

    if (qb.viewCount === YN.NO) {
      // slack
      // await this.nanudaSlackNotificationService.founderConsultOpened(qb);
      await this.deliveryFounderConsultRepo
        .createQueryBuilder()
        .update(DeliveryFounderConsult)
        .set({
          viewCount: YN.YES,
          companyUserNo: companyUserNo,
          openedAt: new Date(),
        })
        .where('no = :no', { no: deliveryFounderConsultNo })
        .execute();
      return await this.deliveryFounderConsultRepo
        .createQueryBuilder('deliveryConsult')
        .CustomInnerJoinAndSelect([
          'deliverySpace',
          'codeManagement',
          'availableTime',
          'companyDecisionStatusCode',
        ])
        .CustomLeftJoinAndSelect(['companyUser'])
        .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
        .leftJoinAndSelect('deliverySpace.contracts', 'contracts')
        .leftJoinAndSelect('deliverySpace.amenities', 'amenities')
        .leftJoinAndSelect(
          'deliverySpace.deliverySpaceOptions',
          'deliverySpaceOptions',
        )
        .innerJoinAndSelect('companyDistrict.company', 'company')
        .innerJoinAndSelect('deliveryConsult.nanudaUser', 'nanudaUser')
        .leftJoinAndSelect('nanudaUser.genderInfo', 'genderInfo')
        .where('deliveryConsult.no = :no', { no: deliveryFounderConsultNo })
        .andWhere('company.no = :companyNo', { companyNo: companyNo })
        .getOne();
    }
    const promotionIds = [];
    const promotions = await this.entityManager
      .getRepository(CompanyDistrictPromotionMapper)
      .createQueryBuilder('mapper')
      .where('mapper.companyDistrictNo = :companyDistrictNo', {
        companyDistrictNo: qb.deliverySpace.companyDistrict.no,
      })
      .select(['mapper.promotionNo'])
      .getMany();

    if (promotions && promotions.length > 0) {
      promotions.map(promotion => {
        promotionIds.push(promotion.promotionNo);
      });
      qb.deliverySpace.companyDistrict.promotions = await this.entityManager
        .getRepository(CompanyDistrictPromotion)
        .createQueryBuilder('promotion')
        .whereInIds(promotionIds)
        .andWhere('promotion.showYn = :showYn', { showYn: YN.YES })
        .AndWhereBetweenDate(new Date())
        .getMany();
    }
    return qb;
  }

  /**
   * update by company user
   * @param companyNo
   * @param deliveryFounderConsultNo
   * @param deliveryFounderConsultUpdateDto
   */
  async updateDeliveryFounderConsultByCompanyUser(
    companyNo: number,
    deliveryFounderConsultNo: number,
    deliveryFounderConsultUpdateDto: DeliveryFounderConsultUpdateDto,
  ): Promise<DeliveryFounderConsult> {
    const deliveryConsult = await this.entityManager.transaction(
      async entityManager => {
        let qb = await this.deliveryFounderConsultRepo
          .createQueryBuilder('deliveryConsult')
          .CustomLeftJoinAndSelect(['deliverySpace'])
          .innerJoinAndSelect(
            'deliverySpace.companyDistrict',
            'companyDistrict',
          )
          .leftJoinAndSelect('deliverySpace.contracts', 'contracts')
          .innerJoinAndSelect('companyDistrict.company', 'company')
          .where('deliveryConsult.no = :no', { no: deliveryFounderConsultNo })
          .andWhere('company.no = :companyNo', { companyNo: companyNo })
          .getOne();
        if (!qb) {
          throw new BadRequestException({ message: '존재하지 않습니다.' });
        }
        qb = qb.set(deliveryFounderConsultUpdateDto);
        qb = await entityManager.save(qb);
        if (
          deliveryFounderConsultUpdateDto.companyDecisionStatus ===
          B2B_FOUNDER_CONSULT.B2B_F_CONTRACT_COMPLETE
        ) {
          if (qb.deliverySpace.contracts.length === qb.deliverySpace.quantity) {
            throw new BadRequestException({
              message: '남은 공실이 없어 계약 할 수가 없습니다.',
              error: 400,
            });
          }
          let contract = await this.__create_contract(qb);
          contract = await entityManager.save(contract);
          await this.nanudaSlackNotificationService.completeContractNotification(
            await entityManager
              .getRepository(DeliveryFounderConsultContract)
              .createQueryBuilder('contract')
              .CustomInnerJoinAndSelect(['nanudaUser', 'deliverySpace'])
              .innerJoinAndSelect(
                'deliverySpace.companyDistrict',
                'companyDistrict',
              )
              .innerJoinAndSelect('companyDistrict.company', 'company')
              .where('contract.no = :no', { no: contract.no })
              .getOne(),
          );
        }
        const updatedQb = await this.deliveryFounderConsultRepo
          .createQueryBuilder('deliveryConsult')
          .CustomLeftJoinAndSelect([
            'deliverySpace',
            'companyDecisionStatusCode',
          ])
          .innerJoinAndSelect(
            'deliverySpace.companyDistrict',
            'companyDistrict',
          )
          .innerJoinAndSelect('companyDistrict.company', 'company')
          .where('deliveryConsult.no = :no', { no: deliveryFounderConsultNo })
          .andWhere('company.no = :companyNo', { companyNo: companyNo })
          .getOne();
        await this.nanudaSlackNotificationService.founderConsultStatusChange(
          updatedQb,
        );
        return updatedQb;
      },
    );
    return deliveryConsult;
  }

  /**
   * contract user
   * @param deliveryFounderConsultNo
   * @param companyNo
   */
  async contractUser(
    deliveryFounderConsultNo: number,
    companyNo?: number,
  ): Promise<DeliveryFounderConsult> {
    const deliveryFounderConsult = await this.entityManager.transaction(
      async entityManager => {
        let deliveryFounderConsult = await this.deliveryFounderConsultRepo
          .createQueryBuilder('deliveryConsult')
          .CustomInnerJoinAndSelect(['deliverySpace'])
          .innerJoinAndSelect(
            'deliverySpace.companyDistrict',
            'companyDistrict',
          )
          .where('deliveryConsult.no = :no', { no: deliveryFounderConsultNo })
          .innerJoinAndSelect('companyDistrict.company', 'company')
          .getOne();
        if (deliveryFounderConsult.status !== FOUNDER_CONSULT.F_DIST_COMPLETE) {
          throw new BadRequestException({
            message: '1차 상담이 완료되지 못했습니다. 완료 후 확인 바랍니다.',
            error: 400,
          });
        }
        deliveryFounderConsult.companyDecisionStatus =
          B2B_FOUNDER_CONSULT.B2B_F_CONTRACT_COMPLETE;
        deliveryFounderConsult = await entityManager.save(
          deliveryFounderConsult,
        );
        if (!companyNo) {
          companyNo =
            deliveryFounderConsult.deliverySpace.companyDistrict.companyNo;
        }
        // place in contract
        const space = await this.deliverySpaceService.findOneForCompanyUser(
          deliveryFounderConsult.deliverySpaceNo,
          companyNo,
        );
        if (space.remainingCount === 0) {
          throw new BadRequestException({ message: 'Full!' });
        }
        // contract
        let contract = await this.__create_contract(deliveryFounderConsult);
        contract = await entityManager.save(contract);

        return deliveryFounderConsult;
      },
    );
    return deliveryFounderConsult;
  }

  /**
   * assign yourself for manager
   * @param adminNo
   * @param deliveryFounderConsultNo
   */
  async assignAdmin(adminNo: number, deliveryFounderConsultNo: number) {
    await this.deliveryFounderConsultRepo
      .createQueryBuilder()
      .update(DeliveryFounderConsult)
      .set({ spaceConsultManager: adminNo })
      .where('no = :no', { no: deliveryFounderConsultNo })
      .execute();
  }

  //TODO: 문자 발송 기획부터
  async sendRecommendationMessage(deliveryFounderConsultNo: number) {
    const qb = await this.deliveryFounderConsultRepo
      .createQueryBuilder('deliveryFounderConsult')
      .CustomInnerJoinAndSelect([
        'nanudaUser',
        'deliverySpace',
        'codeManagement',
      ])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .where('deliveryFounderConsult.no = :no', {
        no: deliveryFounderConsultNo,
      })
      .getOne();

    const qbBrands = await this.entityManager
      .getRepository(Brand)
      .createQueryBuilder('brands')
      .CustomInnerJoinAndSelect(['spaceType'])
      .where('brands.showYn = :showYn', { showYn: YN.YES })
      .andWhere('brands.delYn = :delYn', { delYn: YN.NO })
      .andWhere('brands.isRecommendedYn = :isRecommendedYn', {
        isRecommendedYn: YN.YES,
      })
      .andWhere('spaceType.code = :code', {
        code: 'ONLY_DELIVERY',
      })
      .getMany();
    return qb;
  }

  /**
   * update delivery space for consult
   * @param adminNo
   * @param deliveryFounderConsultNo
   * @param newDeliverySpaceNo
   */
  async changeDeliverySpace(
    adminNo: number,
    deliveryFounderConsultNo: number,
    newDeliverySpaceNo: number,
  ): Promise<DeliveryFounderConsult> {
    const deliveryFounderConsult = await this.entityManager.transaction(
      async entityManager => {
        let consult = await this.deliveryFounderConsultRepo.findOne(
          deliveryFounderConsultNo,
        );
        const prevDeliverySpaceNo = consult.deliverySpaceNo;
        if (prevDeliverySpaceNo === newDeliverySpaceNo) {
          throw new BadRequestException('이미 이 공간에 등록 된 상담입니다.');
        }
        consult.deliverySpaceNo = newDeliverySpaceNo;
        consult = await this.deliveryFounderConsultRepo.save(consult);

        // create new record
        let newRecord = new DeliveryFounderConsultRecord();
        newRecord.deliveryFounderConsultNo = deliveryFounderConsultNo;
        newRecord.prevDeliverySpaceNo = prevDeliverySpaceNo;
        newRecord.newDeliverySpaceNo = newDeliverySpaceNo;
        newRecord.adminNo = adminNo;
        newRecord = await entityManager.save(newRecord);

        return consult;
      },
    );

    return deliveryFounderConsult;
  }

  private async __create_contract(
    founderConsult: DeliveryFounderConsult,
  ): Promise<DeliveryFounderConsultContract> {
    const contract = new DeliveryFounderConsultContract();
    contract.deliveryFounderConsultNo = founderConsult.no;
    contract.deliverySpaceNo = founderConsult.deliverySpaceNo;
    contract.companyDistrictNo =
      founderConsult.deliverySpace.companyDistrict.no;
    contract.companyNo =
      founderConsult.deliverySpace.companyDistrict.company.no;
    contract.nanudaUserNo = founderConsult.nanudaUserNo;
    // update remaining count for delivery space
    let updateDeliverySpace = await this.entityManager
      .getRepository(DeliverySpace)
      .createQueryBuilder('deliverySpace')
      .where('deliverySpace.no = :no', { no: founderConsult.deliverySpaceNo })
      .getOne();
    updateDeliverySpace.remainingCount = updateDeliverySpace.remainingCount - 1;
    updateDeliverySpace = await this.entityManager
      .getRepository(DeliverySpace)
      .save(updateDeliverySpace);
    return contract;
  }
}
