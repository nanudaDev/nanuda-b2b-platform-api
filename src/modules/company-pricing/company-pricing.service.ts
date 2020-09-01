import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseService } from 'src/core';
import {
  AdminCompanyPricingListDto,
  AdminCompanyPricingCreateDto,
  AdminCompanyPricingUpdateDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { CompanyPricing } from './company-pricing.entity';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CompanyPricingMapper } from '../company-pricing-mapper/company-pricing-mapper.entity';

@Injectable()
export class CompanyPricingService extends BaseService {
  constructor(
    @InjectRepository(CompanyPricing)
    private readonly companyPricingRepo: Repository<CompanyPricing>,
    @InjectRepository(CompanyPricingMapper)
    private readonly companyPricingMapperRepo: Repository<CompanyPricingMapper>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminCompanyPricingListDto
   * @param pagination
   */
  async findAll(
    adminCompanyPricingListDto: AdminCompanyPricingListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyPricing>> {
    const qb = this.companyPricingRepo
      .createQueryBuilder('companyPricing')
      .AndWhereLike(
        'companyPricing',
        'name',
        adminCompanyPricingListDto.name,
        adminCompanyPricingListDto.exclude('name'),
      )
      .AndWhereLike(
        'companyPricing',
        'openFee',
        adminCompanyPricingListDto.openFee,
        adminCompanyPricingListDto.exclude('openFee'),
      )
      .WhereAndOrder(adminCompanyPricingListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find one
   * @param companyPricingNo
   */
  async findOne(companyPricingNo: number): Promise<CompanyPricing> {
    const companyPricing = await this.companyPricingRepo.findOne(
      companyPricingNo,
    );
    if (!companyPricingNo) {
      throw new NotFoundException();
    }
    return companyPricing;
  }

  /**
   * create new company pricing
   * @param adminCompanyPricingCreateDto
   */
  async create(
    adminCompanyPricingCreateDto: AdminCompanyPricingCreateDto,
  ): Promise<CompanyPricing> {
    const check = await this.companyPricingRepo.findOne({
      name: adminCompanyPricingCreateDto.name,
    });
    if (check) {
      throw new BadRequestException({
        message:
          '입력하신 이름과 같은 가격표가 존재합니다. 업데이트 해주시길 바랍니다.',
      });
    }
    let companyPricing = new CompanyPricing(adminCompanyPricingCreateDto);
    companyPricing = await this.companyPricingRepo.save(companyPricing);
    return companyPricing;
  }

  async update(
    companyPricingNo: number,
    adminCompanyPricingUpdateDto: AdminCompanyPricingUpdateDto,
  ): Promise<CompanyPricing> {
    const companyPricing = await this.entityManager.transaction(
      async entityManager => {
        const companyPricing = await this.findOne(companyPricingNo);
        let companyPricingSet = companyPricing.set(
          adminCompanyPricingUpdateDto,
        );
        companyPricingSet = new CompanyPricing(companyPricing);
        companyPricingSet.parentNo = companyPricing.no;
        companyPricingSet = await entityManager.save(companyPricingSet);
        // change mapper
        // query builder
        await this.companyPricingMapperRepo
          .createQueryBuilder()
          .update(CompanyPricingMapper)
          .set({ companyPricingNo: companyPricingSet.no })
          .where({ companyPricingNo: companyPricing.no })
          .execute();

        return companyPricingSet;
      },
    );
    return companyPricing;
  }
}
