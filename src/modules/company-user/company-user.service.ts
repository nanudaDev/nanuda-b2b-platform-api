import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BaseService, APPROVAL_STATUS } from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { CompanyUser } from './company-user.entity';
import { Repository, EntityManager } from 'typeorm';
import {
  AdminCompanyUserCreateDto,
  CompanyUserCreateDto,
  AdminCompanyUserApprovalDto,
  AdminCompanyUserUpdateDto,
  CompanyUserUpdateDto,
  AdminCompanyUserUpdateRefusalDto,
} from './dto';
import { PasswordService } from '../auth';
import { Admin } from '../admin';
import { CompanyUserUpdateHistory } from '../company-user-update-history/company-user-update-history.entity';
import {
  YN,
  PaginatedRequest,
  PaginatedResponse,
  ORDER_BY_VALUE,
} from 'src/common';
import { CompanyUserListDto } from './dto/company-user-list.dto';
import { AdminCompanyUserListDto } from './dto/admin-company-user-list.dto';
import {
  NanudaSlackNotificationService,
  DuplicateKeyRemover,
  NewDataDuplicateKeyRemover,
} from 'src/core/utils';
import { Company } from '../company/company.entity';
import { CompanyUserPhoneDto } from '../auth/dto';

@Injectable()
export class CompanyUserService extends BaseService {
  constructor(
    @InjectRepository(CompanyUser)
    private readonly companyUserRepo: Repository<CompanyUser>,
    @InjectRepository(CompanyUserUpdateHistory)
    private readonly companyUserUpdateHistoryRepo: Repository<
      CompanyUserUpdateHistory
    >,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly passwordService: PasswordService,
    private readonly nanudaSlackNotificationService: NanudaSlackNotificationService,
  ) {
    super();
  }

  /**
   * create new company user for nanuda admin
   * @param adminCompanyUserCreateDto
   * @param admin
   */
  async createForAdmin(
    adminCompanyUserCreateDto: AdminCompanyUserCreateDto,
    admin: Admin,
  ): Promise<CompanyUser> {
    const companyUser = await this.entityManager.transaction(
      async entityManager => {
        adminCompanyUserCreateDto.password = await this.passwordService.hashPassword(
          adminCompanyUserCreateDto.password,
        );
        // hyphen remover
        if (
          adminCompanyUserCreateDto.phone &&
          adminCompanyUserCreateDto.phone.includes('-')
        ) {
          adminCompanyUserCreateDto.phone = adminCompanyUserCreateDto.phone.replace(
            /-/g,
            '',
          );
        }
        // created by this admin
        adminCompanyUserCreateDto.adminNo = admin.no;
        let companyUser = new CompanyUser(adminCompanyUserCreateDto);

        const checkCompanyUser = await this.companyUserRepo.findOne({
          where: {
            email: adminCompanyUserCreateDto.email,
            name: adminCompanyUserCreateDto.name,
            companyNo: adminCompanyUserCreateDto.companyNo,
          },
        });
        if (checkCompanyUser) {
          throw new BadRequestException({
            message: 'User already exists',
          });
        }
        companyUser = await entityManager.save(companyUser);
        // create update history
        let companyUserUpdateHistory = new CompanyUserUpdateHistory(
          adminCompanyUserCreateDto,
        );
        companyUserUpdateHistory.companyUserNo = companyUser.no;
        companyUserUpdateHistory = await entityManager.save(
          companyUserUpdateHistory,
        );
        return companyUser;
      },
    );
    return companyUser;
  }

  /**
   * Company admin user create normal company user
   * @param companyUserCreateDto
   * @param companyAdminUser
   */
  async createForCompanyUserAdmin(
    companyUserCreateDto: CompanyUserCreateDto,
    companyAdminUser: CompanyUser,
  ): Promise<CompanyUser> {
    const companyUser = await this.entityManager.transaction(
      async entityManager => {
        if (
          companyUserCreateDto.phone &&
          companyUserCreateDto.phone.includes('-')
        ) {
          companyUserCreateDto.phone = companyUserCreateDto.phone.replace(
            /-/g,
            '',
          );
        }
        companyUserCreateDto.password = await this.passwordService.hashPassword(
          companyUserCreateDto.password,
        );
        companyUserCreateDto.companyNo = companyAdminUser.companyNo;
        companyUserCreateDto.companyAdminNo = companyAdminUser.no;
        let companyUser = new CompanyUser(companyUserCreateDto);
        const checkCompanyUser = await this.companyUserRepo.findOne({
          where: {
            email: companyUserCreateDto.email,
            name: companyUserCreateDto.name,
            companyNo: companyUserCreateDto.companyNo,
          },
        });
        if (checkCompanyUser) {
          throw new BadRequestException({
            message: 'User already exists',
          });
        }
        companyUser = await entityManager.save(companyUser);
        // create update history
        let companyUserUpdateHistory = new CompanyUserUpdateHistory(
          companyUserCreateDto,
        );
        companyUserUpdateHistory.companyUserNo = companyUser.no;
        companyUserUpdateHistory = await entityManager.save(
          companyUserUpdateHistory,
        );
        return companyUser;
      },
    );
    return companyUser;
  }

  /**
   * update user by nanuda admin
   * @param companyUserNo
   * @param adminCompanyUserUpdateDto
   */
  async updateByAdmin(
    companyUserNo: number,
    adminCompanyUserUpdateDto: AdminCompanyUserUpdateDto,
  ): Promise<CompanyUser> {
    const companyUser = await this.entityManager.transaction(
      async entityManager => {
        let companyUser = await this.companyUserRepo.findOne({
          where: {
            no: companyUserNo,
            delYN: YN.NO,
          },
        });
        if (
          adminCompanyUserUpdateDto.phone &&
          adminCompanyUserUpdateDto.phone.includes('-')
        ) {
          adminCompanyUserUpdateDto.phone = adminCompanyUserUpdateDto.phone.replace(
            /-/g,
            '',
          );
        }
        companyUser = companyUser.set(adminCompanyUserUpdateDto);
        companyUser = await entityManager.save(companyUser);
        // create update history
        let companyUserUpdateHistory = this.__company_user_update_history(
          companyUserNo,
          companyUser,
        );
        companyUserUpdateHistory = await entityManager.save(
          companyUserUpdateHistory,
        );
        return companyUser;
      },
    );
    return companyUser;
  }

  /**
   * update user info and change to update approval status
   * @param companyUserNo
   * @param companyUserUpdateDto
   */
  async updateByCompanyUser(
    companyUserNo: number,
    companyUserUpdateDto: CompanyUserUpdateDto,
  ): Promise<CompanyUser> {
    const companyUser = await this.entityManager.transaction(
      async entityManager => {
        if (
          companyUserUpdateDto.phone &&
          companyUserUpdateDto.phone.includes('-')
        ) {
          companyUserUpdateDto.phone = companyUserUpdateDto.phone.replace(
            /-/g,
            '',
          );
        }
        let companyUser = await this.companyUserRepo
          .createQueryBuilder('companyUser')
          .CustomInnerJoinAndSelect(['company'])
          .where('companyUser.no = :no', { no: companyUserNo })
          .getOne();
        companyUser.companyUserStatus = APPROVAL_STATUS.UPDATE_APPROVAL;
        companyUser = await entityManager.save(companyUser);
        // update history insert
        const updatedContent = companyUser.set(companyUserUpdateDto);
        let companyUserUpdateHistory = this.__company_user_update_history(
          companyUserNo,
          updatedContent,
        );
        companyUserUpdateHistory = await entityManager.save(
          companyUserUpdateHistory,
        );
        // TODO: notify people that a user requested an update:
        //  Slack?
        await this.nanudaSlackNotificationService.companyUserUpdateNotification(
          companyUser,
          companyUserUpdateDto,
        );
        return companyUser;
      },
    );
    return companyUser;
  }

  /**
   * approve company user update request
   * @param companyUserNo
   */
  async approveUpdate(companyUserNo: number): Promise<CompanyUser> {
    const companyUser = await this.entityManager.transaction(
      async entityManager => {
        const checkCompanyUser = await this.companyUserRepo.findOne(
          companyUserNo,
        );
        if (
          ![
            APPROVAL_STATUS.NEED_APPROVAL,
            APPROVAL_STATUS.UPDATE_APPROVAL,
          ].includes(checkCompanyUser.companyUserStatus)
        ) {
          throw new BadRequestException({
            message: 'Nothing to approve',
          });
        }
        let companyUserUpdateHistory = await this.__find_one_company_user_update_history(
          companyUserNo,
          checkCompanyUser.companyUserStatus,
        );
        console.log(companyUserUpdateHistory);
        if (!companyUserUpdateHistory) {
          throw new NotFoundException();
        }
        // create new updated
        companyUserUpdateHistory = new CompanyUserUpdateHistory(
          companyUserUpdateHistory,
        );
        companyUserUpdateHistory.companyUserStatus = APPROVAL_STATUS.APPROVAL;
        companyUserUpdateHistory = await entityManager.save(
          companyUserUpdateHistory,
        );
        // update existing company table
        let companyUser = await this.companyUserRepo.findOne({
          no: companyUserNo,
          companyUserStatus: checkCompanyUser.companyUserStatus,
        });
        // remove id from companyUserHistory
        delete companyUserUpdateHistory.no;
        companyUser = companyUser.set(companyUserUpdateHistory);
        companyUser = await entityManager.save(companyUser);
        return companyUser;
      },
    );
    return companyUser;
  }

  /**
   * refuse update
   * @param companyUserNo
   * @param adminCompanyUserRefusalDto
   */
  async refuseUpdate(
    companyUserNo: number,
    adminCompanyUserRefusalDto: AdminCompanyUserUpdateRefusalDto,
  ): Promise<CompanyUser> {
    const companyUser = await this.entityManager.transaction(
      async entityManager => {
        if (
          adminCompanyUserRefusalDto.refusalReasons &&
          Object.keys(adminCompanyUserRefusalDto.refusalReasons).length < 1 &&
          !adminCompanyUserRefusalDto.refusalDesc
        ) {
          throw new BadRequestException({
            message: '거절 사유를 작성하셔야합니다.',
          });
        }
        const checkCompanyUser = await this.companyUserRepo.findOne(
          companyUserNo,
        );
        if (
          ![
            APPROVAL_STATUS.NEED_APPROVAL,
            APPROVAL_STATUS.UPDATE_APPROVAL,
          ].includes(checkCompanyUser.companyUserStatus)
        ) {
          throw new BadRequestException({
            message: 'Nothing to refuse',
          });
        }
        let companyUserUpdateHistory = await this.__find_one_company_user_update_history(
          companyUserNo,
          checkCompanyUser.companyUserStatus,
        );
        companyUserUpdateHistory.refusalReasons =
          adminCompanyUserRefusalDto.refusalReasons;
        companyUserUpdateHistory.refusalDesc =
          adminCompanyUserRefusalDto.refusalDesc;
        companyUserUpdateHistory.companyUserStatus = APPROVAL_STATUS.REFUSED;
        companyUserUpdateHistory = new CompanyUserUpdateHistory(
          companyUserUpdateHistory,
        );
        companyUserUpdateHistory = await entityManager.save(
          companyUserUpdateHistory,
        );
        // update company user status
        let companyUser = await this.companyUserRepo.findOne({
          no: companyUserNo,
        });
        companyUser.companyUserStatus = APPROVAL_STATUS.REFUSED;
        companyUser = await entityManager.save(companyUser);
        return companyUser;
      },
    );
    return companyUser;
  }

  /**
   * update company user status on sign up
   * 등록 후 상태값 변경
   * @param companyUserNo
   * @param adminCompanyUserApprovalDto
   * @param admin
   */
  async updateUserStatus(
    companyUserNo: number,
    adminCompanyUserApprovalDto: AdminCompanyUserApprovalDto,
  ): Promise<CompanyUser> {
    const companyUser = await this.entityManager.transaction(
      async entityManager => {
        let companyUser = await this.companyUserRepo.findOne({
          where: {
            no: companyUserNo,
            delYN: YN.NO,
          },
        });
        companyUser = companyUser.set(adminCompanyUserApprovalDto);
        companyUser = await entityManager.save(companyUser);
        // create update history
        let companyUserUpdateHistory = new CompanyUserUpdateHistory();
        companyUserUpdateHistory = companyUserUpdateHistory.set(companyUser);
        companyUserUpdateHistory.companyUserNo = companyUser.no;
        await entityManager.save(companyUserUpdateHistory);
        // TODO: send email or sms
        return companyUser;
      },
    );
    return companyUser;
  }

  /**
   * find all for company users
   * @param companyUserListDto
   * @param pagination
   */
  async findAllCompanyUserForCompanyUser(
    companyUserListDto: CompanyUserListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyUser>> {
    const qb = this.companyUserRepo
      .createQueryBuilder('companyUser')
      .CustomLeftJoinAndSelect(['codeManagement'])
      .AndWhereLike(
        'companyUser',
        'name',
        companyUserListDto.name,
        companyUserListDto.exclude('name'),
      )
      .AndWhereLike(
        'companyUser',
        'email',
        companyUserListDto.email,
        companyUserListDto.exclude('email'),
      )
      .AndWhereLike(
        'companyUser',
        'phone',
        companyUserListDto.phone,
        companyUserListDto.exclude('phone'),
      )
      .WhereAndOrder(companyUserListDto)
      .Paginate(pagination);
    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find all for admin
   * @param adminCompanyUserListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminCompanyUserListDto: AdminCompanyUserListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyUser>> {
    const qb = this.companyUserRepo
      .createQueryBuilder('companyUser')
      .CustomLeftJoinAndSelect([
        'company',
        'companyUserUpdateHistories',
        'codeManagement',
      ])
      .AndWhereLike(
        'companyUser',
        'name',
        adminCompanyUserListDto.name,
        adminCompanyUserListDto.exclude('name'),
      )
      .AndWhereLike(
        'companyUser',
        'email',
        adminCompanyUserListDto.email,
        adminCompanyUserListDto.exclude('email'),
      )
      .AndWhereLike(
        'companyUser',
        'phone',
        adminCompanyUserListDto.phone,
        adminCompanyUserListDto.exclude('phone'),
      )
      .AndWhereEqual(
        'companyUser',
        'companyNo',
        adminCompanyUserListDto.companyNo,
        adminCompanyUserListDto.exclude('companyNo'),
      )
      .WhereAndOrder(adminCompanyUserListDto)
      .Paginate(pagination);
    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   *
   * @param companyUserNo
   */
  async findOneForAdmin(companyUserNo: number): Promise<CompanyUser> {
    const companyUser = await this.companyUserRepo
      .createQueryBuilder('companyUser')
      .where('companyUser.no = :no', { no: companyUserNo })
      .CustomInnerJoinAndSelect(['codeManagement'])
      // .where('companyUser.delYn = :delYn', { delYN: YN.NO })
      .CustomLeftJoinAndSelect(['company', 'companyUserUpdateHistories'])
      // order by descending order
      .addOrderBy('companyUserUpdateHistories.no', ORDER_BY_VALUE.DESC)
      .getOne();
    const latestUpdate = await this.__find_one_company_user_update_history(
      companyUserNo,
      companyUser.companyUserStatus,
    );
    if (
      [APPROVAL_STATUS.UPDATE_APPROVAL, APPROVAL_STATUS.REFUSED].includes(
        companyUser.companyUserStatus,
      ) &&
      companyUser.companyUserUpdateHistories.length > 0
    ) {
      companyUser.companyUserUpdateHistories = [
        DuplicateKeyRemover(latestUpdate, companyUser),
      ];
    }
    if (companyUser.companyUserStatus === APPROVAL_STATUS.NEED_APPROVAL) {
      companyUser.companyUserUpdateHistories = [
        NewDataDuplicateKeyRemover(latestUpdate),
      ];
    }
    return companyUser;
  }

  /**
   * find me company user
   * @param companyUserNo
   */
  async findMe(companyUserNo: number): Promise<CompanyUser> {
    const companyUser = await this.companyUserRepo
      .createQueryBuilder('companyUser')
      .where('companyUser.no = :no', { no: companyUserNo })
      .CustomInnerJoinAndSelect(['company', 'codeManagement'])
      .CustomLeftJoinAndSelect(['companyUserUpdateHistories'])
      .orderBy('companyUserUpdateHistories.no', ORDER_BY_VALUE.DESC)
      .getOne();
    const latestUpdate = await this.__find_one_company_user_update_history(
      companyUserNo,
      companyUser.companyUserStatus,
    );
    if (
      [APPROVAL_STATUS.UPDATE_APPROVAL, APPROVAL_STATUS.REFUSED].includes(
        companyUser.companyUserStatus,
      ) &&
      companyUser.companyUserUpdateHistories.length > 0
    ) {
      companyUser.companyUserUpdateHistories = [
        DuplicateKeyRemover(latestUpdate, companyUser),
      ];
    }
    if (companyUser.companyUserStatus === APPROVAL_STATUS.NEED_APPROVAL) {
      companyUser.companyUserUpdateHistories = [
        NewDataDuplicateKeyRemover(latestUpdate),
      ];
    }
    return companyUser;
  }

  /**
   * find one
   * @param companyUserNo
   */
  async findOne(
    companyUserNo: number,
    companyNo?: number,
  ): Promise<CompanyUser> {
    console.log(companyUserNo);
    const companyUser = await this.companyUserRepo
      .createQueryBuilder('companyUser')
      .CustomInnerJoinAndSelect(['company', 'codeManagement'])
      .where('companyUser.no = :no', { no: companyUserNo })
      .andWhere('company.no = :companyNo', { companyNo: companyNo })
      .getOne();
    if (!companyUser) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }
    return companyUser;
  }

  /**
   * keyword search
   * @param keyword
   */
  async searchCompanyUser(keyword: string): Promise<CompanyUser[]> {
    const companyUser = await this.companyUserRepo
      .createQueryBuilder('companyUser')
      .AndWhereLike('companyUser', 'name', keyword)
      .limit(5)
      .orderBy('companyUser.no', ORDER_BY_VALUE.DESC)
      .getMany();
    return companyUser;
  }

  /**
   * find by phone
   * @param phone
   */
  async findByPhone(phone: CompanyUserPhoneDto): Promise<CompanyUser> {
    console.log(123);
    const user = await this.companyUserRepo.findOne({ phone: phone.phone });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  /**
   * delete
   * @param companyUserNo
   */
  async deleteUser(companyUserNo: number): Promise<boolean> {
    await this.entityManager.transaction(async entityManager => {
      const user = await this.companyUserRepo
        .createQueryBuilder()
        .delete()
        .from(CompanyUser)
        .where('no = :no', { no: companyUserNo })
        .execute();
      await this.companyUserUpdateHistoryRepo
        .createQueryBuilder()
        .delete()
        .from(CompanyUserUpdateHistory)
        .where('companyUserNo = :companyUserNo', {
          companyUserNo: companyUserNo,
        })
        .execute();
      return user;
    });
    return true;
  }

  private __company_user_update_history(companyUserNo: number, companyUser) {
    const companyUserUpdateHistory = new CompanyUserUpdateHistory(companyUser);
    companyUserUpdateHistory.companyUserNo = companyUserNo;
    return companyUserUpdateHistory;
  }

  private async __find_one_company_user_update_history(
    companyUserNo: number,
    status?: APPROVAL_STATUS,
  ): Promise<CompanyUserUpdateHistory> {
    const history = await this.companyUserUpdateHistoryRepo.findOne({
      where: {
        companyUserNo: companyUserNo,
        companyUserStatus: status,
      },
      order: {
        no: ORDER_BY_VALUE.DESC,
      },
    });
    return history;
  }
}
