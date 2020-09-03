import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { BaseController, AuthRolesGuard, CONST_ADMIN_USER } from 'src/core';
import { DeliveryFounderConsultContractService } from './delivery-founder-consult-contract.service';
import { DeliveryFounderConsultContract } from './delivery-founder-consult-contract.entity';
import { AdminDeliveryFounderConsultContractListDto } from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller()
@ApiTags('ADMIN DELIVERY FOUNDER CONSULT CONTRACT')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminDeliveryFounderConsultContractController extends BaseController {
  constructor(
    private readonly deliveryFounderConsultContractService: DeliveryFounderConsultContractService,
  ) {
    super();
  }

  /**
   *
   * @param adminContractDto
   * @param pagination
   */
  @Get('/admin/delivery-founder-consult-contract')
  async findAll(
    @Query() adminContractDto: AdminDeliveryFounderConsultContractListDto,
    @Query() pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<DeliveryFounderConsultContract>> {
    return await this.deliveryFounderConsultContractService.findAllForAdmin(
      adminContractDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param deliveryFounderConsultContractNo
   */
  @Get('/admin/delivery-founder-consult-contract/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) deliveryFounderConsultContractNo: number,
  ): Promise<DeliveryFounderConsultContract> {
    return await this.deliveryFounderConsultContractService.findOneForAdmin(
      deliveryFounderConsultContractNo,
    );
  }

  /**
   * expire contract
   * @param deliveryContractNo
   */
  @Delete('/admin/delivery-founder-consult-contract/:id([0-9]+)')
  async expireContract(
    @Param('id', ParseIntPipe) deliveryContractNo: number,
  ): Promise<DeliveryFounderConsultContract> {
    return await this.deliveryFounderConsultContractService.expiredContractForAdmin(
      deliveryContractNo,
    );
  }
}
