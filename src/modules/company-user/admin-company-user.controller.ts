import { CompanyUserService } from './company-user.service';
import { BaseController, AuthRolesGuard, CONST_ADMIN_USER } from 'src/core';
import {
  Get,
  Post,
  Controller,
  UseGuards,
  Body,
  Param,
  Patch,
  Query,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  AdminCompanyUserCreateDto,
  AdminCompanyUserApprovalDto,
  AdminCompanyUserUpdateDto,
  AdminCompanyUserUpdateRefusalDto,
} from './dto';
import { UserInfo, PaginatedRequest, PaginatedResponse } from 'src/common';
import { Admin } from '../admin';
import { CompanyUser } from './company-user.entity';
import { AdminCompanyUserListDto } from './dto/admin-company-user-list.dto';

@Controller()
@ApiTags('ADMIN COMPANY USER')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminCompanyUserController extends BaseController {
  constructor(private readonly companyUserService: CompanyUserService) {
    super();
  }

  /**
   * find all for admin
   * @param adminCompanyUserListDto
   * @param pagination
   */
  @Get('/admin/company-user')
  async findAll(
    @Query() adminCompanyUserListDto: AdminCompanyUserListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyUser>> {
    return await this.companyUserService.findAllForAdmin(
      adminCompanyUserListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param companyUserNo
   */
  @Get('/admin/company-user/:id([0-9]+)')
  async findOne(@Param('id') companyUserNo: number): Promise<CompanyUser> {
    return await this.companyUserService.findOneForAdmin(companyUserNo);
  }

  /**
   * create new company user for nanuda admin
   * @param adminCompanyUserCreateDto
   * @param admin
   */
  @Post('/admin/company-user')
  async create(
    @Body() adminCompanyUserCreateDto: AdminCompanyUserCreateDto,
    @UserInfo() admin: Admin,
  ): Promise<CompanyUser> {
    return await this.companyUserService.createForAdmin(
      adminCompanyUserCreateDto,
      admin,
    );
  }

  /**
   * company user update status
   * @param companyUserId
   * @param adminCompanyUserApprovalDto
   */
  @Patch('/admin/company-user/:id([0-9]+)/update-status')
  async updateStatus(
    @Param('id') companyUserId: number,
    @Body() adminCompanyUserApprovalDto: AdminCompanyUserApprovalDto,
  ): Promise<CompanyUser> {
    return await this.companyUserService.updateUserStatus(
      companyUserId,
      adminCompanyUserApprovalDto,
    );
  }

  /**
   * update existing company user by nanuda admin
   * @param companyUserNo
   * @param adminCompanyUserUpdateDto
   */
  @Patch('/admin/company-user/:id([0-9]+)')
  async update(
    @Param('id') companyUserNo: number,
    @Body() adminCompanyUserUpdateDto: AdminCompanyUserUpdateDto,
  ): Promise<CompanyUser> {
    return await this.companyUserService.updateByAdmin(
      companyUserNo,
      adminCompanyUserUpdateDto,
    );
  }

  /**
   * approve update
   * @param companyUserNo
   */
  @Patch('/admin/company-user/:id([0-9]+)/approve-update')
  async approveUpdate(
    @Param('id') companyUserNo: number,
  ): Promise<CompanyUser> {
    return await this.companyUserService.approveUpdate(companyUserNo);
  }

  /**
   * refuse update request
   * @param companyUserNo
   * @param adminRefusalDto
   */
  @Patch('/admin/company-user/:id([0-9]+)/refuse-update')
  async refuseUpdate(
    @Param('id') companyUserNo: number,
    @Body() adminRefusalDto: AdminCompanyUserUpdateRefusalDto,
  ): Promise<CompanyUser> {
    return await this.companyUserService.refuseUpdate(
      companyUserNo,
      adminRefusalDto,
    );
  }

  /**
   * delete user
   * @param companyUserNo
   */
  @Delete('/admin/company-user/:id([0-9]+)')
  async deleteUser(@Param('id', ParseIntPipe) companyUserNo: number) {
    return {
      isDeleted: await this.companyUserService.deleteUser(companyUserNo),
    };
  }
}
