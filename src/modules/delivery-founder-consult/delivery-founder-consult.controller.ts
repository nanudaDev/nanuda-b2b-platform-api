import {
  Controller,
  UseGuards,
  Query,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_COMPANY_USER, BaseController } from 'src/core';
import { DeliveryFounderConsultService } from './delivery-founder-consult.service';
import {
  DeliveryFounderConsultListDto,
  DeliveryFounderConsultUpdateDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse, UserInfo } from 'src/common';
import { DeliveryFounderConsult } from './delivery-founder-consult.entity';
import { CompanyUser } from '../company-user/company-user.entity';

@Controller()
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
@ApiTags('DELIVERY FOUNDER CONSULT')
export class DeliveryFounderConsultController extends BaseController {
  constructor(
    private readonly deliveryFounderConsultService: DeliveryFounderConsultService,
  ) {
    super();
  }

  /**
   * find all for company user
   * @param companyUser
   * @param deliveryFounderConsultListDto
   * @param pagination
   */
  @Get('/delivery-founder-consult')
  async findAll(
    @UserInfo() companyUser: CompanyUser,
    @Query() deliveryFounderConsultListDto: DeliveryFounderConsultListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliveryFounderConsult>> {
    return await this.deliveryFounderConsultService.findForCompanyUser(
      companyUser.companyNo,
      deliveryFounderConsultListDto,
      pagination,
    );
  }

  /**
   * find one for company user
   * @param deliveryFounderConsultNo
   * @param companyUser
   */
  @Get('/delivery-founder-consult/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) deliveryFounderConsultNo: number,
    @UserInfo() companyUser: CompanyUser,
  ): Promise<DeliveryFounderConsult> {
    return await this.deliveryFounderConsultService.findOneForCompanyUser(
      companyUser.companyNo,
      deliveryFounderConsultNo,
      companyUser.no,
    );
  }

  /**
   * update by company user
   * @param companyUser
   * @param deliverFounderConsultUpdateDto
   * @param deliveryFounderConsultNo
   */
  @Patch('/delivery-founder-consult/:id([0-9]+)')
  async update(
    @UserInfo() companyUser: CompanyUser,
    @Body() deliveryFounderConsultUpdateDto: DeliveryFounderConsultUpdateDto,
    @Param('id', ParseIntPipe) deliveryFounderConsultNo: number,
  ): Promise<DeliveryFounderConsult> {
    return await this.deliveryFounderConsultService.updateDeliveryFounderConsultByCompanyUser(
      companyUser.companyNo,
      deliveryFounderConsultNo,
      deliveryFounderConsultUpdateDto,
    );
  }

  /**
   * complete contract
   * @param companyUser
   * @param deliveryFounderConsultNo
   */
  @Patch('/delivery-founder-consult/:id([0-9]+)/contract-complete')
  async complete(
    @UserInfo() companyUser: CompanyUser,
    @Param('id', ParseIntPipe) deliveryFounderConsultNo: number,
  ): Promise<DeliveryFounderConsult> {
    return await this.deliveryFounderConsultService.contractUser(
      deliveryFounderConsultNo,
      companyUser.companyNo,
    );
  }
}
