import {
  Controller,
  UseGuards,
  Patch,
  Body,
  ParseIntPipe,
  Param,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  AuthRolesGuard,
  COMPANY,
  COMPANY_USER,
  BaseController,
  CONST_COMPANY_USER,
} from 'src/core';
import { CompanyService } from './company.service';
import { UserInfo } from 'src/common';
import { CompanyUser } from '../company-user/company-user.entity';
import { CompanyUpdateDto } from './dto';
import { Company } from './company.entity';

@Controller()
@ApiTags('COMPANY')
@ApiBearerAuth()
export class CompanyController extends BaseController {
  constructor(private readonly companyService: CompanyService) {
    super();
  }

  /**
   * update company
   * @param companyUser
   * @param companyUpdateDto
   */
  @UseGuards(new AuthRolesGuard(COMPANY_USER.ADMIN_COMPANY_USER))
  @Patch('/company')
  async update(
    @UserInfo() companyUser: CompanyUser,
    @Body() companyUpdateDto: CompanyUpdateDto,
  ): Promise<Company> {
    return await this.companyService.update(
      companyUser.companyNo,
      companyUpdateDto,
    );
  }

  @UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
  @Get('/company/find-my-company')
  async findMyCompany(@UserInfo() companyUser: CompanyUser): Promise<Company> {
    return await this.companyService.findOne(companyUser.companyNo);
  }
}
