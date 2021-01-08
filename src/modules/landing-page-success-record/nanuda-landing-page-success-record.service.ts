import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { YN } from 'src/common';
import { BaseService } from 'src/core';
import {
  B2CNanudaSlackNotificationService,
  NanudaSmsNotificationService,
} from 'src/core/utils';
import { EntityManager, Repository } from 'typeorm';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { LandingPageSuccessRecordDto } from './dto';
import { LandingPageSuccessRecord } from './landing-page-success-record.entity';

@Injectable()
export class NanudaLandingPageSuccessRecordService extends BaseService {
  constructor(
    @InjectRepository(LandingPageSuccessRecord)
    private readonly landingPageSuccessRepo: Repository<
      LandingPageSuccessRecord
    >,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly nanudaSlackNotification: B2CNanudaSlackNotificationService,
    private readonly nanudaSmsNotification: NanudaSmsNotificationService,
  ) {
    super();
  }

  /**
   * create new success record
   * @param landingPageSuccessDto
   */
  async recordSuccess(
    landingPageSuccessDto: LandingPageSuccessRecordDto,
    req: Request,
  ): Promise<LandingPageSuccessRecord> {
    // remove hyphen from phone number

    if (
      landingPageSuccessDto.nonNanudaUserPhone &&
      landingPageSuccessDto.nonNanudaUserPhone.includes('-')
    ) {
      landingPageSuccessDto.nonNanudaUserPhone = landingPageSuccessDto.nonNanudaUserPhone.replace(
        /-/g,
        '',
      );
    }
    let newRecord = new LandingPageSuccessRecord(landingPageSuccessDto);
    const checkIfUser = await this.entityManager
      .getRepository(NanudaUser)
      .findOne({ where: { phone: landingPageSuccessDto.nonNanudaUserPhone } });
    if (checkIfUser) {
      newRecord.isNanudaUser = YN.YES;
    }

    newRecord = await this.landingPageSuccessRepo.save(newRecord);
    // send message
    await this.nanudaSmsNotification.sendLandingMessage(newRecord, req);
    // send slack
    await this.nanudaSlackNotification.landingPageSuccessNotification(
      newRecord,
    );
    return newRecord;
  }
}
