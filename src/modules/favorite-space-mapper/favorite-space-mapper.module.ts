import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteSpaceMapper } from './favorite-space-mapper.entity';
import { NanudaFavoriteSpaceMapperController } from './nanuda-favorite-space-mapper.controller';
import { FavoriteSpaceMapperService } from './favorite-space-mapper.service';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteSpaceMapper])],
  controllers: [NanudaFavoriteSpaceMapperController],
  providers: [FavoriteSpaceMapperService],
})
export class FavoriteSpaceMapperModule {}
