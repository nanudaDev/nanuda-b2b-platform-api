import { Injectable } from '@nestjs/common';
import { BaseService, APPROVAL_STATUS } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyDistrict } from './company-district.entity';
import { Repository } from 'typeorm';
import { CompanyDistrictListDto } from './dto';

export class SearchResults {
  cities?: CompanyDistrict[];
  regions?: CompanyDistrict[];
  districts?: CompanyDistrict[];
}
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
  ): Promise<SearchResults> {
    const searchResults = new SearchResults();
    const cities = await this.companyDistrictRepo
      .createQueryBuilder('companyDistrict')
      .CustomInnerJoinAndSelect(['deliverySpaces'])
      .where('companyDistrict.companyDistrictStatus = :companyDistrictStatus', {
        companyDistrictStatus: APPROVAL_STATUS.APPROVAL,
      })
      .AndWhereLike(
        'companyDistrict',
        'region1DepthName',
        companyDistrictListDto.keyword,
      )
      .limit(2)
      .getMany();
    searchResults.cities = cities;

    const regions = await this.companyDistrictRepo
      .createQueryBuilder('companyDistrict')
      .CustomInnerJoinAndSelect(['deliverySpaces'])
      .where('companyDistrict.companyDistrictStatus = :companyDistrictStatus', {
        companyDistrictStatus: APPROVAL_STATUS.APPROVAL,
      })
      .AndWhereLike(
        'companyDistrict',
        'region2DepthName',
        companyDistrictListDto.keyword,
      )
      .limit(2)
      .getMany();
    searchResults.regions = regions;

    // const districts = await this.companyDistrictRepo
    //   .createQueryBuilder('companyDistrict')
    //   .CustomInnerJoinAndSelect(['deliverySpaces'])
    //   .where('companyDistrict.companyDistrictStatus = :companyDistrictStatus', {
    //     companyDistrictStatus: APPROVAL_STATUS.APPROVAL,
    //   })
    //   .AndWhereLike(
    //     'companyDistrict',
    //     'address',
    //     companyDistrictListDto.keyword,
    //   )
    //   .limit(2)
    //   .getMany();
    // searchResults.districts = districts;
    return searchResults;
  }
}
