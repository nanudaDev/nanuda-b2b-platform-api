import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  UseGuards,
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Body,
  Patch,
} from '@nestjs/common';
import { AuthRolesGuard, CONST_COMPANY_USER, BaseController } from 'src/core';
import { FounderConsultService } from './founder-consult.service';
import { CompanyUser } from '../company-user/company-user.entity';
import { FounderConsultListDto, FounderConsultUpdateDto } from './dto';
import { PaginatedRequest, PaginatedResponse, UserInfo } from 'src/common';
import { FounderConsult } from './founder-consult.entity';

@Controller()
@ApiTags('FOUNDER CONSULT')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
export class FounderConsultController extends BaseController {
  constructor(private readonly founderConsultService: FounderConsultService) {
    super();
  }

  /**
   * find all for company user
   * @param companyUser
   * @param founderConsultListDto
   * @param pagination
   */
  @Get('/founder-consult')
  async findAll(
    @UserInfo() companyUser: CompanyUser,
    @Query() founderConsultListDto: FounderConsultListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<FounderConsult>> {
    return await this.founderConsultService.findForCompanyUser(
      companyUser.companyNo,
      founderConsultListDto,
      pagination,
    );
  }

  /**
   * find one for company user
   * @param companyUser
   * @param founderConsultNo
   */
  @Get('/founder-consult/:id([0-9]+)')
  async findOne(
    @UserInfo() companyUser: CompanyUser,
    @Param('id', ParseIntPipe) founderConsultNo: number,
  ): Promise<FounderConsult> {
    return await this.founderConsultService.findOneForCompanyUser(
      companyUser.companyNo,
      founderConsultNo,
      companyUser.no,
    );
  }

  /**
   * founder consult update
   * @param companyUser
   * @param founderConsultNo
   * @param founderConsultUpdateDto
   */
  @Patch('/founder-consult/:id([0-9]+)')
  async updateFounderConsultStatus(
    @UserInfo() companyUser: CompanyUser,
    @Param('id', ParseIntPipe) founderConsultNo: number,
    @Body() founderConsultUpdateDto: FounderConsultUpdateDto,
  ): Promise<FounderConsult> {
    return await this.founderConsultService.updateFounderConsultByCompanyUser(
      companyUser.companyNo,
      founderConsultNo,
      founderConsultUpdateDto,
    );
  }
}
