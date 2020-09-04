import {
  Controller,
  UseGuards,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { UserInfo, PaginatedRequest, PaginatedResponse } from 'src/common';
import { Admin } from '../admin';
import {
  AdminInquiryReplyCreateDto,
  AdminInquiryListDto,
  AdminInquiryReplyUpdateDto,
  AdminInquiryReplyListDto,
} from './dto';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './inquiry.entity';

@Controller()
@ApiBearerAuth()
@ApiTags('ADMIN INQUIRY')
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminInquiryController extends BaseController {
  constructor(private readonly inquiryService: InquiryService) {
    super();
  }

  /**
   * create reply
   * @param admin
   * @param inquiryNo
   * @param adminInquiryReplyCreateDto
   */
  @Post('/admin/inquiry/:id([0-9]+)/reply')
  async createReply(
    @UserInfo() admin: Admin,
    @Param('id', ParseIntPipe) inquiryNo: number,
    @Body() adminInquiryReplyCreateDto: AdminInquiryReplyCreateDto,
  ): Promise<Inquiry> {
    return await this.inquiryService.createReply(
      admin.no,
      inquiryNo,
      adminInquiryReplyCreateDto,
    );
  }

  /**
   * update existing inquiry reply
   * @param inquiryNo
   * @param inquiryReplyNo
   * @param admin
   * @param adminInquiryReplyUpdateDto
   */
  @Patch('/admin/inquiry/:id([0-9]+)/reply/:replyId([0-9]+)')
  async updateReply(
    @Param('id', ParseIntPipe) inquiryNo: number,
    @Param('replyId', ParseIntPipe) inquiryReplyNo: number,
    @UserInfo() admin: Admin,
    @Body() adminInquiryReplyUpdateDto: AdminInquiryReplyUpdateDto,
  ): Promise<Inquiry> {
    return await this.inquiryService.editReplyForAdmin(
      inquiryReplyNo,
      inquiryNo,
      admin.no,
      adminInquiryReplyUpdateDto,
    );
  }
  /**
   * find all inquiries
   * @param adminInquiryListDto
   * @param pagination
   */
  @Get('/admin/inquiry')
  async findInquiry(
    @Query() adminInquiryListDto: AdminInquiryListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Inquiry>> {
    return await this.inquiryService.findAllForAdmin(
      adminInquiryListDto,
      pagination,
    );
  }

  /**
   * find one
   * @param inquiryNo
   */
  @Get('/admin/inquiry/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) inquiryNo: number,
  ): Promise<Inquiry> {
    return await this.inquiryService.findOneInquiryForAdmin(inquiryNo);
  }

  /**
   * find all replies for inquiry
   * @param inquiryNo
   * @param adminInquiryReplyListDto
   * @param pagination
   */
  @Get('/admin/inquiry/:id([0-9]+)/reply')
  async findAllReplies(
    @Param('id', ParseIntPipe) inquiryNo: number,
    @Query() adminInquiryReplyListDto: AdminInquiryReplyListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Inquiry>> {
    return await this.inquiryService.findAllRepliesForAdmin(
      inquiryNo,
      adminInquiryReplyListDto,
      pagination,
    );
  }

  /**
   * close inquiry
   * @param inquiryNo
   */
  @Patch('/admin/inquiry/:id([0-9]+)/close')
  async close(@Param('id', ParseIntPipe) inquiryNo: number): Promise<Inquiry> {
    return await this.inquiryService.closeInquiry(inquiryNo);
  }
}
