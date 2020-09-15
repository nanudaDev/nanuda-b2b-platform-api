import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import {
  FavoriteSpaceMapperCreateDto,
  NanudaFavoriteSpaceMapperListDto,
  NanudaFavoriteSpaceMapperDeleteDto,
} from './dto';
import { FavoriteSpaceMapper } from './favorite-space-mapper.entity';
import { FavoriteSpaceMapperService } from './favorite-space-mapper.service';
import { PaginatedRequest, PaginatedResponse } from 'src/common';

@Controller()
@ApiTags('NANUDA FAVORITE SPACES')
export class NanudaFavoriteSpaceMapperController extends BaseController {
  constructor(
    private readonly favoriteSpaceMapperService: FavoriteSpaceMapperService,
  ) {
    super();
  }

  /**
   * find favorite space
   * @param nanudaFavoriteSpaceMapperListDto
   * @param pagination
   */
  @Get('/nanuda/my-favorite')
  async findMyFavorite(
    @Query() nanudaFavoriteSpaceMapperListDto: NanudaFavoriteSpaceMapperListDto,
    @Query() pagination?: PaginatedRequest,
  ) {
    return await this.favoriteSpaceMapperService.findFavoritedSpace(
      nanudaFavoriteSpaceMapperListDto,
      pagination,
    );
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
  @Delete('/nanuda/favorite-space')
  async delete(@Query() deliverySpaceNo, @Query() nanudaUserNo) {
    return {
      isDeleted: await this.favoriteSpaceMapperService.deleteFavorite(
        deliverySpaceNo.deliverySpaceNo,
        nanudaUserNo.nanudaUserNo,
      ),
    };
  }

  /**
   * delete multiple
   * @param nanudaFavoriteSpaceMapperDeleteDto
   * @param nanudaUserNo
   */
  @Delete('/nanuda/favorite-space/multiple')
  async multipleDelete(@Body() deleteDto: NanudaFavoriteSpaceMapperDeleteDto) {
    console.log(deleteDto);
    return {
      isDeletedCount: await this.favoriteSpaceMapperService.deleteMultiple(
        deleteDto,
        deleteDto.nanudaUserNo,
      ),
    };
  }
}
