import {
  Controller,
  UseGuards,
  Get,
  Query,
  ParseIntPipe,
  Param,
  Body,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { ArticleService } from './article.service';
import { AdminArticleListDto, AdminArticleCreateDto } from './dto';
import { PaginatedRequest, PaginatedResponse, UserInfo } from 'src/common';
import { Article } from './article.entity';
import { Admin } from '../admin';
import { AdminArticleUpdateDto } from './dto/admin-article-update.dto';

@Controller()
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
@ApiTags('ADMIN ARTICLE')
export class AdminArticleController extends BaseController {
  constructor(private readonly articleService: ArticleService) {
    super();
  }

  /**
   * find all
   * @param adminArticleListDto
   * @param pagination
   */
  @Get('/admin/article')
  async findAll(
    @Query() adminArticleListDto: AdminArticleListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Article>> {
    return await this.articleService.findAllForAdmin(
      adminArticleListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param articleNo
   */
  @Get('/admin/article/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) articleNo: number,
  ): Promise<Article> {
    return await this.articleService.findOneForAdmin(articleNo);
  }

  /**
   * create
   * @param admin
   * @param adminArticleCreateDto
   */
  @Post('/admin/article')
  async create(
    @UserInfo() admin: Admin,
    @Body() adminArticleCreateDto: AdminArticleCreateDto,
  ): Promise<Article> {
    return await this.articleService.createForAdmin(
      admin.no,
      adminArticleCreateDto,
    );
  }

  /**
   * update
   * @param articleNo
   * @param admin
   * @param adminArticleUpdateDto
   */
  @Patch('/admin/article/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) articleNo: number,
    @UserInfo() admin: Admin,
    @Body() adminArticleUpdateDto: AdminArticleUpdateDto,
  ): Promise<Article> {
    return await this.articleService.updateForAdmin(
      admin.no,
      articleNo,
      adminArticleUpdateDto,
    );
  }

  /**
   * delete
   * @param articleNo
   */
  @Delete('/admin/article/:id([0-9]+)')
  async delete(@Param('id', ParseIntPipe) articleNo: number) {
    return {
      isDeletedCount: await this.articleService.deleteForAdmin(articleNo),
    };
  }
}
