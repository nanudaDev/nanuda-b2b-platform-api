import {
  Controller,
  UseGuards,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Patch,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { CompanyService } from './company.service';
import {
  AdmiinCompanyListDto,
  AdminCompanyUpdateRefusalDto,
  AdminCompanyUpdateDto,
  AdminCompanyCreateDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse, UserInfo } from 'src/common';
import { Company } from './company.entity';
import { Admin } from '../admin';

@Controller()
@ApiTags('ADMIN COMPANY')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminCompanyController extends BaseController {
  constructor(private readonly companyService: CompanyService) {
    super();
  }

  /**
   * find company for admin
   * @param adminCompanyListDto
   * @param pagination
   */
  @Get('/admin/company')
  async findAll(
    @Query() adminCompanyListDto: AdmiinCompanyListDto,
    @Query() pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<Company>> {
    return await this.companyService.findCompanyForAdmin(
      adminCompanyListDto,
      pagination,
    );
  }

  /**
   * company find one
   * @param companyNo
   */
  @Get('/admin/company/:id([0-9]+)')
  async findOne(@Param('id', ParseIntPipe) companyNo: number) {
    return await this.companyService.findOneForAdmin(companyNo);
  }

  /**
   * for select box
   */
  @Get('/admin/company/select-option')
  async findCompanySelect(): Promise<Company[]> {
    return await this.companyService.findCompanyForSelect();
  }

  /**
   * create for admin
   * @param admin
   * @param adminCompanyCreateDto
   */
  @Post('/admin/company')
  async createCompany(
    @UserInfo() admin: Admin,
    @Body() adminCompanyCreateDto: AdminCompanyCreateDto,
  ): Promise<Company> {
    return await this.companyService.create(admin.no, adminCompanyCreateDto);
  }

  /**
   * approve update request for users
   * @param companyNo
   */
  @Patch('/admin/company/:id([0-9]+)/approve-update')
  async approveUpdate(@Param('id') companyNo: number): Promise<Company> {
    return await this.companyService.approveUpdate(companyNo);
  }

  /**
   * refuse update request for users
   * @param companyNo
   * @param adminCompanyUpdateRefusalDto
   */
  @Patch('/admin/company/:id([0-9]+)/refuse-update')
  async refuseUpdate(
    @Param('id') companyNo: number,
    @Body() adminCompanyUpdateRefusalDto: AdminCompanyUpdateRefusalDto,
  ): Promise<Company> {
    return await this.companyService.refuseUpdate(
      companyNo,
      adminCompanyUpdateRefusalDto,
    );
  }

  /**
   * admin company update
   * @param companyNo
   * @param adminCompanyUpdateDto
   */
  @Patch('/admin/company/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) companyNo: number,
    @Body() adminCompanyUpdateDto: AdminCompanyUpdateDto,
  ): Promise<Company> {
    return await this.companyService.updateByAdmin(
      companyNo,
      adminCompanyUpdateDto,
    );
  }

  /**
   * create histories
   */
  @Get('/admin/company/create-history')
  async createHistory() {
    return await this.companyService.createHistories();
  }

  /**
   * delete company
   * @param companyNo
   */
  @Delete('/admin/company/:id([0-9]+)')
  async delete(@Param('id', ParseIntPipe) companyNo: number) {
    return await this.companyService.delete(companyNo);
  }
}
