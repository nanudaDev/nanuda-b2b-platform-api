import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { YN } from 'src/common';
import { BaseService, PRESENTATION_EVENT_TYPE, SPACE_TYPE } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { Brand } from '../brand/brand.entity';
import { PresentationEvent } from './presentation-event.entity';

@Injectable()
export class NanudaPresentationEventService extends BaseService {
  constructor(
    @InjectRepository(PresentationEvent)
    private readonly presentationEventRepo: Repository<PresentationEvent>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * find one with brands
   * @param eventNo
   */
  async findOne(eventNo: number): Promise<PresentationEvent> {
    const event = await this.presentationEventRepo
      .createQueryBuilder('event')
      .CustomInnerJoinAndSelect(['eventTypeInfo'])
      .where('event.no = :no', { no: eventNo })
      .getOne();

    if (event.eventType === PRESENTATION_EVENT_TYPE.RESTAURANT_EVENT) {
      event.brands = await this.entityManager
        .getRepository(Brand)
        .createQueryBuilder('brands')
        .CustomInnerJoinAndSelect(['spaceType'])
        .where('brands.delYn = :delYn', { delYn: YN.NO })
        .andWhere('brands.showYn = :showYn', { showYn: YN.YES })
        .andWhere('brands.isRecommendedYn = :isRecommendedYn', {
          isRecommendedYn: YN.YES,
        })
        .andWhere('spaceType.code = :code', {
          code: 'SPACE_SHARE',
        })
        .getMany();
    }
    if (event.eventType === PRESENTATION_EVENT_TYPE.DELIVERY_EVENT) {
      event.brands = await this.entityManager
        .getRepository(Brand)
        .createQueryBuilder('brands')
        .CustomInnerJoinAndSelect(['spaceType'])
        .where('brands.delYn = :delYn', { delYn: YN.NO })
        .andWhere('brands.showYn = :showYn', { showYn: YN.YES })
        .andWhere('brands.isRecommendedYn = :isRecommendedYn', {
          isRecommendedYn: YN.YES,
        })
        // find another way to manage codes
        .andWhere('spaceType.code = :code', {
          code: 'ONLY_DELIVERY',
        })
        .getMany();
    }
    if (event.eventType === PRESENTATION_EVENT_TYPE.COMMON_EVENT) {
      event.brands = await this.entityManager
        .getRepository(Brand)
        .createQueryBuilder('brands')
        .where('brands.delYn = :delYn', { delYn: YN.NO })
        .andWhere('brands.showYn = :showYn', { showYn: YN.YES })
        .andWhere('brands.isRecommendedYn = :isRecommendedYn', {
          isRecommendedYn: YN.YES,
        })
        .getMany();
    }
    if (new Date() > event.presentationDate) {
      event.isEnded = YN.YES;
    } else {
      event.isEnded = YN.NO;
    }

    return event;
  }
}
