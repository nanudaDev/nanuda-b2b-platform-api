import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { LandingPageRecordDto } from './dto';
import { LandingPageRecord } from './landing-page-record.entity';
// import * as ip from 'ip';

@Injectable()
export class NanudaLandingPageRecordService extends BaseService {
  constructor(
    @InjectRepository(LandingPageRecord)
    private readonly landingPageRecordRepo: Repository<LandingPageRecord>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * create new landing page record
   * @param landingPageRecordDto
   * @param ip
   */
  async recordView(landingPageRecordDto: LandingPageRecordDto) {
    const checkIfIpExists = await this.landingPageRecordRepo.findOne({
      where: { ip: landingPageRecordDto.ip },
    });
    if (checkIfIpExists) {
      return null;
    }
    let newRecord = new LandingPageRecord(landingPageRecordDto);
    newRecord.ip = landingPageRecordDto.ip;
    newRecord = await this.landingPageRecordRepo.save(newRecord);
    return newRecord;
  }
}
