import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { Company } from './company.entity';
import { NanudaCompanyService } from './nanuda-company.service';

@Controller()
@ApiTags('NANUDA COMPANY')
export class NanudaCompanyController extends BaseController {
  constructor(private readonly nanudaCompanyService: NanudaCompanyService) {
    super();
  }

  /**
   * find all for nanuda user
   */
  @Get('/nanuda/company')
  async findAll(): Promise<Company[]> {
    return await this.nanudaCompanyService.findAll();
  }

  /**
   * find districts by company no
   * @param companyNo
   */
  @Get('/nanuda/company/:id([0-9]+)/districts')
  async findDistricts(
    @Param('id', ParseIntPipe) companyNo: number,
  ): Promise<CompanyDistrict[]> {
    return await this.nanudaCompanyService.findByCompanyNo(companyNo);
  }
}
