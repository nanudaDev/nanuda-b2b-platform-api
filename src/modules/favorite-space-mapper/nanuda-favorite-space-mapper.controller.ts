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
import { FavoriteSpaceMapperService } from './nanuda-favorite-space-mapper.service';
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
   * find favorite space delivery
   * @param nanudaFavoriteSpaceMapperListDto
   * @param pagination
   */
  @Get('/nanuda/my-favorite-delivery')
  async findMyFavoriteDelivery(
    @Query() nanudaFavoriteSpaceMapperListDto: NanudaFavoriteSpaceMapperListDto,
    @Query() pagination?: PaginatedRequest,
  ) {
    return await this.favoriteSpaceMapperService.findFavoritedDeliverySpace(
      nanudaFavoriteSpaceMapperListDto,
      pagination,
    );
  }

  /**
   * find favorite space restaurant
   * @param nanudaFavoriteSpaceMapperListDto
   * @param pagination
   */
  @Get('/nanuda/my-favorite-restaurant')
  async findMyFavoriteRestaurant(
    @Query() nanudaFavoriteSpaceMapperListDto: NanudaFavoriteSpaceMapperListDto,
    @Query() pagination?: PaginatedRequest,
  ) {
    return await this.favoriteSpaceMapperService.findFavoriteRestaurantSpace(
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
    return await this.favoriteSpaceMapperService.create(
      favoriteSpaceMapperCreateDto,
    );
  }

  /**
   * delete
   * @param favoriteSpaceMapperNo
   */
  @Delete('/nanuda/favorite-space')
  async delete(
    @Query() deliverySpaceNo,
    @Query() nanudaUserNo,
    @Query() spaceTypeNo,
  ) {
    return {
      isDeleted: await this.favoriteSpaceMapperService.deleteFavorite(
        deliverySpaceNo.deliverySpaceNo,
        nanudaUserNo.nanudaUserNo,
        spaceTypeNo.spaceTypeNo,
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
    return {
      isDeletedCount: await this.favoriteSpaceMapperService.deleteMultiple(
        deleteDto,
        deleteDto.nanudaUserNo,
      ),
    };
  }

  /**
   * check for restaurant space
   * @param nanudaUserNo
   * @param spaceNo
   */
  @Get('/nanuda/favorite-space/check-restauraunt-kitchen')
  async checkForRestaurantKitchen(@Query() favoriteQuery) {
    return {
      isLiked: await this.favoriteSpaceMapperService.checkForRestaurantKitchen(
        favoriteQuery,
      ),
    };
  }

  /**
   * get count
   * @param favoriteQuery
   */
  @Get('/nanuda/favorite-space/check-count-restaurant-kitchen')
  async checkCountForRestaurantKitchen(@Query() favoriteQuery) {
    return await this.favoriteSpaceMapperService.checkCountForRestaurantKitchen(
      favoriteQuery,
    );
  }
}
