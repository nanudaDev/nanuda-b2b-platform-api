import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { CompanyDistrictPromotion } from './company-district-promotion.entity';

@Injectable()
export class CompanyDistrictPromotionService extends BaseService {
  constructor(
    @InjectRepository(CompanyDistrictPromotion)
    private readonly promotionRepo: Repository<CompanyDistrictPromotion>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }
}
