import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseService, APPROVAL_STATUS } from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { CompanyDistrict } from './company-district.entity';
import { Repository, EntityManager } from 'typeorm';
import {
  PaginatedRequest,
  PaginatedResponse,
  ORDER_BY_VALUE,
} from 'src/common';
import {
  AdminCompanyDistrictListDto,
  CompanyDistrictListDto,
  AdminCompanyDistrictCreateDto,
  CompanyDistrictCreateDto,
  AdminCompanyDistrictUpdateDto,
  CompanyDistrictUpdateDto,
  AdminCompanyDistrictUpdateRefusalDto,
  AdminCompanyDistrictLatLonDto,
} from './dto';
import { CompanyDistrictUpdateHistory } from '../company-district-update-history/company-district-update-history.entity';
import {
  DuplicateKeyRemover,
  NewDataDuplicateKeyRemover,
} from 'src/core/utils';
import { CompanyDistrictAmenityMapper } from '../company-district-amenity-mapper/company-district-amenity-mapper.entity';
import { CompanyDistrictAnalysisSenderService } from './company-district-analysis-sender.service';
import * as daum from 'daum-map-api';
import { FileUploadService } from '../file-upload/file-upload.service';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';

@Injectable()
export class CompanyDistrictService extends BaseService {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly companyDistrictAnalysisSenderService: CompanyDistrictAnalysisSenderService,
    @InjectRepository(CompanyDistrict)
    private readonly companyDistrictRepo: Repository<CompanyDistrict>,
    @InjectRepository(CompanyDistrictUpdateHistory)
    private readonly companyDistrictUpdateHistoryRepo: Repository<
      CompanyDistrictUpdateHistory
    >,
    @InjectRepository(CompanyDistrictAmenityMapper)
    private readonly companyDistrictAmenityMapperRepo: Repository<
      CompanyDistrictAmenityMapper
    >,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * for select option
   * @param companyNo
   */
  async findForCompanyUser(companyNo: number): Promise<CompanyDistrict[]> {
    const districts = await this.companyDistrictRepo.find({
      where: {
        companyNo: companyNo,
      },
    });
    return districts;
  }

  /**
   * find company districts for admin company
   * @param companyNo
   * @param adminCompanyDistrictListDto
   * @param pagination
   */
  async findCompanyDistrictForAdmin(
    adminCompanyDistrictListDto: AdminCompanyDistrictListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrict>> {
    const qb = this.companyDistrictRepo
      .createQueryBuilder('companyDistrict')
      .CustomInnerJoinAndSelect(['company'])
      .CustomLeftJoinAndSelect(['companyDistrictUpdateHistories'])
      // .orderBy('companyDistrictUpdateHistories.no', ORDER_BY_VALUE.DESC)
      .AndWhereLike(
        'companyDistrict',
        'nameKr',
        adminCompanyDistrictListDto.nameKr,
        adminCompanyDistrictListDto.exclude('nameKr'),
      )
      .AndWhereLike(
        'companyDistrict',
        'address',
        adminCompanyDistrictListDto.address,
        adminCompanyDistrictListDto.exclude('address'),
      )
      .AndWhereLike(
        'companyDistrict',
        'nameEng',
        adminCompanyDistrictListDto.nameEng,
        adminCompanyDistrictListDto.exclude('nameEng'),
      )
      .AndWhereLike(
        'company',
        'nameKr',
        adminCompanyDistrictListDto.companyNameKr,
        adminCompanyDistrictListDto.exclude('companyNameKr'),
      )
      .AndWhereLike(
        'company',
        'nameEng',
        adminCompanyDistrictListDto.companyNameEng,
        adminCompanyDistrictListDto.exclude('companyNameEng'),
      )
      .AndWhereEqual(
        'companyDistrict',
        'companyNo',
        adminCompanyDistrictListDto.companyNo,
        adminCompanyDistrictListDto.exclude('companyNo'),
      )
      .WhereAndOrder(adminCompanyDistrictListDto)
      // .addOrderBy('companyDistrictUpdateHistories.no', ORDER_BY_VALUE.DESC)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find company districts for company user
   * @param companyDistrictListDto
   * @param pagination
   */
  async findCompanyDistrictForCompanyUser(
    companyDistrictListDto: CompanyDistrictListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrict>> {
    const qb = this.companyDistrictRepo
      .createQueryBuilder('companyDistrict')
      .CustomLeftJoinAndSelect(['codeManagement'])
      .AndWhereLike(
        'companyDistrict',
        'nameKr',
        companyDistrictListDto.nameKr,
        companyDistrictListDto.exclude('nameKr'),
      )
      .AndWhereLike(
        'companyDistrict',
        'address',
        companyDistrictListDto.address,
        companyDistrictListDto.exclude('address'),
      )
      .AndWhereLike(
        'companyDistrict',
        'nameEng',
        companyDistrictListDto.nameEng,
        companyDistrictListDto.exclude('nameEng'),
      )
      .WhereAndOrder(companyDistrictListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one for admin
   * @param companyDistrictNo
   */
  async findOneForAdmin(companyDistrictNo: number): Promise<CompanyDistrict> {
    const companyDistrict = await this.companyDistrictRepo
      .createQueryBuilder('companyDistrict')
      .CustomInnerJoinAndSelect(['codeManagement', 'company'])
      .CustomLeftJoinAndSelect([
        'companyDistrictUpdateHistories',
        'amenities',
        'deliverySpaces',
      ])
      .orderBy('companyDistrictUpdateHistories.no', ORDER_BY_VALUE.DESC)
      .where('companyDistrict.no = :no', { no: companyDistrictNo })
      .getOne();
    const latestUpdates = await this.__find_one_company_district_update_history(
      companyDistrictNo,
      companyDistrict.companyDistrictStatus,
    );
    if (
      [APPROVAL_STATUS.REFUSED, APPROVAL_STATUS.UPDATE_APPROVAL].includes(
        companyDistrict.companyDistrictStatus,
      )
    ) {
      companyDistrict.companyDistrictUpdateHistories = [
        DuplicateKeyRemover(latestUpdates, companyDistrict),
      ];
    }
    if (
      companyDistrict.companyDistrictStatus === APPROVAL_STATUS.NEED_APPROVAL
    ) {
      companyDistrict.companyDistrictUpdateHistories = [
        NewDataDuplicateKeyRemover(latestUpdates),
      ];
    }
    return companyDistrict;
  }

  async findOneForCompanyUser(
    companyNo: number,
    companyDistrictNo: number,
  ): Promise<CompanyDistrict> {
    const companyDistrict = await this.companyDistrictRepo
      .createQueryBuilder('companyDistrict')
      .CustomInnerJoinAndSelect(['codeManagement', 'company'])
      .CustomLeftJoinAndSelect(['companyDistrictUpdateHistories', 'amenities'])
      .orderBy('companyDistrictUpdateHistories.no', ORDER_BY_VALUE.DESC)
      .where('companyDistrict.no = :no', { no: companyDistrictNo })
      .andWhere('company.no = :companyNo', { companyNo: companyNo })
      .getOne();
    const latestUpdates = await this.__find_one_company_district_update_history(
      companyDistrictNo,
      companyDistrict.companyDistrictStatus,
    );
    if (
      [APPROVAL_STATUS.REFUSED, APPROVAL_STATUS.UPDATE_APPROVAL].includes(
        companyDistrict.companyDistrictStatus,
      )
    ) {
      companyDistrict.companyDistrictUpdateHistories = [
        DuplicateKeyRemover(latestUpdates, companyDistrict),
      ];
    }
    if (
      companyDistrict.companyDistrictStatus === APPROVAL_STATUS.NEED_APPROVAL
    ) {
      companyDistrict.companyDistrictUpdateHistories = [
        NewDataDuplicateKeyRemover(latestUpdates),
      ];
    }
    return companyDistrict;
  }

  /**
   * create company district
   * @param companyDistrictCreateDto
   */
  async create(
    companyDistrictCreateDto:
      | AdminCompanyDistrictCreateDto
      | CompanyDistrictCreateDto,
    userNo: number,
  ): Promise<CompanyDistrict> {
    const companyDistrict = await this.entityManager.transaction(
      async entityManager => {
        if (
          companyDistrictCreateDto.image &&
          companyDistrictCreateDto.image.length > 1
        ) {
          throw new BadRequestException({
            message: 'Can only upload one image!',
            error: 400,
          });
        }
        if (
          companyDistrictCreateDto.image &&
          companyDistrictCreateDto.image.length === 1
        ) {
          companyDistrictCreateDto.image = await this.fileUploadService.moveS3File(
            companyDistrictCreateDto.image,
          );
          if (!companyDistrictCreateDto.image) {
            throw new BadRequestException({ message: 'Upload failed!' });
          }
        }
        let newCompanyDistrict = new CompanyDistrict(companyDistrictCreateDto);
        newCompanyDistrict = await entityManager.save(newCompanyDistrict);
        // create new update history
        let companyDistrictUpdateHistory = this.__company_district_update_history(
          newCompanyDistrict,
        );
        if (
          companyDistrictCreateDto.amenityIds &&
          companyDistrictCreateDto.amenityIds.length > 0
        ) {
          await Promise.all(
            companyDistrictCreateDto.amenityIds.map(async amenityMapper => {
              let newMapper = new CompanyDistrictAmenityMapper();
              newMapper.amenityNo = amenityMapper;
              newMapper.companyDistrictNo = newCompanyDistrict.no;
              newMapper.companyNo = newCompanyDistrict.companyNo;
              newMapper.adminNo = userNo;
              newMapper = await entityManager.save(newMapper);
            }),
          );
        }
        companyDistrictUpdateHistory = await entityManager.save(
          companyDistrictUpdateHistory,
        );
        // 상권분석
        this.companyDistrictAnalysisSenderService.setVicinityAnalysis(
          newCompanyDistrict.no,
          companyDistrictCreateDto.lat,
          companyDistrictCreateDto.lon,
        );
        return newCompanyDistrict;
      },
    );
    return companyDistrict;
  }

  async updateLatLon(
    companyDistrictNo: number,
    adminCompanyDistrictLatLonDto: AdminCompanyDistrictLatLonDto,
  ): Promise<CompanyDistrict> {
    let district = await this.companyDistrictRepo.findOne(companyDistrictNo);
    district.lat = adminCompanyDistrictLatLonDto.lat;
    district.lon = adminCompanyDistrictLatLonDto.lon;
    district.region1DepthName = adminCompanyDistrictLatLonDto.region1DepthName;
    district.region2DepthName = adminCompanyDistrictLatLonDto.region2DepthName;
    // update vicinity
    this.companyDistrictAnalysisSenderService.setVicinityAnalysis(
      companyDistrictNo,
      adminCompanyDistrictLatLonDto.lat,
      adminCompanyDistrictLatLonDto.lon,
    );
    return await this.companyDistrictRepo.save(district);
  }

  /**
   * update for company district by admin
   * id is provided through id parameter
   * @param companyDistrictNo
   * @param adminCompanyDistrictUpdateDto
   */
  async updateForAdmin(
    companyDistrictNo: number,
    adminCompanyDistrictUpdateDto: AdminCompanyDistrictUpdateDto,
    adminNo: number,
  ): Promise<CompanyDistrict> {
    const companyDistrict = await this.entityManager.transaction(
      async entityManager => {
        let companyDistrict = await this.companyDistrictRepo.findOne(
          companyDistrictNo,
        );
        companyDistrict = companyDistrict.set(adminCompanyDistrictUpdateDto);
        companyDistrict = await entityManager.save(companyDistrict);

        // create new update history
        let companyDistrictUpdateHistory = this.__company_district_update_history(
          companyDistrict,
        );
        companyDistrictUpdateHistory = await entityManager.save(
          companyDistrictUpdateHistory,
        );
        if (
          adminCompanyDistrictUpdateDto.amenityIds &&
          adminCompanyDistrictUpdateDto.amenityIds.length > 0
        ) {
          await this.companyDistrictAmenityMapperRepo
            .createQueryBuilder()
            .delete()
            .from(CompanyDistrictAmenityMapper)
            .where('companyDistrictNo = :companyDistrictNo', {
              companyDistrictNo: companyDistrictNo,
            })
            .execute();
          await Promise.all(
            adminCompanyDistrictUpdateDto.amenityIds.map(
              async amenityMapper => {
                let newAmenity = new CompanyDistrictAmenityMapper();
                newAmenity.amenityNo = amenityMapper;
                newAmenity.companyNo = companyDistrict.companyNo;
                newAmenity.companyDistrictNo = companyDistrictNo;
                newAmenity.adminNo = adminNo;
                newAmenity = await entityManager.save(newAmenity);
              },
            ),
          );
        }
        return companyDistrict;
      },
    );
    return companyDistrict;
  }

  /**
   * approve update for company district
   * @param companyDistrictNo
   */
  async approveUpdate(companyDistrictNo: number): Promise<CompanyDistrict> {
    const companyDistrict = await this.entityManager.transaction(
      async entityManager => {
        let checkCompanyDistrict = await this.companyDistrictRepo.findOne(
          companyDistrictNo,
        );
        if (
          ![
            APPROVAL_STATUS.NEED_APPROVAL,
            APPROVAL_STATUS.UPDATE_APPROVAL,
          ].includes(checkCompanyDistrict.companyDistrictStatus)
        ) {
          throw new BadRequestException({
            message: 'Nothing to approve.',
          });
        }
        const companyDistrictUpdateHistory = await this.__find_one_company_district_update_history(
          companyDistrictNo,
          checkCompanyDistrict.companyDistrictStatus,
        );
        if (!companyDistrictUpdateHistory) {
          throw new BadRequestException({
            message: 'Nothing to approve.',
          });
        }
        delete companyDistrictUpdateHistory.no;
        checkCompanyDistrict = checkCompanyDistrict.set(
          companyDistrictUpdateHistory,
        );
        checkCompanyDistrict.companyDistrictStatus = APPROVAL_STATUS.APPROVAL;
        checkCompanyDistrict = await entityManager.save(checkCompanyDistrict);
        // create new update history
        let newCompanyDistrictUpdateHistory = this.__company_district_update_history(
          checkCompanyDistrict,
        );
        newCompanyDistrictUpdateHistory = await entityManager.save(
          newCompanyDistrictUpdateHistory,
        );
        return checkCompanyDistrict;
      },
    );
    return companyDistrict;
  }

  async refuseUpdate(
    companyDistrictNo: number,
    adminCompanyDistrictRefusalDto: AdminCompanyDistrictUpdateRefusalDto,
  ): Promise<CompanyDistrict> {
    const companyDistrict = await this.entityManager.transaction(
      async entityManager => {
        if (
          adminCompanyDistrictRefusalDto.refusalReasons &&
          Object.keys(adminCompanyDistrictRefusalDto.refusalReasons).length <
            1 &&
          !adminCompanyDistrictRefusalDto.refusalDesc
        ) {
          throw new BadRequestException({
            message: '거절 사유를 작성하셔야합니다.',
          });
        }
        const checkCompanyDistrict = await this.companyDistrictRepo.findOne(
          companyDistrictNo,
        );
        if (
          ![
            APPROVAL_STATUS.NEED_APPROVAL,
            APPROVAL_STATUS.UPDATE_APPROVAL,
          ].includes(checkCompanyDistrict.companyDistrictStatus)
        ) {
          throw new BadRequestException({
            message: 'Nothing to refuse.',
          });
        }
        let companyDistrictUpdateHistory = await this.__find_one_company_district_update_history(
          companyDistrictNo,
          checkCompanyDistrict.companyDistrictStatus,
        );
        companyDistrictUpdateHistory.refusalReasons =
          adminCompanyDistrictRefusalDto.refusalReasons;
        companyDistrictUpdateHistory.refusalDesc =
          adminCompanyDistrictRefusalDto.refusalDesc;
        companyDistrictUpdateHistory.companyDistrictStatus =
          APPROVAL_STATUS.REFUSED;
        companyDistrictUpdateHistory = new CompanyDistrictUpdateHistory(
          companyDistrictUpdateHistory,
        );
        companyDistrictUpdateHistory = await entityManager.save(
          companyDistrictUpdateHistory,
        );
        let companyDistrict = await this.companyDistrictRepo.findOne(
          companyDistrictNo,
        );
        companyDistrict.companyDistrictStatus = APPROVAL_STATUS.REFUSED;
        companyDistrict = await entityManager.save(companyDistrict);
        return companyDistrict;
      },
    );
    return companyDistrict;
  }

  /**
   * up
   * @param companyDistrictNo
   * @param companyDistrictUpdateDto
   */
  async updateForCompanyUser(
    companyNo: number,
    companyDistrictNo: number,
    companyDistrictUpdateDto: CompanyDistrictUpdateDto,
  ): Promise<CompanyDistrict> {
    const companyDistrict = await this.entityManager.transaction(
      async entityManager => {
        const check = await this.companyDistrictRepo.findOne({
          where: {
            companyNo: companyNo,
            no: companyDistrictNo,
          },
        });
        if (!check) {
          throw new BadRequestException({
            message: 'Wrong company district',
          });
        }
        let companyDistrict = await this.companyDistrictRepo.findOne(
          companyDistrictNo,
        );
        companyDistrict.companyDistrictStatus = APPROVAL_STATUS.UPDATE_APPROVAL;
        companyDistrict = await entityManager.save(companyDistrict);
        companyDistrict = companyDistrict.set(companyDistrictUpdateDto);
        // create new company district update
        // delete id just in case
        let companyDistrictUpdateHistory = this.__company_district_update_history(
          companyDistrict,
        );
        companyDistrictUpdateHistory = await entityManager.save(
          companyDistrictUpdateHistory,
        );
        // TODO: Slack
        return companyDistrict;
      },
    );
    return companyDistrict;
  }

  /**
   * delete district
   * @param companyDistrictNo
   */
  async deleteDistrict(companyDistrictNo: number) {
    await this.entityManager.transaction(async entityManager => {
      // company district amenity mapper
      await entityManager
        .createQueryBuilder()
        .delete()
        .from(CompanyDistrictAmenityMapper)
        .where('companyDistrictNo = :companyDistrictNo', {
          companyDistrictNo: companyDistrictNo,
        })
        .execute();

      // delete delivery space
      await entityManager
        .createQueryBuilder()
        .delete()
        .from(DeliverySpace)
        .where('companyDistrictNo = :companyDistrictNo', {
          companyDistrictNo: companyDistrictNo,
        })
        .execute();

      // TODO: FAVORITES

      // delete district
      await entityManager
        .createQueryBuilder()
        .delete()
        .from(CompanyDistrict)
        .where('no = :no', { no: companyDistrictNo })
        .execute();

      return true;
    });
    return true;
  }

  private async __find_one_company_district_update_history(
    companyUserNo: number,
    status?: APPROVAL_STATUS,
  ): Promise<CompanyDistrictUpdateHistory> {
    const history = await this.companyDistrictUpdateHistoryRepo.findOne({
      where: {
        companyDistrictNo: companyUserNo,
        companyDistrictStatus: status,
      },
      order: {
        no: ORDER_BY_VALUE.DESC,
      },
    });
    return history;
  }

  /**
   * create vicinity info
   * @param companyDistrictNo
   */
  async createVicinityInfo(companyDistrictNo: number) {
    const companyDistrict = await this.companyDistrictRepo.findOne(
      companyDistrictNo,
    );
    if (!companyDistrict.lat) {
      throw new BadRequestException({ message: 'No latitude!' });
    }
    this.companyDistrictAnalysisSenderService.setVicinityAnalysis(
      companyDistrict.no,
      companyDistrict.lat,
      companyDistrict.lon,
    );
  }

  async createUpdateHistory() {
    const districts = await this.entityManager.transaction(
      async entityManager => {
        const districts = await this.companyDistrictRepo.find();
        await Promise.all(
          districts.map(async district => {
            const histories = await this.companyDistrictUpdateHistoryRepo.find({
              where: { companyDistrictNo: district.no },
            });
            if (histories && histories.length > 0) {
              return;
            } else {
              let history = this.__company_district_update_history(district);
              history = await entityManager.save(history);
            }
          }),
        );
      },
    );
  }

  /**
   * create company district update instance
   * @param companyDistrictUpdate
   */
  private __company_district_update_history(companyDistrictUpdate) {
    const newCompanyUpdateHistory = new CompanyDistrictUpdateHistory(
      companyDistrictUpdate,
    );
    newCompanyUpdateHistory.companyNo = companyDistrictUpdate.companyNo;
    newCompanyUpdateHistory.companyDistrictNo = companyDistrictUpdate.no;
    return newCompanyUpdateHistory;
  }

  private __get_lat_long(address: string) {
    console.log('started');
    const test = new daum();
    const geo = test.maps.services.Geocoder();
    const callback = (res, status) => {
      console.log(res);
    };
    return callback;
  }
}
