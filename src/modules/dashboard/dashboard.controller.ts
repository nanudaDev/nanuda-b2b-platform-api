import { BaseController, AuthRolesGuard, CONST_COMPANY_USER } from 'src/core';
import { DashboardService } from './dashboard.service';
import { Get, Controller, UseGuards } from '@nestjs/common';
import { UserInfo } from 'src/common';
import { CompanyUser } from '../company-user/company-user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller()
@UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
@ApiBearerAuth()
@ApiTags('DASHBOARD')
export class DashboardController extends BaseController {
  constructor(private readonly dashboardService: DashboardService) {
    super();
  }

  /**
   * get user graph
   * @param companyUser
   */
  @Get('/dashboard/founder-consult')
  async getDashboard(@UserInfo() companyUser: CompanyUser) {
    return await this.dashboardService.companyDashboardGraph(
      companyUser.companyNo,
    );
  }

  @Get('/dashboard/founder-consult/city')
  async getDashboardByCities(@UserInfo() companyUser: CompanyUser) {
    return await this.dashboardService.founderConsultGraphPerCityForCompanyUser(
      companyUser.companyNo,
    );
  }
}
