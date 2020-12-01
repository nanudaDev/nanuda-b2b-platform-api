import {
  Injectable,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseService, APPROVAL_STATUS } from 'src/core';
import { HyphenRemover } from '../../core/utils/hyphen-remover.util';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository, EntityManager } from 'typeorm';
import { CompanyUser } from '../company-user/company-user.entity';
import {
  CompanyUpdateDto,
  AdmiinCompanyListDto,
  AdminCompanyUpdateRefusalDto,
  AdminCompanyUpdateDto,
  AdminCompanyCreateDto,
} from './dto';
import { CompanyUpdateHistory } from '../company-update-history/company-update-history.entity';
import {
  ORDER_BY_VALUE,
  PaginatedRequest,
  PaginatedResponse,
} from 'src/common';
import { take } from 'rxjs/operators';
import {
  DuplicateKeyRemover,
  NewDataDuplicateKeyRemover,
} from 'src/core/utils';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { CompanyDistrictUpdateHistory } from '../company-district-update-history/company-district-update-history.entity';
import { CompanyUserUpdateHistory } from '../company-user-update-history/company-user-update-history.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { CompanyDistrictPromotionMapper } from '../company-district-promotion-mapper/company-district-promotion-mapper.entity';
import { CompanyDistrictPromotion } from '../company-district-promotion/company-district-promotion.entity';

@Injectable()
export class CompanyService extends BaseService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(CompanyUpdateHistory)
    private readonly companyUpdateHistoryRepo: Repository<CompanyUpdateHistory>,
    @InjectRepository(CompanyDistrict)
    private readonly companyDistrictRepo: Repository<CompanyDistrict>,
    @InjectRepository(CompanyDistrictUpdateHistory)
    private readonly companyDistrictUpdateHistoryRepo: Repository<
      CompanyDistrictUpdateHistory
    >,
    @InjectRepository(CompanyUser)
    private readonly companyUserRepo: Repository<CompanyUser>,
    @InjectRepository(CompanyUserUpdateHistory)
    private readonly companyUserUpdateHistoryRepo: Repository<
      CompanyUserUpdateHistory
    >,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly fileUploadService: FileUploadService,
  ) {
    super();
  }

  /**
   * create company for admin
   * @param adminNo
   * @param adminCompanyCreateDto
   */
  async create(
    adminNo: number,
    adminCompanyCreateDto: AdminCompanyCreateDto,
  ): Promise<Company> {
    const company = await this.entityManager.transaction(
      async entityManager => {
        if (adminCompanyCreateDto.phone.includes('-')) {
          adminCompanyCreateDto.phone = adminCompanyCreateDto.phone.replace(
            /-/g,
            '',
          );
        }
        let company = new Company(adminCompanyCreateDto);
        company.adminNo = adminNo;
        if (
          adminCompanyCreateDto.logo &&
          adminCompanyCreateDto.logo.length > 1
        ) {
          throw new BadRequestException({
            message: 'Can only upload one image!',
          });
        }
        if (
          adminCompanyCreateDto.logo &&
          adminCompanyCreateDto.logo.length > 0
        ) {
          adminCompanyCreateDto.logo = await this.fileUploadService.moveS3File(
            adminCompanyCreateDto.logo,
          );
          if (!adminCompanyCreateDto.logo) {
            throw new BadRequestException({ message: 'Upload failed' });
          }
        }
        company = await entityManager.save(company);
        // create update history
        let companyUpdateHistory = this.__company_update_history(
          company.no,
          company,
        );
        companyUpdateHistory = await entityManager.save(companyUpdateHistory);
        return company;
      },
    );
    return company;
  }

  /**
   * update company
   * @param companyNo
   * @param companyUpdateDto
   */
  async update(
    companyNo: number,
    companyUpdateDto: CompanyUpdateDto,
  ): Promise<Company> {
    const company = await this.entityManager.transaction(
      async entityManager => {
        // update status on company table
        // UPDATE_APPROVAL
        if (companyUpdateDto.phone.includes('-')) {
          companyUpdateDto.phone = companyUpdateDto.phone.replace(/-/g, '');
        }
        let company = await this.companyRepo.findOne(companyNo);
        company.companyStatus = APPROVAL_STATUS.UPDATE_APPROVAL;
        company = await entityManager.save(company);
        // create new update history data
        if (companyUpdateDto.logo && companyUpdateDto.logo.length > 1) {
          throw new BadRequestException({
            message: 'Can only upload one image!',
            error: 400,
          });
        }
        if (companyUpdateDto.logo && companyUpdateDto.logo.length === 1) {
          companyUpdateDto.logo = await this.fileUploadService.moveS3File(
            companyUpdateDto.logo,
          );
          if (!companyUpdateDto.logo) {
            throw new BadRequestException({ message: 'Upload failed' });
          }
        }
        company = company.set(companyUpdateDto);
        let companyUpdateHistory = this.__company_update_history(
          companyNo,
          company,
        );
        companyUpdateHistory = await entityManager.save(companyUpdateHistory);
        return company;
      },
    );
    return company;
  }

  /**
   * update by nanuda admin
   * @param companyNo
   * @param adminCompanyUpdateDto
   */
  async updateByAdmin(
    companyNo: number,
    adminCompanyUpdateDto: AdminCompanyUpdateDto,
  ): Promise<Company> {
    if (
      adminCompanyUpdateDto.phone &&
      adminCompanyUpdateDto.phone.includes('-')
    ) {
      adminCompanyUpdateDto.phone = adminCompanyUpdateDto.phone.replace(
        /-/g,
        '',
      );
    }
    const company = await this.entityManager.transaction(
      async entityManager => {
        let company = await this.companyRepo.findOne(companyNo);
        company = company.set(adminCompanyUpdateDto);
        // company.companyStatus = APPROVAL_STATUS.APPROVAL;
        if (
          adminCompanyUpdateDto.logo &&
          adminCompanyUpdateDto.logo.length > 1
        ) {
          throw new BadRequestException({
            message: 'Can only upload one image!',
            error: 400,
          });
        }
        if (
          adminCompanyUpdateDto.logo &&
          adminCompanyUpdateDto.logo.length === 1
        ) {
          adminCompanyUpdateDto.logo = await this.fileUploadService.moveS3File(
            adminCompanyUpdateDto.logo,
          );
          if (!adminCompanyUpdateDto.logo) {
            throw new BadRequestException({ message: 'Upload failed' });
          }
        }
        company = await entityManager.save(company);

        let companyUpdateHistory = this.__company_update_history(
          companyNo,
          company,
        );
        companyUpdateHistory = await entityManager.save(companyUpdateHistory);
        return company;
      },
    );
    return company;
  }

  /**
   * approve update for company
   * @param companyNo
   */
  async approveUpdate(companyNo: number): Promise<Company> {
    const company = await this.entityManager.transaction(
      async entityManager => {
        const checkCompany = await this.companyRepo.findOne(companyNo);
        if (!checkCompany) {
          throw new NotFoundException();
        }
        if (
          ![
            APPROVAL_STATUS.UPDATE_APPROVAL,
            APPROVAL_STATUS.NEED_APPROVAL,
          ].includes(checkCompany.companyStatus)
        ) {
          throw new BadRequestException({
            message: 'Nothing to approve.',
          });
        }
        let companyUpdateHistory = await this.__find_one_company_update_history(
          companyNo,
          checkCompany.companyStatus,
        );
        if (!companyUpdateHistory) {
          throw new NotFoundException({
            message: 'Nothing to approve - No update history',
          });
        }
        let company = await this.companyRepo.findOne(companyNo);
        delete companyUpdateHistory.no;
        company = company.set(companyUpdateHistory);
        company.companyStatus = APPROVAL_STATUS.APPROVAL;
        company = await entityManager.save(company);

        companyUpdateHistory = this.__company_update_history(
          companyNo,
          company,
        );
        companyUpdateHistory = await entityManager.save(companyUpdateHistory);
        return company;
      },
    );
    return company;
  }

  /**
   * refuse company update
   * @param companyNo
   * @param adminCompanyUpdateRefusalDto
   */
  async refuseUpdate(
    companyNo: number,
    adminCompanyUpdateRefusalDto: AdminCompanyUpdateRefusalDto,
  ): Promise<Company> {
    const company = await this.entityManager.transaction(
      async entityManager => {
        if (
          adminCompanyUpdateRefusalDto.refusalReasons &&
          Object.keys(adminCompanyUpdateRefusalDto.refusalReasons).length < 1 &&
          !adminCompanyUpdateRefusalDto.refusalDesc
        ) {
          throw new BadRequestException({
            message: '거절 사유를 작성하셔야합니다.',
          });
        }
        const checkCompany = await this.companyRepo.findOne(companyNo);
        if (!checkCompany) {
          throw new NotFoundException();
        }
        if (
          ![
            APPROVAL_STATUS.UPDATE_APPROVAL,
            APPROVAL_STATUS.NEED_APPROVAL,
          ].includes(checkCompany.companyStatus)
        ) {
          throw new BadRequestException({
            message: 'Nothing to refuse.',
          });
        }
        let companyUpdateHistory = await this.__find_one_company_update_history(
          companyNo,
          checkCompany.companyStatus,
        );
        if (!companyUpdateHistory) {
          throw new NotFoundException({
            message: 'Nothing to approve - No update history',
          });
        }
        companyUpdateHistory.refusalReasons =
          adminCompanyUpdateRefusalDto.refusalReasons;
        companyUpdateHistory.refusalDesc =
          adminCompanyUpdateRefusalDto.refusalDesc;
        companyUpdateHistory.companyStatus = APPROVAL_STATUS.REFUSED;
        companyUpdateHistory = await entityManager.save(
          new CompanyUpdateHistory(companyUpdateHistory),
        );
        let company = await this.companyRepo.findOne(companyNo);
        company.companyStatus = APPROVAL_STATUS.REFUSED;
        company = await entityManager.save(company);
        return company;
      },
    );
    return company;
  }

  /**
   * find one for company
   * @param companyNo
   */
  async findOne(companyNo: number): Promise<Company> {
    const qb = this.companyRepo
      .createQueryBuilder('company')
      .CustomInnerJoinAndSelect(['codeManagement'])
      .where('company.no = :no', { no: companyNo })
      .getOne();
    return await qb;
  }

  /**
   * get company for admin
   * @param adminCompanyListDto
   * @param pagination
   */
  async findCompanyForAdmin(
    adminCompanyListDto: AdmiinCompanyListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<Company>> {
    adminCompanyListDto.fax
      ? (adminCompanyListDto.fax = HyphenRemover(adminCompanyListDto.fax))
      : adminCompanyListDto.fax;
    adminCompanyListDto.phone
      ? HyphenRemover(adminCompanyListDto.phone)
      : adminCompanyListDto.phone;
    const qb = this.companyRepo
      .createQueryBuilder('company')
      .CustomLeftJoinAndSelect([
        'companyUsers',
        'codeManagement',
        'companyDistricts',
      ])
      .AndWhereLike(
        'company',
        'nameKr',
        adminCompanyListDto.nameKr,
        adminCompanyListDto.exclude('nameKr'),
      )
      .AndWhereLike(
        'company',
        'address',
        adminCompanyListDto.address,
        adminCompanyListDto.exclude('address'),
      )
      .AndWhereLike(
        'company',
        'nameEng',
        adminCompanyListDto.nameEng,
        adminCompanyListDto.exclude('nameEng'),
      )
      .AndWhereLike(
        'company',
        'fax',
        adminCompanyListDto.fax,
        adminCompanyListDto.exclude('fax'),
      )
      .AndWhereLike(
        'company',
        'phone',
        adminCompanyListDto.phone,
        adminCompanyListDto.exclude('phone'),
      )
      .AndWhereLike(
        'company',
        'website',
        adminCompanyListDto.website,
        adminCompanyListDto.exclude('website'),
      )
      .AndWhereLike(
        'company',
        'email',
        adminCompanyListDto.email,
        adminCompanyListDto.exclude('email'),
      )
      .AndWhereLike(
        'company',
        'ceoKr',
        adminCompanyListDto.ceoKr,
        adminCompanyListDto.exclude('ceoKr'),
      )
      .AndWhereLike(
        'company',
        'ceoEng',
        adminCompanyListDto.ceoEng,
        adminCompanyListDto.exclude('ceoEng'),
      )
      .AndWhereLike(
        'companyDistricts',
        'nameKr',
        adminCompanyListDto.companyDistrictNameKr,
        adminCompanyListDto.exclude('companyDistrictNameKr'),
      )
      .WhereAndOrder(adminCompanyListDto)
      .Paginate(pagination);
    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * get one for admin company
   * @param companyNo
   */
  async findOneForAdmin(companyNo: number): Promise<Company> {
    const qb = await this.companyRepo
      .createQueryBuilder('company')
      .CustomInnerJoinAndSelect(['codeManagement'])
      .CustomLeftJoinAndSelect(['admin', 'companyUpdateHistories', 'pricing'])
      .where('company.no = :no', { no: companyNo })
      .orderBy('companyUpdateHistories.no', ORDER_BY_VALUE.DESC)
      .getOne();

    // show only changed
    const latestUpdate = await this.__find_one_company_update_history(
      companyNo,
      qb.companyStatus,
    );
    if (
      [APPROVAL_STATUS.REFUSED, APPROVAL_STATUS.UPDATE_APPROVAL].includes(
        qb.companyStatus,
      )
    ) {
      qb.companyUpdateHistories = [DuplicateKeyRemover(latestUpdate, qb)];
    }
    if (qb.companyStatus === APPROVAL_STATUS.NEED_APPROVAL) {
      qb.companyUpdateHistories = [NewDataDuplicateKeyRemover(latestUpdate)];
    }
    return qb;
  }

  /**
   * return for select
   */
  async findCompanyForSelect(): Promise<Company[]> {
    const companies = await this.companyRepo.find({
      order: { no: ORDER_BY_VALUE.DESC },
    });
    return companies;
  }

  /**
   * find expired promotions
   * @param companyNo
   * @param pagination
   */
  async findExpiredPromotion(
    companyNo: number,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrictPromotion>> {
    const promotions = this.entityManager
      .getRepository(CompanyDistrictPromotion)
      .createQueryBuilder('promotion')
      .CustomLeftJoinAndSelect(['company'])
      .where('company.no = :no', { no: companyNo })
      .andWhere('promotion.ended < :date', { date: new Date() })
      .orderBy('promotion.createdAt', ORDER_BY_VALUE.DESC)
      .Paginate(pagination);

    const [items, totalCount] = await promotions.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find ongoing promotions
   * @param companyNo
   * @param pagination
   */
  async findOngoingPromotions(
    companyNo: number,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrictPromotion>> {
    const promotions = this.entityManager
      .getRepository(CompanyDistrictPromotion)
      .createQueryBuilder('promotion')
      .CustomLeftJoinAndSelect(['company'])
      .CustomInnerJoinAndSelect(['codeManagement'])
      .where('company.no = :no', { no: companyNo })
      .AndWhereBetweenDate(new Date())
      .orderBy('promotion.createdAt', ORDER_BY_VALUE.DESC)
      .Paginate(pagination);

    let [items, totalCount] = await promotions.getManyAndCount();
    items = this.__remove_duplicate(items);
    const diff = totalCount - items.length;
    totalCount = totalCount - diff;
    return { items, totalCount };
  }

  /**
   * delete company
   * @param companyNo
   */
  async delete(companyNo: number) {
    const company = await this.entityManager.transaction(
      async entityManager => {
        const company = await this.companyRepo
          .createQueryBuilder()
          .delete()
          .from(Company)
          .where('no = :no', { no: companyNo })
          .execute();

        // delete update histories
        await this.companyUpdateHistoryRepo
          .createQueryBuilder()
          .delete()
          .from(CompanyUpdateHistory)
          .where('companyNo = :companyNo', { companyNo: companyNo })
          .execute();

        // delete districts
        await this.companyDistrictRepo
          .createQueryBuilder()
          .delete()
          .from(CompanyDistrict)
          .where('companyNo = :companyNo', { companyNo: companyNo })
          .execute();

        // delete company district update
        await this.companyDistrictUpdateHistoryRepo
          .createQueryBuilder()
          .delete()
          .from(CompanyDistrictUpdateHistory)
          .where('companyNo = :companyNo', { companyNo: companyNo })
          .execute();

        // delete company users
        await this.companyUserRepo
          .createQueryBuilder()
          .delete()
          .from(CompanyUser)
          .where('companyNo = :companyNo', { companyNo: companyNo })
          .execute();

        // delete company user update history
        await this.companyUserUpdateHistoryRepo
          .createQueryBuilder()
          .delete()
          .from(CompanyUserUpdateHistory)
          .where('companyNo = :companyNo', { companyNo: companyNo })
          .execute();

        // delete promotion mapper
        await entityManager
          .getRepository(CompanyDistrictPromotionMapper)
          .createQueryBuilder()
          .delete()
          .from(CompanyDistrictPromotionMapper)
          .where('companyNo = :companyNo', { companyNo: companyNo })
          .execute();
        return company;
      },
    );
    return company;
  }

  async createHistories() {
    const company = await this.entityManager.transaction(
      async entityManager => {
        const companies = await this.companyRepo.find();
        await Promise.all(
          companies.map(async company => {
            const histories = await this.companyUpdateHistoryRepo.find({
              where: { companyNo: company.no },
            });
            if (histories && histories.length > 0) {
              return;
            } else {
              let history = this.__company_update_history(company.no, company);
              history = await entityManager.save(history);
            }
          }),
        );
      },
    );
  }

  /**
   * search for company - keyword
   * @param adminSearchParamDto
   */
  async searchCompany(keyword: string): Promise<Company[]> {
    const company = await this.companyRepo
      .createQueryBuilder('company')
      .AndWhereLike('company', 'nameKr', keyword)
      .limit(5)
      .orderBy('company.no', ORDER_BY_VALUE.DESC)
      .getMany();
    return company;
  }

  private async __find_one_company_update_history(
    companyNo: number,
    status?: APPROVAL_STATUS,
  ): Promise<CompanyUpdateHistory> {
    const history = await this.companyUpdateHistoryRepo.findOne({
      where: {
        companyNo: companyNo,
        companyStatus: status,
      },
      order: {
        no: ORDER_BY_VALUE.DESC,
      },
    });
    return history;
  }

  private __company_update_history(companyNo: number, company) {
    const newCompanyUpdateHistory = new CompanyUpdateHistory(company);
    newCompanyUpdateHistory.companyNo = companyNo;

    return newCompanyUpdateHistory;
  }

  private __remove_duplicate(array: any) {
    return array.filter((a: string, b: string) => array.indexOf(a) === b);
  }
}
