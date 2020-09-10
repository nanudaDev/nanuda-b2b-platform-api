import {
  Controller,
  UseGuards,
  Get,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
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

  /**
   * find all payment list
   * @param adminPaymentListDto
   * @param pagination
   */
  @Get('/admin/payment-list/total-revenue')
  async findRevenue(@Query() adminPaymentListDto: AdminPaymentListDto) {
    return await this.paymentListService.getTotalRevenue(adminPaymentListDto);
  }

  /**
   * find one payment list
   * @param paymentListNo
   */
  @Get('/admin/payment-list/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) paymentListNo: number,
  ): Promise<PaymentList> {
    return await this.paymentListService.findOne(paymentListNo);
  }
}
