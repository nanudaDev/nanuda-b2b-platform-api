import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { MessageFloatingPopulationDto } from './dto';

@Injectable()
export class MessageDeliverySpaceService extends BaseService {
  constructor(
    @InjectEntityManager('wq') private readonly wqEntityManager: EntityManager,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(DeliverySpace)
    private readonly deliverySpaceRepo: Repository<DeliverySpace>,
  ) {
    super();
  }

  async findFloatingPopulation(
    messageFloatingPopulationDto: MessageFloatingPopulationDto,
  ) {
    const query = `SELECT hdongCode, round(avg(TotalCnt)) as avgTotalCnt
      FROM wq.kr_seoul_living_local
      WHERE hdongCode = ${messageFloatingPopulationDto.hdongName} AND time IN (11, 12, 13)
      GROUP BY hdongCode
      ;`;
  }
}
