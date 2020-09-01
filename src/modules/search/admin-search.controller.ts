import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { BaseController, AuthRolesGuard, CONST_ADMIN_USER } from 'src/core';
import { CompanyService } from '../company/company.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CompanyUserService } from '../company-user/company-user.service';
import { FounderConsultService } from '../founder-consult/founder-consult.service';

@Controller()
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
@ApiTags('ADMIN SEARCH')
export class AdminSearchController extends BaseController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly companyUserService: CompanyUserService,
    private readonly founderConsultService: FounderConsultService,
  ) {
    super();
  }

  @Get('/admin/search/:keyword')
  async search(@Param('keyword') keyword: string) {
    return {
      company: await this.companyService.searchCompany(keyword),
      companyUser: await this.companyUserService.searchCompanyUser(keyword),
      founderConsult: await this.founderConsultService.searchFounderConsult(
        keyword,
      ),
    };
  }
}
