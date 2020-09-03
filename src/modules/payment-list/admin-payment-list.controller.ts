import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { PaymentList } from './payment-list.entity';
import { AdminPaymentListDto } from './dto';
import { PaymentListService } from './payment-list.service';

@Controller()
@ApiBearerAuth()
@ApiTags('ADMIN PAYMENT LIST')
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminPaymentListController extends BaseController {
  constructor(private readonly paymentListService: PaymentListService) {
    super();
  }

  /**
   * find all payment list
   * @param adminPaymentListDto
   * @param pagination
   */
  @Get('/admin/payment-list')
  async findAll(
    @Query() adminPaymentListDto: AdminPaymentListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<PaymentList>> {
    return await this.paymentListService.findAll(
      adminPaymentListDto,
      pagination,
    );
  }
}
