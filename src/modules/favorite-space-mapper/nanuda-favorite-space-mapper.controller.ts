import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { FavoriteSpaceMapperCreateDto } from './dto';
import { FavoriteSpaceMapper } from './favorite-space-mapper.entity';
import { FavoriteSpaceMapperService } from './favorite-space-mapper.service';

@Controller()
@ApiTags('NANUDA FAVORITE SPACES')
export class NanudaFavoriteSpaceMapperController extends BaseController {
  constructor(
    private readonly favoriteSpaceMapperService: FavoriteSpaceMapperService,
  ) {
    super();
  }

  /**
   * create new favorite
   * dto로 보내는 것이 아니기 때문에 타입체크는 일단 해제한다.
   * @param favoriteSpaceMapperCreateDto
   */
  @Post('/nanuda/favorite-space')
  async create(
    @Body() favoriteSpaceMapperCreateDto,
  ): Promise<FavoriteSpaceMapper> {
    console.log(123);
    return await this.favoriteSpaceMapperService.create(
      favoriteSpaceMapperCreateDto,
    );
  }

  /**
   * delete
   * @param favoriteSpaceMapperNo
   */
  @Delete('/nanuda/favorite-space/:id([0-9]+)')
  async delete(@Param('id', ParseIntPipe) favoriteSpaceMapperNo: number) {
    console.log(123);
    return {
      isDeleted: await this.favoriteSpaceMapperService.deleteFavorite(
        favoriteSpaceMapperNo,
      ),
    };
  }
}
