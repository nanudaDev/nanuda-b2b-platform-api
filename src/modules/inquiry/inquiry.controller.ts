import {
  Controller,
  UseGuards,
  Get,
  Body,
  Post,
  Param,
  ParseIntPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AuthRolesGuard,
  CONST_ADMIN_USER,
  BaseController,
  CONST_COMPANY_USER,
} from 'src/core';
import { InquiryService } from './inquiry.service';
import { UserInfo, PaginatedRequest, PaginatedResponse } from 'src/common';
import { CompanyUser } from '../company-user/company-user.entity';
import {
  InquiryCreateDto,
  InquiryReplyCreateDto,
  InquiryReplyListDto,
} from './dto';
import { Inquiry } from './inquiry.entity';
import { Company } from '../company/company.entity';
import { InquiryListDto } from './dto/inquiry-list.dto';
import { InquiryReplyUpdateDto } from './dto/inquiry-reply-update.dto';

@Controller()
@ApiBearerAuth()
@ApiTags('INQUIRY')
@UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
export class InquiryController extends BaseController {
  constructor(private readonly inquiryService: InquiryService) {
    super();
  }

  /**
   * create inquiry
   * @param companyUser
   * @param inquiryCreateDto
   */
  @Post('/inquiry')
  async create(
    @UserInfo() companyUser: CompanyUser,
    @Body() inquiryCreateDto: InquiryCreateDto,
  ): Promise<Inquiry> {
    return await this.inquiryService.createInquiry(
      companyUser.no,
      companyUser.companyNo,
      inquiryCreateDto,
    );
  }

  /**
   * create reply for inquiry
   * @param companyUser
   * @param inquiryNo
   * @param inquiryReplyCreateDto
   */
  @Post('/inquiry/:id([0-9]+)/reply')
  async reply(
    @UserInfo() companyUser: CompanyUser,
    @Param('id', ParseIntPipe) inquiryNo: number,
    @Body() inquiryReplyCreateDto: InquiryReplyCreateDto,
  ): Promise<Inquiry> {
    return await this.inquiryService.createReplyForCompanyUser(
      companyUser.no,
      companyUser.companyNo,
      inquiryNo,
      inquiryReplyCreateDto,
    );
  }

  /**
   * find inquiry for company user
   * @param companyUser
   * @param inquiryListDto
   * @param pagination
   */
  @Get('/inquiry')
  async findAll(
    @UserInfo() companyUser: CompanyUser,
    @Query() inquiryListDto: InquiryListDto,
    @Query() pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<Inquiry>> {
    return await this.inquiryService.findAllForCompanyUser(
      companyUser.companyNo,
      inquiryListDto,
      pagination,
    );
  }

  /**
   * find all replies
   * @param companyUser
   * @param inquiryNo
   * @param inquiryReplyListDto
   * @param pagination
   */
  @Get('/inquiry/:id([0-9]+)/reply')
  async findAllReply(
    @UserInfo() companyUser: CompanyUser,
    @Param('id', ParseIntPipe) inquiryNo: number,
    @Query() inquiryReplyListDto: InquiryReplyListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Inquiry>> {
    return await this.inquiryService.findAllRepliesForCompanyUser(
      inquiryNo,
      companyUser.companyNo,
      inquiryReplyListDto,
      pagination,
    );
  }

  /**
   * find one reply
   * @param companyUser
   * @param inquiryNo
   * @param inquiryReplyNo
   */
  @Get('/inquiry/:id([0-9]+)/reply/:replyId([0-9]+)')
  async findOneReply(
    @UserInfo() companyUser: CompanyUser,
    @Param('id', ParseIntPipe) inquiryNo: number,
    @Param('replyId', ParseIntPipe) inquiryReplyNo: number,
  ): Promise<Inquiry> {
    return await this.inquiryService.findOneReplyForCompanyUser(
      companyUser.companyNo,
      inquiryNo,
      inquiryReplyNo,
    );
  }
  /**
   * find one for company user
   * @param companyUser
   * @param inquiryNo
   */
  @Get('/inquiry/:id([0-9]+)')
  async findOne(
    @UserInfo() companyUser: CompanyUser,
    @Param('id', ParseIntPipe) inquiryNo: number,
  ): Promise<Inquiry> {
    return await this.inquiryService.findOneForCompanyUser(
      inquiryNo,
      companyUser.companyNo,
    );
  }

  /**
   * edit reply
   * @param inquiryNo
   * @param inquiryReplyNo
   * @param companyUser
   * @param inquiryReplyUpdateDto
   */
  @Patch('/inquiry/:id([0-9]+)/reply/:replyId([0-9]+)')
  async updateReply(
    @Param('id', ParseIntPipe) inquiryNo: number,
    @Param('replyId', ParseIntPipe) inquiryReplyNo: number,
    @UserInfo() companyUser: CompanyUser,
    @Body() inquiryReplyUpdateDto: InquiryReplyUpdateDto,
  ): Promise<Inquiry> {
    return await this.inquiryService.editReply(
      inquiryReplyNo,
      inquiryNo,
      companyUser.companyNo,
      companyUser.no,
      inquiryReplyUpdateDto,
    );
  }
}
