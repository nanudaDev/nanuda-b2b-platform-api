import { Controller, UseGuards, Get, Post, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { DashboardService } from './dashboard.service';
import { AdminDashboardCitySelectionDto } from './dto';

@Controller()
@ApiTags('ADMIN DASHBOARD')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminDashboardController extends BaseController {
  constructor(private readonly dashboardService: DashboardService) {
    super();
  }

  /**
   * get dashboard graph
   */
  @Get('/admin/dashboard/founder-consult')
  async founderConsultGraph() {
    return await this.dashboardService.dashboardGraph();
  }

  /**
   * get dashboard graph
   */
  @Get('/admin/dashboard/delivery-founder-consult')
  async deliveryFounderConsultGraph() {
    return await this.dashboardService.deliveryDashboardGraph();
  }

  /**
   * get data by cities
   */
  @Get('/admin/dashboard/founder-consult/city')
  async founderConsultGraphByCity() {
    return await this.dashboardService.founderConsultGraphPerCity();
  }

  /**
   * founderConsultGraphByCities
   * @param adminDashboardCitySelectionDto
   */
  @Get('/admin/dashboard/founder-consult/by-cities')
  async founderConsultGraphByCities(
    @Query() adminDashboardCitySelectionDto: AdminDashboardCitySelectionDto,
  ) {
    return await this.dashboardService.founderConsultGraphFilteredByCity(
      adminDashboardCitySelectionDto,
    );
  }

  /**
   * getCities
   */
  @Get('/admin/dashboard/get-cities')
  async getCities() {
    return await this.dashboardService.getCities();
  }

  @Get('/admin/payment-list-graph')
  async paymentListGraph() {
    return await this.dashboardService.paymentListGraph();
  }
}
