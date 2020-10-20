import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
  Inject,
  forwardRef,
  Body,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  BaseController,
  AuthRolesGuard,
  CONST_ADMIN_USER,
  SPACE_TYPE,
} from 'src/core';
import {
  AdminFounderConsultListDto,
  AdminFounderConsultUpdateDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse, UserInfo } from 'src/common';
import { FounderConsult } from './founder-consult.entity';
import { FounderConsultService } from './founder-consult.service';
import { Admin } from '../admin';

@Controller()
@ApiTags('ADMIN FOUNDER CONSULT')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminFounderConsultController extends BaseController {
  constructor(private readonly founderConsultService: FounderConsultService) {
    super();
  }

  /**
   * Find all for admin
   * @param adminFounderConsultListDto
   * @param pagination
   */
  @Get('/admin/founder-consult')
  async findAll(
    @Query() adminFounderConsultListDto: AdminFounderConsultListDto,
    @Query() pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<FounderConsult>> {
    return await this.founderConsultService.findAllForAdmin(
      adminFounderConsultListDto,
      pagination,
    );
  }

  /**
   * find one
   * @param founderConsultNo
   */
  @Get('/admin/founder-consult/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) founderConsultNo: number,
  ): Promise<FounderConsult> {
    return await this.founderConsultService.findOneForAdmin(founderConsultNo);
  }

  /**
   * find my consult
   * @param admin
   * @param pagination
   */
  @Get('/admin/my-founder-consults')
  async findMyConsults(
    @UserInfo() admin: Admin,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<FounderConsult>> {
    const founderConsultDto = new AdminFounderConsultListDto();
    founderConsultDto.adminNo = admin.no;
    founderConsultDto.spaceTypeNo = SPACE_TYPE.SPACE_SHARE;
    return await this.founderConsultService.findAllForAdmin(
      founderConsultDto,
      pagination,
    );
  }

  /**
   * update founder consult
   * @param founderConsultNo
   * @param adminFounderConsultUpdateDto
   */
  @Patch('/admin/founder-consult/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) founderConsultNo: number,
    @Body() adminFounderConsultUpdateDto: AdminFounderConsultUpdateDto,
  ): Promise<FounderConsult> {
    return await this.founderConsultService.updateForAdmin(
      founderConsultNo,
      adminFounderConsultUpdateDto,
    );
  }

  /**
   * reverse read status
   * @param companyNo
   */
  @Patch('/admin/founder-consult/:id([0-9]+)/reverse-read-status')
  async reverseReadStatus(
    @Param('id', ParseIntPipe) founderConsultNo: number,
  ): Promise<FounderConsult> {
    return await this.founderConsultService.reverseReadStatus(founderConsultNo);
  }
}
