import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Article } from './article.entity';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { AdminArticleListDto, AdminArticleCreateDto } from './dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { AdminArticleUpdateDto } from './dto/admin-article-update.dto';

@Injectable()
export class ArticleService extends BaseService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly fileUploadService: FileUploadService,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminArticleListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminArticleListDto: AdminArticleListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Article>> {
    const qb = this.articleRepo
      .createQueryBuilder('article')
      .CustomLeftJoinAndSelect(['admin'])
      .AndWhereLike(
        'admin',
        'name',
        adminArticleListDto.adminName,
        adminArticleListDto.exclude('adminName'),
      )
      .AndWhereLike(
        'article',
        'title',
        adminArticleListDto.title,
        adminArticleListDto.exclude('title'),
      )
      .AndWhereLike(
        'article',
        'url',
        adminArticleListDto.url,
        adminArticleListDto.exclude('url'),
      )
      .AndWhereLike(
        'article',
        'mediaName',
        adminArticleListDto.mediaName,
        adminArticleListDto.exclude('mediaName'),
      )
      .WhereAndOrder(adminArticleListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find one for admin
   * @param articleNo
   */
  async findOneForAdmin(articleNo: number): Promise<Article> {
    const article = await this.articleRepo
      .createQueryBuilder('article')
      .CustomLeftJoinAndSelect(['admin'])
      .where('article.no = :no', { no: articleNo })
      .getOne();

    if (!article) {
      throw new NotFoundException();
    }

    return article;
  }

  /**
   * create for admin
   * @param adminNo
   * @param adminArticleCreateDto
   */
  async createForAdmin(
    adminNo: number,
    adminArticleCreateDto: AdminArticleCreateDto,
  ): Promise<Article> {
    let newArticle = new Article(adminArticleCreateDto);
    newArticle.adminNo = adminNo;
    if (newArticle.image && newArticle.image.length > 0) {
      newArticle.image = await this.fileUploadService.moveS3File(
        newArticle.image,
      );
      if (!newArticle.image) {
        throw new BadRequestException({
          message: 'Upload failed!',
        });
      }
    }
    newArticle = await this.articleRepo.save(newArticle);

    return newArticle;
  }

  /**
   * update for admin
   * @param adminNo
   * @param articleNo
   * @param adminArticleUpdateDto
   */
  async updateForAdmin(
    adminNo: number,
    articleNo: number,
    adminArticleUpdateDto: AdminArticleUpdateDto,
  ): Promise<Article> {
    let article = await this.articleRepo.findOne(articleNo);
    if (!article) {
      throw new NotFoundException();
    }
    article = article.set(article);
    if (article.image && article.image.length > 0) {
      article.image = await this.fileUploadService.moveS3File(article.image);
      if (!article.image) {
        throw new BadRequestException({
          message: 'Upload failed!',
        });
      }
    }
    article.adminNo = adminNo;
    article = await this.articleRepo.save(article);
    return article;
  }

  /**
   * delete for admin
   * @param articleNo
   */
  async deleteForAdmin(articleNo: number) {
    const qb = await this.articleRepo
      .createQueryBuilder()
      .delete()
      .from(Article)
      .where('no = :no', { no: articleNo })
      .execute();

    return qb.affected;
  }
}
