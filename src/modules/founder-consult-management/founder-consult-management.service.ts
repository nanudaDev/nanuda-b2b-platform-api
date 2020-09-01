import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { FounderConsultManagement } from './founder-consult-management.entity';
import { Repository } from 'typeorm';
import {
  PaginatedRequest,
  PaginatedResponse,
  ORDER_BY_VALUE,
} from 'src/common';
import { FounderConsultManagementCreateDto } from './dto';

@Injectable()
export class FounderConsultManagementService extends BaseService {
  constructor(
    @InjectRepository(FounderConsultManagement)
    private readonly founderConsultManagementRepo: Repository<
      FounderConsultManagement
    >,
  ) {
    super();
  }

  /**
   * find latest
   * @param founderConsultNo
   * @param companyNo
   */
  async findOneLatestForCompanyUser(
    founderConsultNo: number,
  ): Promise<FounderConsultManagement> {
    const qb = await this.founderConsultManagementRepo
      .createQueryBuilder('founderConsultManagement')
      .CustomInnerJoinAndSelect(['companyUser'])
      .where('founderConsultManagement.founderConsultNo = :founderConsultNo', {
        founderConsultNo: founderConsultNo,
      })
      .orderBy('founderConsultManagement.no', ORDER_BY_VALUE.DESC)
      .getOne();

    if (!qb) {
      throw new NotFoundException();
    }
    return qb;
  }

  /**
   * get list
   * @param founderConsultNo
   * @param companyNo
   * @param pagination
   */
  async findAllforFounderConsult(
    founderConsultNo: number,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<FounderConsultManagement>> {
    const qb = this.founderConsultManagementRepo
      .createQueryBuilder('founderConsultManagement')
      .CustomInnerJoinAndSelect(['companyUser'])
      .where('founderConsultManagement.founderConsultNo = :founderConsultNo', {
        founderConsultNo: founderConsultNo,
      })
      .orderBy('founderConsultManagement.no', ORDER_BY_VALUE.DESC)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * create new memo
   * @param companyUserNo
   * @param founderConsultManagementCreateDto
   */
  async create(
    founderConsultNo: number,
    companyUserNo: number,
    founderConsultManagementCreateDto: FounderConsultManagementCreateDto,
  ): Promise<FounderConsultManagement> {
    const memo = new FounderConsultManagement(
      founderConsultManagementCreateDto,
    );
    memo.companyUserNo = companyUserNo;
    memo.founderConsultNo = founderConsultNo;
    return await this.founderConsultManagementRepo.save(memo);
  }
}
