import { Injectable } from '@nestjs/common';
import { BaseService, APPROVAL_STATUS } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyDistrict } from './company-district.entity';
import { Repository } from 'typeorm';
import { CompanyDistrictListDto } from './dto';

@Injectable()
export class NanudaCompanyDistrictService extends BaseService {
  constructor(
    @InjectRepository(CompanyDistrict)
    private readonly companyDistrictRepo: Repository<CompanyDistrict>,
  ) {
    super();
  }

  /**
   * search
   * @param companyDistrictListDto
   */
  async search(
    companyDistrictListDto: CompanyDistrictListDto,
  ): Promise<CompanyDistrict[]> {
    const qb = await this.companyDistrictRepo
      .createQueryBuilder('companyDistrict')
      .AndWhereLike('companyDistrict', 'address', companyDistrictListDto.nameKr)
      .where('companyDistrict.companyDistrictStatus = :companyDistrictStatus', {
        companyDistrictStatus: APPROVAL_STATUS.APPROVAL,
      })
      .getMany();
    return qb;
  }
}
