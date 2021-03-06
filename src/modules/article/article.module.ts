import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { ArticleService } from './article.service';
import { NanudaArticleService } from './nanuda-article.service';
import { AdminArticleController } from './admin-article.controller';
import { NanudaArticleController } from './nanuda-article.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), FileUploadModule],
  controllers: [AdminArticleController, NanudaArticleController],
  providers: [ArticleService, NanudaArticleService],
})
export class ArticleModule {}
