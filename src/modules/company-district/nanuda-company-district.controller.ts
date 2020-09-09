import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import {
  NanudaCompanyDistrictService,
  SearchResults,
} from './nanuda-company-district.service';
import { CompanyDistrictListDto } from './dto';
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
  ): Promise<SearchResults> {
    // if (!companyDistrictListDto.keyword) {
    //   return new SearchResults();
    // }
    return await this.companyDistrictService.search(companyDistrictListDto);
  }

  /**
   * search districts
   * @param companyDistrictListDto
   */
  @Get('/nanuda/company-district/dropdown')
  async dropdown(@Query() companyDistrictListDto: CompanyDistrictListDto) {
    // if (!companyDistrictListDto.keyword) {
    //   return new SearchResults();
    // }
    return await this.companyDistrictService.companyDistrictDropDown(
      companyDistrictListDto,
    );
  }
}
