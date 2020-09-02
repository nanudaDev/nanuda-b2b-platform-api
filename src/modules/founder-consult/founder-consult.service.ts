import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { FounderConsult } from './founder-consult.entity';
import { Repository, EntityManager } from 'typeorm';
import { BaseService, FOUNDER_CONSULT, BaseDto } from '../../core';
import {
  AdminFounderConsultListDto,
  FounderConsultListDto,
  AdminFounderConsultUpdateDto,
  FounderConsultUpdateDto,
} from './dto';
import {
  PaginatedRequest,
  PaginatedResponse,
  YN,
  ORDER_BY_VALUE,
} from 'src/common';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { NanudaUserUpdateHistory } from '../nanuda-user-update-history/nanuda-user-update-history.entity';
import { NanudaSlackNotificationService } from 'src/core/utils';
import { DeliveryFounderConsultContract } from '../delivery-founder-consult-contract/delivery-founder-consult-contract.entity';

@Injectable()
export class FounderConsultService extends BaseService {
  constructor(
    @InjectRepository(FounderConsult)
    private readonly founderConsultRepo: Repository<FounderConsult>,
    @InjectRepository(NanudaUser)
    private readonly nanudaUserRepo: Repository<NanudaUser>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly nanudaSlackNotificationService: NanudaSlackNotificationService,
  ) {
    super();
  }

  // TODO: inform people to change 'all' to ALL_DAY
  // TODO: change left join to inner join for availableTime
  /**
   * find all for admin
   * @param adminFounderConsultListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminFounderConsultListDto: AdminFounderConsultListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<FounderConsult>> {
    if (
      adminFounderConsultListDto.phone &&
      adminFounderConsultListDto.phone.includes('-')
    ) {
      adminFounderConsultListDto.phone = adminFounderConsultListDto.phone.replace(
        /-/g,
        '',
      );
    }
    const qb = this.founderConsultRepo
      .createQueryBuilder('founderConsult')
      .CustomLeftJoinAndSelect([
        'space',
        'codeManagement',
        'availableTime',
        'nanudaUser',
        'admin',
      ])
      .leftJoinAndSelect('space.companyDistricts', 'companyDistricts')
      .leftJoinAndSelect('companyDistricts.company', 'company')
      .leftJoinAndSelect('nanudaUser.genderInfo', 'genderInfo')
      .leftJoinAndSelect('space.spaceType', 'spaceType')
      .AndWhereLike(
        'companyDistricts',
        'nameKr',
        adminFounderConsultListDto.companyDistrictNameKr,
        adminFounderConsultListDto.exclude('companyDistrictNameKr'),
      )
      .AndWhereLike(
        'companyDistricts',
        'nameEng',
        adminFounderConsultListDto.companyDistrictNameEng,
        adminFounderConsultListDto.exclude('companyDistrictNameEng'),
      )
      .AndWhereLike(
        'nanudaUser',
        'phone',
        adminFounderConsultListDto.phone,
        adminFounderConsultListDto.exclude('phone'),
      )
      .AndWhereLike(
        'nanudaUser',
        'name',
        adminFounderConsultListDto.nanudaUserName,
        adminFounderConsultListDto.exclude('nanudaUserName'),
      )
      .AndWhereLike(
        'space',
        'address',
        adminFounderConsultListDto.address,
        adminFounderConsultListDto.exclude('address'),
      )
      .AndWhereLike(
        'admin',
        'name',
        adminFounderConsultListDto.adminUserName,
        adminFounderConsultListDto.exclude('adminUserName'),
      )
      .AndWhereEqual(
        'company',
        'no',
        adminFounderConsultListDto.companyNo,
        adminFounderConsultListDto.exclude('companyNo'),
      )
      .AndWhereEqual(
        'space',
        'no',
        adminFounderConsultListDto.spaceNo,
        adminFounderConsultListDto.exclude('spaceNo'),
      )
      .AndWhereEqual(
        'space',
        'spaceTypeNo',
        adminFounderConsultListDto.spaceTypeNo,
        adminFounderConsultListDto.exclude('spaceTypeNo'),
      )
      .AndWhereEqual(
        'nanudaUser',
        'gender',
        adminFounderConsultListDto.gender,
        adminFounderConsultListDto.exclude('gender'),
      )
      // .WhereAndOrder(adminFounderConsultListDto)
      .orderBy('founderConsult.no', ORDER_BY_VALUE.DESC)
      .AndWhereBetweenOpenedAt(
        adminFounderConsultListDto.startDate,
        adminFounderConsultListDto.endDate,
        adminFounderConsultListDto.exclude('startDate'),
        adminFounderConsultListDto.exclude('endDate'),
      )
      .WhereAndOrder(adminFounderConsultListDto)
      .Paginate(pagination);
    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find one for founder consult
   * @param founderConsultNo
   */
  async findOneForAdmin(founderConsultNo: number): Promise<FounderConsult> {
    const qb = await this.founderConsultRepo
      .createQueryBuilder('founderConsult')
      .CustomInnerJoinAndSelect([
        'space',
        'codeManagement',
        'availableTime',
        'companyDecisionStatusCode',
      ])
      .CustomLeftJoinAndSelect(['nanudaUser', 'admin', 'companyUser'])
      .leftJoinAndSelect('space.companyDistricts', 'companyDistricts')
      .leftJoinAndSelect('space.spaceType', 'spaceType')
      .leftJoinAndSelect('space.amenities', 'amenities')
      .leftJoinAndSelect('space.deliverySpaceOptions', 'deliverySpaceOptions')
      .leftJoinAndSelect('companyDistricts.company', 'company')
      .leftJoinAndSelect('company.codeManagement', 'companyStatus')
      .leftJoinAndSelect('nanudaUser.genderInfo', 'genderInfo')
      .where('founderConsult.no = :no', { no: founderConsultNo })
      .getOne();

    return qb;
  }

  /**
   * find for company users
   * @param companyNo
   * @param founderConsultListDto
   * @param pagination
   */
  async findForCompanyUser(
    companyNo: number,
    founderConsultListDto: FounderConsultListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<FounderConsult>> {
    const qb = this.founderConsultRepo
      .createQueryBuilder('founderConsult')
      .CustomInnerJoinAndSelect(['space', 'codeManagement', 'availableTime'])
      .leftJoinAndSelect('space.companyDistricts', 'companyDistricts')
      .leftJoin('founderConsult.nanudaUser', 'nanudaUser')
      .leftJoinAndSelect('nanudaUser.genderInfo', 'genderInfo')
      .leftJoinAndSelect('companyDistricts.company', 'company')
      .addSelect(['nanudaUser.name', 'nanudaUser.gender'])
      .where('company.no = :no', { no: companyNo })
      .AndWhereLike(
        'companyDistricts',
        'nameKr',
        founderConsultListDto.companyDistrictNameKr,
        founderConsultListDto.exclude('companyDistrictNameKr'),
      )
      .AndWhereLike(
        'space',
        'address',
        founderConsultListDto.address,
        founderConsultListDto.exclude('address'),
      )
      .AndWhereLike(
        'companyDistricts',
        'nameEng',
        founderConsultListDto.companyDistrictNameEng,
        founderConsultListDto.exclude('companyDistrictNameEng'),
      )
      .AndWhereEqual(
        'space',
        'no',
        founderConsultListDto.spaceNo,
        founderConsultListDto.exclude('spaceNo'),
      )
      .AndWhereEqual(
        'space',
        'spaceTypeNo',
        founderConsultListDto.spaceTypeNo,
        founderConsultListDto.exclude('spaceTypeNo'),
      )
      .AndWhereEqual(
        'nanudaUser',
        'gender',
        founderConsultListDto.gender,
        founderConsultListDto.exclude('gender'),
      )
      .AndWhereLike(
        'founderConsult',
        'createdAt',
        founderConsultListDto.created,
        founderConsultListDto.exclude('created'),
      )
      // .WhereAndOrder(founderConsultListDto)
      .orderBy('founderConsult.no', ORDER_BY_VALUE.DESC)
      .Paginate(pagination)
      .AndWhereBetweenOpenedAt(
        founderConsultListDto.startDate,
        founderConsultListDto.endDate,
        founderConsultListDto.exclude('startDate'),
        founderConsultListDto.exclude('endDate'),
      )
      .WhereAndOrder(founderConsultListDto);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find one for company user
   * only their own company
   * @param companyNo
   * @param founderConsultNo
   */
  async findOneForCompanyUser(
    companyNo: number,
    founderConsultNo: number,
    companyUserNo: number,
  ): Promise<FounderConsult> {
    const qb = await this.founderConsultRepo
      .createQueryBuilder('founderConsult')
      .CustomInnerJoinAndSelect([
        'space',
        'codeManagement',
        'availableTime',
        'companyDecisionStatusCode',
      ])
      .CustomLeftJoinAndSelect(['companyUser'])
      .innerJoinAndSelect('space.companyDistricts', 'companyDistricts')
      .leftJoinAndSelect('space.spaceType', 'spaceType')
      .leftJoinAndSelect('space.amenities', 'amenities')
      .leftJoinAndSelect('space.deliverySpaceOptions', 'deliverySpaceOptions')
      .innerJoinAndSelect('companyDistricts.company', 'company')
      .innerJoinAndSelect('founderConsult.nanudaUser', 'nanudaUser')
      .leftJoinAndSelect('nanudaUser.genderInfo', 'genderInfo')
      .where('founderConsult.no = :no', { no: founderConsultNo })
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
      await this.founderConsultRepo
        .createQueryBuilder()
        .update(FounderConsult)
        .set({
          viewCount: YN.YES,
          companyUserNo: companyUserNo,
          openedAt: new Date(),
        })
        .where('no = :no', { no: founderConsultNo })
        .execute();
      return await this.founderConsultRepo
        .createQueryBuilder('founderConsult')
        .CustomInnerJoinAndSelect([
          'space',
          'codeManagement',
          'availableTime',
          'companyDecisionStatusCode',
        ])
        .CustomLeftJoinAndSelect(['companyUser'])
        .innerJoinAndSelect('space.companyDistricts', 'companyDistricts')
        .leftJoinAndSelect('space.spaceType', 'spaceType')
        .leftJoinAndSelect('space.amenities', 'amenities')
        .leftJoinAndSelect('space.deliverySpaceOptions', 'deliverySpaceOptions')
        .innerJoinAndSelect('companyDistricts.company', 'company')
        .innerJoinAndSelect('founderConsult.nanudaUser', 'nanudaUser')
        .leftJoinAndSelect('nanudaUser.genderInfo', 'genderInfo')
        .where('founderConsult.no = :no', { no: founderConsultNo })
        .andWhere('company.no = :companyNo', { companyNo: companyNo })
        .getOne();
    }
    return qb;
  }

  /**
   * update founder consult
   * @param founderConsultNo
   * @param adminFounderConsultUpdateDto
   */
  async updateForAdmin(
    founderConsultNo: number,
    adminFounderConsultUpdateDto: AdminFounderConsultUpdateDto,
  ): Promise<FounderConsult> {
    const founderConsult = await this.entityManager.transaction(
      async entityManager => {
        let founderConsult = await this.founderConsultRepo.findOne(
          founderConsultNo,
        );
        if (!founderConsult) {
          throw new NotFoundException({
            message: '존재하지 않습니다.',
          });
        }
        founderConsult = founderConsult.set(adminFounderConsultUpdateDto);
        if (
          adminFounderConsultUpdateDto.status ===
          FOUNDER_CONSULT.F_DIST_COMPLETE
        ) {
          founderConsult.deliveredAt = new Date();
        }
        founderConsult = await entityManager.save(founderConsult);
        if (adminFounderConsultUpdateDto.gender) {
          // update user gender
          const nanudaUser = await this.nanudaUserRepo.findOne(
            founderConsult.nanudaUserNo,
          );
          nanudaUser.gender = adminFounderConsultUpdateDto.gender;
          await entityManager.save(nanudaUser);
          // create nanuda user history
          const nanudaUserUpdateHistory = new NanudaUserUpdateHistory(
            nanudaUser,
          );
          nanudaUserUpdateHistory.nanudaUserNo = nanudaUser.no;
          await entityManager.save(nanudaUserUpdateHistory);
        }
        const nanudaUser = await this.nanudaUserRepo.findOne(
          founderConsult.nanudaUserNo,
        );
        if (
          !nanudaUser.gender &&
          adminFounderConsultUpdateDto.status ===
            FOUNDER_CONSULT.F_DIST_COMPLETE
        ) {
          throw new BadRequestException({
            message: '사용자 성별을 제시해주세요.',
            error: 400,
          });
        }
        return founderConsult;
      },
    );
    return founderConsult;
  }

  /**
   * update own company founder consult status
   * @param companyNo
   * @param founderConsultNo
   * @param founderConsultUpdateDto
   */
  async updateFounderConsultByCompanyUser(
    companyNo: number,
    founderConsultNo: number,
    founderConsultUpdateDto: FounderConsultUpdateDto,
  ): Promise<FounderConsult> {
    try {
      const qb = await this.founderConsultRepo
        .createQueryBuilder('founderConsult')
        .CustomInnerJoinAndSelect(['space', 'companyDecisionStatusCode'])
        .innerJoinAndSelect('space.companyDistricts', 'companyDistricts')
        .innerJoinAndSelect('companyDistricts.company', 'company')
        .where('founderConsult.no = :no', { no: founderConsultNo })
        .andWhere('company.no = :companyNo', { companyNo: companyNo })
        .getOne();

      if (!qb) {
        throw new BadRequestException();
      }
      qb.companyDecisionStatus = founderConsultUpdateDto.companyDecisionStatus;

      // await this.nanudaSlackNotificationService.founderConsultStatusChange(qb);
      return await this.founderConsultRepo.save(qb);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * reverse read status
   * @param companyNo
   */
  async reverseReadStatus(founderConsultNo: number): Promise<FounderConsult> {
    let founderConsult = await this.founderConsultRepo.findOne(
      founderConsultNo,
    );
    if (founderConsult.viewCount === YN.NO) {
      throw new BadRequestException({
        message: '미열람 처리가 된 신청서입니다.',
      });
    }
    founderConsult.viewCount = YN.NO;
    founderConsult.companyUserNo = null;
    founderConsult.openedAt = null;
    founderConsult = await this.founderConsultRepo.save(founderConsult);
    return founderConsult;
  }

  /**
   * search for founder consult
   * TODO: add OR
   * @param keyword
   */
  async searchFounderConsult(keyword: string) {
    const founderConsult = await this.founderConsultRepo
      .createQueryBuilder('founderConsult')
      .CustomInnerJoinAndSelect(['space'])
      .CustomLeftJoinAndSelect(['admin'])
      .AndWhereLike('space', 'address', keyword)
      .limit(5)
      .orderBy('space.no', ORDER_BY_VALUE.DESC)
      .getMany();
    return founderConsult;
  }
}
