import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository, EntityManager } from 'typeorm';
import { NanudaArticleListDto } from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';

@Injectable()
export class NanudaArticleService extends BaseService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * find for nanuda user
   * @param nanudaArticleListDto
   * @param pagination
   */
  async findAllForNanudaUser(
    nanudaArticleListDto: NanudaArticleListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Article>> {
    const qb = this.articleRepo
      .createQueryBuilder('article')
      .AndWhereLike(
        'article',
        'title',
        nanudaArticleListDto.title,
        nanudaArticleListDto.exclude('title'),
      )
      .AndWhereLike(
        'article',
        'mediaName',
        nanudaArticleListDto.mediaName,
        nanudaArticleListDto.exclude('mediaName'),
      )
      .WhereAndOrder(nanudaArticleListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find article
   * @param articleNo
   */
  async findOneForNanudaUser(articleNo: number): Promise<Article> {
    const article = await this.articleRepo.findOne(articleNo);
    if (!article) {
      throw new NotFoundException();
    }
    return article;
  }
}
