import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CodeManagementService } from './code-management.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BaseController } from '../../core';
import {
  AdminCodeManagementCreateDto,
  AdminCodeManagementListDto,
} from './dto';
import { CodeManagement } from './code-management.entity';
import { PaginatedRequest, PaginatedResponse, UserInfo } from '../../common';
import { AdminCodeManagementUpdateDto } from './dto/admin-code-management-update.dto';
import { AuthRolesGuard } from 'src/core/guards';
import { ADMIN_USER } from 'src/shared';
import { Admin } from '../admin';

// TODO: ADD GUARDS LOGIC
@ApiTags('ADMIN Code management')
@ApiBearerAuth()
@Controller()
@UseGuards(new AuthRolesGuard(ADMIN_USER.SUPER))
export class AdminCodeManagementController extends BaseController {
  constructor(private readonly codeManagementService: CodeManagementService) {
    super();
  }

  /**
   * Create for admin
   * TODO: ADD GUARD
   * @param adminCodeManagementCreateDto
   */
  @ApiOperation({})
  @Post('/admin/code-management')
  async create(
    @Body() adminCodeManagementCreateDto: AdminCodeManagementCreateDto,
  ): Promise<CodeManagement> {
    return await this.codeManagementService.create(
      adminCodeManagementCreateDto,
    );
  }

  /**
   * Get code list for admin
   * @param adminCodeManagementListDto
   * @param pagination
   */
  @ApiOperation({})
  @Get('/admin/code-management')
  async findAll(
    @Query() adminCodeManagementListDto: AdminCodeManagementListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CodeManagement>> {
    return await this.codeManagementService.findAll(
      adminCodeManagementListDto,
      pagination,
    );
  }

  /**
   * Get code detail
   * @param id
   */
  @ApiOperation({})
  @Get('/admin/code-management/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CodeManagement> {
    return await this.codeManagementService.findOne(id);
  }

  /**
   * update existing code
   * @param codeNO
   * @param adminCodeManagementUpdateDto
   */
  @ApiOperation({
    description: 'Update existing code',
  })
  @Patch('/admin/code-management/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) codeNO: number,
    @Body() adminCodeManagementUpdateDto: AdminCodeManagementUpdateDto,
  ): Promise<CodeManagement> {
    return await this.codeManagementService.update(
      codeNO,
      adminCodeManagementUpdateDto,
    );
  }

  /**
   * hard delete code from database
   * @param admin
   * @param id
   */
  @ApiOperation({})
  @Delete('/admin/code-management/:id([0-9]+)')
  async hardDelete(@UserInfo() admin: Admin, @Param('id') id: number) {
    return {
      isDeleted: await this.codeManagementService.hardDelete(admin, id),
    };
  }

  /**
   * find fonuder consult codes
   */
  @Get('/admin/code-management/founder-consult')
  async findFounderConsultCodes(): Promise<CodeManagement[]> {
    return await this.codeManagementService.findFounderConsultCodes();
  }

  /**
   * find fonuder consult codes
   */
  @Get('/admin/code-management/available-times')
  async findAvailableTimes(): Promise<CodeManagement[]> {
    return await this.codeManagementService.findAvailableTimes();
  }

  /**
   * find gender
   */
  @Get('/admin/code-management/gender')
  async findGenderTypes(): Promise<CodeManagement[]> {
    return await this.codeManagementService.findGenderTypes();
  }

  /**
   * find fonuder consult codes
   */
  @Get('/admin/code-management/b2b-founder-consult')
  async findB2bFounderConsultCodes(): Promise<CodeManagement[]> {
    return await this.codeManagementService.findDeliveryFounderConsultCodes();
  }

  @Get('/admin/code-management/inquiry')
  async findInquiryCodes(): Promise<CodeManagement[]> {
    return await this.codeManagementService.findInquiryTypes();
  }

  @Get('/admin/code-management/:any')
  async findAnyType(
    @Param('any') categoryType: string,
  ): Promise<CodeManagement[]> {
    return await this.codeManagementService.findAnyTypes(categoryType);
  }
}
