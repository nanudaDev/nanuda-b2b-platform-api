import { BaseController, AuthRolesGuard, CONST_COMPANY_USER } from 'src/core';
import { NoticeBoardService } from './notice-board.service';
import {
  Get,
  Query,
  Controller,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { NoticeBoardListDto } from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { NoticeBoard } from './notice-board.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth()
@ApiTags('NOTICE BOARD')
@UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
export class NoticeBoardController extends BaseController {
  constructor(private readonly noticeBoardService: NoticeBoardService) {
    super();
  }

  /**
   * find all for company user
   * @param noticeBoardListDto
   * @param pagination
   */
  @Get('/notice-board')
  async findAll(
    @Query() noticeBoardListDto: NoticeBoardListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<NoticeBoard>> {
    return await this.noticeBoardService.findAll(
      noticeBoardListDto,
      pagination,
    );
  }

  /**
   * notice board find one
   * @param noticeBoardNo
   */
  @Get('/notice-board/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) noticeBoardNo: number,
  ): Promise<NoticeBoard> {
    return await this.noticeBoardService.findOne(noticeBoardNo);
  }
}
