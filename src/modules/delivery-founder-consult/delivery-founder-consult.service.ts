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
} from '../../core';
import {
  PaginatedRequest,
  PaginatedResponse,
  YN,
  ORDER_BY_VALUE,
} from 'src/common';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { NanudaUserUpdateHistory } from '../nanuda-user-update-history/nanuda-user-update-history.entity';
import { NanudaSlackNotificationService } from 'src/core/utils';
import {
  AdminDeliveryFounderConsultListDto,
  AdminDeliveryFounderConsultUpdateDto,
  DeliveryFounderConsultListDto,
  AdminDeliveryFounderConsultCreateDto,
  DeliveryFounderConsultUpdateDto,
} from './dto';
import { DeliverySpaceService } from '../delivery-space/delivery-space.service';
import { DeliveryFounderConsultContract } from '../delivery-founder-consult-contract/delivery-founder-consult-contract.entity';

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
        'deliverySpaces',
        'codeManagement',
        'availableTime',
        'nanudaUser',
        'admin',
      ])
      .leftJoinAndSelect('deliverySpaces.companyDistrict', 'companyDistrict')
      .leftJoinAndSelect('deliverySpaces.contracts', 'contracts')
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
        'deliverySpaces',
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
        'deliverySpaces',
        'codeManagement',
        'availableTime',
        'nanudaUser',
        'admin',
      ])
      .leftJoinAndSelect('deliverySpaces.companyDistrict', 'companyDistrict')
      .leftJoinAndSelect('deliverySpaces.contracts', 'contracts')
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
        'deliverySpaces',
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
      //   'deliverySpaces',
      //   'codeManagement',
      //   'availableTime',
      //   'companyDecisionStatusCode',
      // ])
      .CustomLeftJoinAndSelect([
        'nanudaUser',
        'admin',
        'companyUser',
        'deliverySpaces',
        'codeManagement',
        'availableTime',
        'companyDecisionStatusCode',
      ])
      .leftJoinAndSelect('deliverySpaces.companyDistrict', 'companyDistrict')
      .leftJoinAndSelect('deliverySpaces.contracts', 'contracts')
      .leftJoinAndSelect('companyDistrict.company', 'company')
      .leftJoinAndSelect('deliverySpaces.amenities', 'amenities')
      .leftJoinAndSelect(
        'deliverySpaces.deliverySpaceOptions',
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
  ): Promise<DeliveryFounderConsult> {
    const deliveryFounderConsult = await this.entityManager.transaction(
      async entityManager => {
        let deliveryFounderConsult = await this.deliveryFounderConsultRepo
          .createQueryBuilder('deliveryConsult')
          .CustomInnerJoinAndSelect(['deliverySpaces'])
          .innerJoinAndSelect(
            'deliverySpaces.companyDistrict',
            'companyDistrict',
          )
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
        const nanudaUser = await this.nanudaUserRepo.findOne(
          deliveryFounderConsult.nanudaUserNo,
        );
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
        if (
          adminDeliveryFounderConsultUpdateDto.companyDecisionStatus ===
          B2B_FOUNDER_CONSULT.B2B_F_CONTRACT_COMPLETE
        ) {
          let contract = await this.__create_contract(deliveryFounderConsult);
          contract = await entityManager.save(contract);
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
        'deliverySpaces',
        'codeManagement',
        'availableTime',
        'companyDecisionStatusCode',
      ])
      .innerJoinAndSelect('deliverySpaces.companyDistrict', 'companyDistrict')
      .innerJoin('deliveryConsult.nanudaUser', 'nanudaUser')
      .leftJoinAndSelect('nanudaUser.genderInfo', 'genderInfo')
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .leftJoinAndSelect('deliverySpaces.contracts', 'contracts')
      .addSelect(['nanudaUser.name', 'nanudaUser.gender'])
      .where('company.no = :no', { no: companyNo })
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
        'deliverySpaces',
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
      .orderBy('deliveryConsult.no', ORDER_BY_VALUE.DESC)
      .Paginate(pagination)
      .AndWhereBetweenOpenedAt(
        deliveryFounderConsultListDto.startDate,
        deliveryFounderConsultListDto.endDate,
        deliveryFounderConsultListDto.exclude('startDate'),
        deliveryFounderConsultListDto.exclude('endDate'),
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
        'deliverySpaces',
        'codeManagement',
        'availableTime',
        'companyDecisionStatusCode',
      ])
      .CustomLeftJoinAndSelect(['companyUser'])
      .leftJoinAndSelect('deliverySpaces.companyDistrict', 'companyDistrict')
      .leftJoinAndSelect('deliverySpaces.contracts', 'contracts')
      .leftJoinAndSelect('deliverySpaces.amenities', 'amenities')
      .leftJoinAndSelect(
        'deliverySpaces.deliverySpaceOptions',
        'deliverySpaceOptions',
      )
      .leftJoinAndSelect('companyDistrict.company', 'company')
      .leftJoinAndSelect('deliveryConsult.nanudaUser', 'nanudaUser')
      .leftJoinAndSelect('nanudaUser.genderInfo', 'genderInfo')
      .where('deliveryConsult.no = :no', { no: deliveryFounderConsultNo })
      .andWhere('company.no = :companyNo', { companyNo: companyNo })
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
          'deliverySpaces',
          'codeManagement',
          'availableTime',
          'companyDecisionStatusCode',
        ])
        .CustomLeftJoinAndSelect(['companyUser'])
        .innerJoinAndSelect('deliverySpaces.companyDistrict', 'companyDistrict')
        .leftJoinAndSelect('deliverySpaces.contracts', 'contracts')
        .leftJoinAndSelect('deliverySpaces.amenities', 'amenities')
        .leftJoinAndSelect(
          'deliverySpaces.deliverySpaceOptions',
          'deliverySpaceOptions',
        )
        .innerJoinAndSelect('companyDistrict.company', 'company')
        .innerJoinAndSelect('deliveryConsult.nanudaUser', 'nanudaUser')
        .leftJoinAndSelect('nanudaUser.genderInfo', 'genderInfo')
        .where('deliveryConsult.no = :no', { no: deliveryFounderConsultNo })
        .andWhere('company.no = :companyNo', { companyNo: companyNo })
        .getOne();
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
          .CustomLeftJoinAndSelect(['deliverySpaces'])
          .innerJoinAndSelect(
            'deliverySpaces.companyDistrict',
            'companyDistrict',
          )
          .leftJoinAndSelect('deliverySpaces.contracts', 'contracts')
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
          if (
            qb.deliverySpaces.contracts.length === qb.deliverySpaces.quantity
          ) {
            throw new BadRequestException({
              message: '남은 공실이 없어 계약 할 수가 없습니다.',
              error: 400,
            });
          }
          let contract = await this.__create_contract(qb);
          contract = await entityManager.save(contract);
        }
        qb = await this.deliveryFounderConsultRepo
          .createQueryBuilder('deliveryConsult')
          .CustomLeftJoinAndSelect([
            'deliverySpaces',
            'companyDecisionStatusCode',
          ])
          .innerJoinAndSelect(
            'deliverySpaces.companyDistrict',
            'companyDistrict',
          )
          .innerJoinAndSelect('companyDistrict.company', 'company')
          .where('deliveryConsult.no = :no', { no: deliveryFounderConsultNo })
          .andWhere('company.no = :companyNo', { companyNo: companyNo })
          .getOne();
        await this.nanudaSlackNotificationService.founderConsultStatusChange(
          qb,
        );
        return qb;
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
          .CustomInnerJoinAndSelect(['deliverySpaces'])
          .innerJoinAndSelect(
            'deliverySpaces.companyDistrict',
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
            deliveryFounderConsult.deliverySpaces.companyDistrict.companyNo;
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

  private async __create_contract(
    founderConsult: DeliveryFounderConsult,
  ): Promise<DeliveryFounderConsultContract> {
    const contract = new DeliveryFounderConsultContract();
    contract.deliveryFounderConsultNo = founderConsult.no;
    contract.deliverySpaceNo = founderConsult.deliverySpaceNo;
    contract.companyDistrictNo =
      founderConsult.deliverySpaces.companyDistrict.no;
    contract.companyNo =
      founderConsult.deliverySpaces.companyDistrict.company.no;
    contract.nanudaUserNo = founderConsult.nanudaUserNo;
    return contract;
  }
}
