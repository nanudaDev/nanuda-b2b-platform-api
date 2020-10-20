import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { NanudaHomepageService } from './nanuda-homepage.service';

@Controller()
@ApiTags('NANUDA HOMEPAGE')
export class NanudaHomepageController extends BaseController {
  constructor(private readonly nanudaHomepageService: NanudaHomepageService) {
    super();
  }

  /**
   * best both delivery and restaurant space
   */
  @Get('/nanuda/homepage/best-space')
  async findAll() {
    return await this.nanudaHomepageService.findBestSpaces();
  }

  /**
   * best delivery spaces
   */
  @Get('/nanuda/best-delivery-spaces')
  async findBestDeliverySpaces() {
    return await this.nanudaHomepageService.findBestDeliverySpaces();
  }

  /**
   * best restaurant kitchen spaces
   */
  @Get('/nanuda/best-restaurant-kitchen')
  async findBestRestaurantKitchen() {
    return await this.nanudaHomepageService.findBestRestaurantSpaces();
  }
}
