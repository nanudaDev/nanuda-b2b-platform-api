import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { NanudaArticleService } from './nanuda-article.service';
import { NanudaArticleListDto } from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { Article } from './article.entity';

@Controller()
@ApiTags('NANUDA ARTICLE')
export class NanudaArticleController extends BaseController {
  constructor(private readonly nanudaArticleService: NanudaArticleService) {
    super();
  }

  /**
   * find all for nanuda user
   * @param nanudaArticleListDto
   * @param pagination
   */
  @Get('/nanuda/article')
  async findAll(
    @Query() nanudaArticleListDto: NanudaArticleListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Article>> {
    return await this.nanudaArticleService.findAllForNanudaUser(
      nanudaArticleListDto,
      pagination,
    );
  }

  /**
   * find one
   * @param articleNo
   */
  @Get('/nanuda/article/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) articleNo: number,
  ): Promise<Article> {
    return await this.nanudaArticleService.findOneForNanudaUser(articleNo);
  }
}
