import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import {
  NanudaCompanyDistrictService,
  SearchResults,
} from './nanuda-company-district.service';
import { CompanyDistrictListDto, NanudaCompanyDistrictSearchDto } from './dto';
import { CompanyDistrict } from './company-district.entity';

@Controller()
@ApiTags('NANUDA COMPANY DISTRICT')
export class NanudaCompanyDistrictController extends BaseController {
  constructor(
    private readonly companyDistrictService: NanudaCompanyDistrictService,
  ) {
    super();
  }

  /**
   * search districts
   * @param companyDistrictListDto
   */
  @Get('/nanuda/company-district/search')
  async search(
    @Query() companyDistrictListDto: CompanyDistrictListDto,
    @Query() nanudaCompanyDistrictSearchDto: NanudaCompanyDistrictSearchDto,
  ): Promise<SearchResults> {
    // if (!companyDistrictListDto.keyword) {
    //   return new SearchResults();
    // }
    return await this.companyDistrictService.search(
      companyDistrictListDto,
      nanudaCompanyDistrictSearchDto,
    );
  }

  /**
   * search districts
   * @param companyDistrictListDto
   */
  @Get('/nanuda/company-district/dropdown')
  async dropdown(@Query() companyDistrictListDto: CompanyDistrictListDto) {
    return await this.companyDistrictService.companyDistrictDropDown(
      companyDistrictListDto,
    );
  }

  /**
   * dropwdown test
   * @param companyDistrictListDto
   */
  @Get('/nanuda/company-district/dropdown-test')
  async dropdown2(@Query() companyDistrictListDto: CompanyDistrictListDto) {
    return await this.companyDistrictService.companyDistrictDown2(
      companyDistrictListDto,
    );
  }

  /**
   * get center
   * @param companyDistrictListDto
   */
  @Get('/nanuda/company-district/get-center')
  async getCenter(@Query() companyDistrictListDto: CompanyDistrictListDto) {
    return await this.companyDistrictService.getCenterForMap(
      companyDistrictListDto,
    );
  }

  /**
   * find available districts
   */
  @Get('/nanuda/company-district/available-districts')
  async findAvailableDistricts(): Promise<CompanyDistrict[]> {
    return await this.companyDistrictService.findAllAvailableDistricts();
  }
}
