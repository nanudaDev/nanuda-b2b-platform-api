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
import { AuthRolesGuard, CONST_COMPANY_USER, BaseController } from 'src/core';
import { FounderConsultManagementService } from './founder-consult-management.service';
import { UserInfo, PaginatedRequest, PaginatedResponse } from 'src/common';
import { CompanyUser } from '../company-user/company-user.entity';
import { FounderConsultManagement } from './founder-consult-management.entity';
import { FounderConsultManagementCreateDto } from './dto';

@Controller()
@ApiBearerAuth()
@ApiTags('FOUNDER CONSULT MANAGEMENT')
@UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
export class FounderConsultManagementController extends BaseController {
  constructor(
    private readonly founderConsultManagementService: FounderConsultManagementService,
  ) {
    super();
  }

  /**
   * find one latest
   * @param founderConsultNo
   */
  @Get('/founder-consult/:id([0-9]+)/founder-consult-management')
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
  @Get('/founder-consult/:id([0-9]+)/founder-consult-management/history')
  async findOneHistory(
    @Param('id', ParseIntPipe) founderConsultNo: number,
    @Query() pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<FounderConsultManagement>> {
    return await this.founderConsultManagementService.findAllforFounderConsult(
      founderConsultNo,
      pagination,
    );
  }

  /**
   * create founder consult management
   * @param founderConsultNo
   * @param companyUser
   * @param founderConsultManagementCreateDto
   */
  @Post('/founder-consult/:id([0-9]+)/founder-consult-management')
  async create(
    @Param('id', ParseIntPipe) founderConsultNo: number,
    @UserInfo() companyUser: CompanyUser,
    @Body()
    founderConsultManagementCreateDto: FounderConsultManagementCreateDto,
  ): Promise<FounderConsultManagement> {
    return await this.founderConsultManagementService.create(
      founderConsultNo,
      companyUser.no,
      founderConsultManagementCreateDto,
    );
  }
}
