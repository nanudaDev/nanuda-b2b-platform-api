import { Controller, Query, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { CodeManagementService } from './code-management.service';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { CodeManagement } from './code-management.entity';

@Controller()
@ApiTags('CODE MANAGEMENT')
export class CodeManagementController extends BaseController {
  constructor(private readonly codeManagementService: CodeManagementService) {
    super();
  }

  /**
   * find all for company user
   * @param pagination
   */
  @Get('/code-management')
  async findAll(
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<CodeManagement>> {
    return await this.codeManagementService.findAllForHome(pagination);
  }

  /**
   * find fonuder consult codes
   */
  @Get('/code-management/founder-consult')
  async findFounderConsultCodes(): Promise<CodeManagement[]> {
    return await this.codeManagementService.findFounderConsultCodes();
  }

  /**
   * find fonuder consult codes
   */
  @Get('/code-management/b2b-founder-consult')
  async findB2bFounderConsultCodes(): Promise<CodeManagement[]> {
    return await this.codeManagementService.findDeliveryFounderConsultCodes();
  }

  /**
   * find fonuder consult codes
   */
  @Get('/code-management/available-times')
  async findAvailableTimes(): Promise<CodeManagement[]> {
    return await this.codeManagementService.findAvailableTimes();
  }

  /**
   * find gender
   */
  @Get('/code-management/gender')
  async findGenderTypes(): Promise<CodeManagement[]> {
    return await this.codeManagementService.findGenderTypes();
  }

  @Get('/code-management/inquiry')
  async findInquiryCodes(): Promise<CodeManagement[]> {
    return await this.codeManagementService.findInquiryTypes();
  }

  @Get('/code-management/notice-board')
  async findNoticeBoardCodes(): Promise<CodeManagement[]> {
    return await this.codeManagementService.findAnyTypes('NOTICE_BOARD');
  }

  @Get('/code-management/account-status')
  async findNoticeApprovalCodes(): Promise<CodeManagement[]> {
    return await this.codeManagementService.findAnyTypes('APPROVAL_STATUS');
  }
}
