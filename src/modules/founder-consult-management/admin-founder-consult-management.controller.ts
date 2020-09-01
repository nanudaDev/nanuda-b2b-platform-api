import {
  Controller,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AuthRolesGuard,
  CONST_COMPANY_USER,
  BaseController,
  CONST_ADMIN_USER,
} from 'src/core';
import { FounderConsultManagementService } from './founder-consult-management.service';
import { UserInfo, PaginatedRequest, PaginatedResponse } from 'src/common';
import { CompanyUser } from '../company-user/company-user.entity';
import { FounderConsultManagement } from './founder-consult-management.entity';
import { FounderConsultManagementCreateDto } from './dto';

@Controller()
@ApiBearerAuth()
@ApiTags('ADMIN FOUNDER CONSULT MANAGEMENT')
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminFounderConsultManagementController extends BaseController {
  constructor(
    private readonly founderConsultManagementService: FounderConsultManagementService,
  ) {
    super();
  }

  /**
   * find one latest
   * @param founderConsultNo
   */
  @Get('/admin/founder-consult/:id([0-9]+)/founder-consult-management')
  async findLatestOne(
    @Param('id', ParseIntPipe) founderConsultNo: number,
  ): Promise<FounderConsultManagement> {
    return await this.founderConsultManagementService.findOneLatestForCompanyUser(
      founderConsultNo,
    );
  }

  /**
   * 이략 구해오기
   * @param founderConsultNo
   * @param pagination
   */
  @Get('/admin/founder-consult/:id([0-9]+)/founder-consult-management/history')
  async findOneHistory(
    @Param('id', ParseIntPipe) founderConsultNo: number,
    @Query() pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<FounderConsultManagement>> {
    return await this.founderConsultManagementService.findAllforFounderConsult(
      founderConsultNo,
      pagination,
    );
  }
}
