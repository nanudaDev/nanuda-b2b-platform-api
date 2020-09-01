import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  UseGuards,
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { AuthRolesGuard, CONST_COMPANY_USER, BaseController } from 'src/core';
import { UserInfo, PaginatedRequest, PaginatedResponse } from 'src/common';
import { CompanyUser } from '../company-user/company-user.entity';
import { DeliveryFounderConsultContractListDto } from './dto';
import { DeliveryFounderConsultContract } from './delivery-founder-consult-contract.entity';
import { DeliveryFounderConsultContractService } from './delivery-founder-consult-contract.service';

@Controller()
@ApiTags('DELIVERY FOUNDER CONSULT CONTRACT')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
export class DeliveryFounderConsultContractController extends BaseController {
  constructor(
    private readonly deliveryFounderConsultContracyService: DeliveryFounderConsultContractService,
  ) {
    super();
  }

  /**
   * find for company user
   * @param companyUser
   * @param contractDto
   * @param pagination
   */
  @Get('/delivery-founder-consult-contract')
  async findAll(
    @UserInfo() companyUser: CompanyUser,
    @Query() contractDto: DeliveryFounderConsultContractListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliveryFounderConsultContract>> {
    return await this.deliveryFounderConsultContracyService.findForCompanyUser(
      contractDto,
      pagination,
      companyUser.companyNo,
    );
  }

  /**
   * find one for company user
   * @param companyUser
   * @param contractNo
   */
  @Get('/delivery-founder-consult-contract/:id([0-9]+)')
  async findOne(
    @UserInfo() companyUser: CompanyUser,
    @Param('id', ParseIntPipe) contractNo: number,
  ): Promise<DeliveryFounderConsultContract> {
    return await this.deliveryFounderConsultContracyService.findOneForCompanyUser(
      companyUser.companyNo,
      contractNo,
    );
  }

  /**
   * expire for company user
   * @param companyUser
   * @param contractNo
   */
  @Delete('/delivery-founder-consult-contract/:id([0-9]+)')
  async expire(
    @UserInfo() companyUser: CompanyUser,
    @Param('id', ParseIntPipe) contractNo: number,
  ): Promise<DeliveryFounderConsultContract> {
    return await this.deliveryFounderConsultContracyService.expiredContractForCompanyUser(
      contractNo,
      companyUser.companyNo,
    );
  }
}
