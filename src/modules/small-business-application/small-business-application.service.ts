import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { BaseService } from 'src/core';
import { B2CNanudaSlackNotificationService } from 'src/core/utils';
import { EntityManager, Repository } from 'typeorm';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import {
  AdminSmallBusinessApplicationListDto,
  SmallBusinessApplicationCreateDto,
  SmallBusinessApplicationListDto,
  SmallBusinessApplicationSubmitDto,
  SmallBusinessApplicationUpdateDto,
} from './dto';
import { SmallBusinessApplication } from './small-business-application.entity';

@Injectable()
export class SmallBusinessApplicationService extends BaseService {
  constructor(
    @InjectRepository(SmallBusinessApplication)
    private readonly smallBusinessApplicationRepo: Repository<
      SmallBusinessApplication
    >,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly nanudaSlackNotificationService: B2CNanudaSlackNotificationService,
  ) {
    super();
  }

  /**
   * create for nanuda user
   * @param smallBusinessApplicationCreateDto
   */
  async createForNanudaUser(
    smallBusinessApplicationCreateDto: SmallBusinessApplicationCreateDto,
  ): Promise<SmallBusinessApplication> {
    if (
      smallBusinessApplicationCreateDto.phone &&
      smallBusinessApplicationCreateDto.phone.includes('-')
    ) {
      smallBusinessApplicationCreateDto.phone = smallBusinessApplicationCreateDto.phone.replace(
        /-/g,
        '',
      );
    }
    let newApplication = new SmallBusinessApplication(
      smallBusinessApplicationCreateDto,
    );
    const checkIfUserApplied = await this.smallBusinessApplicationRepo.findOne({
      where: {
        name: smallBusinessApplicationCreateDto.name,
        phone: smallBusinessApplicationCreateDto.phone,
        isCompleteYn: YN.YES,
      },
    });
    if (checkIfUserApplied) {
      throw new BadRequestException('죄송합니다. 이미 신청한 전화번호입니다.');
    }
    // if (
    //   smallBusinessApplicationCreateDto.experience &&
    //   smallBusinessApplicationCreateDto.experience.length > 0
    // ) {
    //   smallBusinessApplicationCreateDto.experience.map(exp => {
    //     const operationTime = Math.abs(
    //       new Date(exp.businessEndDate).getTime() -
    //         new Date(exp.businessStartDate).getTime(),
    //     );
    //     const difference = operationTime / (1000 * 3600 * 24);
    //     exp.operationDuration = `${difference}일`;
    //   });
    // }
    // 기존 나누다 키친 사용자인지 아닌지 확인
    const checkIfNanudaUser = await this.entityManager
      .getRepository(NanudaUser)
      .findOne({
        where: {
          name: smallBusinessApplicationCreateDto.name,
          phone: smallBusinessApplicationCreateDto.phone,
        },
      });
    if (checkIfNanudaUser) {
      newApplication.isNanudaUserYn = YN.YES;
    }
    if (smallBusinessApplicationCreateDto.isCompleteYn === YN.YES) {
      smallBusinessApplicationCreateDto.isAgreeYn = YN.YES;
      smallBusinessApplicationCreateDto.isAgreePrivacyYn = YN.YES;
      const newDto = new SmallBusinessApplicationSubmitDto(
        smallBusinessApplicationCreateDto,
      );
      // send slack
      // send message
      newApplication = new SmallBusinessApplication(newDto);
      newApplication = await this.smallBusinessApplicationRepo.save(
        newApplication,
      );
      await this.nanudaSlackNotificationService.smallBusinessApplicationNotification(
        newApplication,
      );
      return newApplication;
    }
    newApplication = await this.smallBusinessApplicationRepo.save(
      newApplication,
    );
    return newApplication;
  }

  /**
   * find one for nanuda user
   * @param smallBusinessApplicationListDto
   */
  async findOneForNanudaUser(
    smallBusinessApplicationListDto: SmallBusinessApplicationListDto,
  ): Promise<SmallBusinessApplication[]> {
    if (
      smallBusinessApplicationListDto.phone &&
      smallBusinessApplicationListDto.phone.includes('-')
    ) {
      smallBusinessApplicationListDto.phone = smallBusinessApplicationListDto.phone.replace(
        /-/g,
        '',
      );
    }
    const qb = this.smallBusinessApplicationRepo
      .createQueryBuilder('application')
      .CustomInnerJoinAndSelect(['applicationType'])
      // .where('application.email = :email', {
      //   email: smallBusinessApplicationListDto.email,
      // })
      // .andWhere('application.phone = :phone', {
      //   phone: smallBusinessApplicationListDto.phone,
      // })
      .where('application.isSavedYn = :isSavedYn', { isSavedYn: YN.YES })
      .andWhere('application.isCompleteYn = :isCompleteYn', {
        isCompleteYn: YN.NO,
      })
      .WhereAndOrder(smallBusinessApplicationListDto)
      .getMany();

    return await qb;
  }

  /**
   * update for nanuda user
   * @param applicationNo
   * @param smallBusinessApplicationUpdateDto
   */
  async updateForUser(
    applicationNo: number,
    smallBusinessApplicationUpdateDto: SmallBusinessApplicationUpdateDto,
  ): Promise<SmallBusinessApplication> {
    let application = await this.smallBusinessApplicationRepo.findOne(
      applicationNo,
    );
    if (
      smallBusinessApplicationUpdateDto.experience &&
      smallBusinessApplicationUpdateDto.experience.length > 0
    ) {
      smallBusinessApplicationUpdateDto.experience.map(exp => {
        if (!exp.operationDuration) {
          const operationTime = Math.abs(
            new Date(exp.businessEndDate).getTime() -
              new Date(exp.businessStartDate).getTime(),
          );
          const difference = operationTime / (1000 * 3600 * 24);
          exp.operationDuration = `${difference}일`;
        }
      });
    }
    if (
      smallBusinessApplicationUpdateDto.isSavedYn === YN.NO &&
      smallBusinessApplicationUpdateDto.isCompleteYn === YN.YES
    ) {
      const submitDto = new SmallBusinessApplicationSubmitDto(
        smallBusinessApplicationUpdateDto,
      );
      application = application.set(submitDto);
      application = await this.smallBusinessApplicationRepo.save(application);
      await this.nanudaSlackNotificationService.smallBusinessApplicationNotification(
        application,
      );
      return application;
    }
    application = application.set(smallBusinessApplicationUpdateDto);
    application = await this.smallBusinessApplicationRepo.save(application);

    return application;
  }

  /**
   * TODO: FINISH FIND ALL
   * @param adminSmallBusinessApplicationListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminSmallBusinessApplicationListDto: AdminSmallBusinessApplicationListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<SmallBusinessApplication>> {
    const qb = this.smallBusinessApplicationRepo
      .createQueryBuilder('application')
      .CustomInnerJoinAndSelect(['applicationType'])
      .AndWhereLike(
        'application',
        'name',
        adminSmallBusinessApplicationListDto.name,
        adminSmallBusinessApplicationListDto.exclude('name'),
      )
      .AndWhereLike(
        'application',
        'phone',
        adminSmallBusinessApplicationListDto.phone,
        adminSmallBusinessApplicationListDto.exclude('phone'),
      )
      .WhereAndOrder(adminSmallBusinessApplicationListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }
}
