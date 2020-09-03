import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { NoticeBoardService } from './notice-board.service';
import { NoticeBoard } from './notice-board.entity';
import { UserInfo, PaginatedRequest, PaginatedResponse } from 'src/common';
import { Admin } from '../admin';
import {
  AdminNoticeBoardCreateDto,
  AdminNoticeBoardListDto,
  AdminNoticeBoardUpdateeDto,
} from './dto';

@Controller()
@ApiBearerAuth()
@ApiTags('ADMIN NOTICE BOARD')
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminNoticeBoardController extends BaseController {
  constructor(private readonly noticeBoardService: NoticeBoardService) {
    super();
  }

  @Post('/admin/notice-board')
  async create(
    @UserInfo() admin: Admin,
    @Body() adminNoticeBoardCreateDto: AdminNoticeBoardCreateDto,
  ): Promise<NoticeBoard> {
    return await this.noticeBoardService.create(
      admin.no,
      adminNoticeBoardCreateDto,
    );
  }

  /**
   * find all
   * @param adminNoticeBoardListDto
   * @param pagination
   */
  @Get('/admin/notice-board')
  async findAll(
    @Query() adminNoticeBoardListDto: AdminNoticeBoardListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<NoticeBoard>> {
    return await this.noticeBoardService.findAll(
      adminNoticeBoardListDto,
      pagination,
    );
  }

  /**
   * find one
   * @param noticeBoardNo
   */
  @Get('/admin/notice-board/:id([0-9]+)')
  async findOne(@Param('id', ParseIntPipe) noticeBoardNo: number) {
    return await this.noticeBoardService.findOneForAdmin(noticeBoardNo);
  }

  @Patch('/admin/notice-board/:id([0-9]+)')
  async update(
    @UserInfo() admin: Admin,
    @Param('id', ParseIntPipe) noticeBoardNo: number,
    @Body() adminNoticeBoardUpdateDto: AdminNoticeBoardUpdateeDto,
  ) {
    return await this.noticeBoardService.update(
      admin.no,
      noticeBoardNo,
      adminNoticeBoardUpdateDto,
    );
  }

  /**
   * delete notice board
   * @param noticeBoardNo
   */
  @Delete('/admin/notice-board/:id([0-9]+)')
  async deleteNoticeBoard(@Param('id', ParseIntPipe) noticeBoardNo: number) {
    return await this.noticeBoardService.deleteNoticeBoard(noticeBoardNo);
  }
}
