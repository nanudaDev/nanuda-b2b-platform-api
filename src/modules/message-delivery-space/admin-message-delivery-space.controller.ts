import { Controller, Get, Post, Query } from '@nestjs/common';
import { BaseController } from 'src/core';
import { MessageDeliverySpaceService } from './admin-message-delivery-space.service';
import { MessageFloatingPopulationDto } from './dto';

@Controller()
export class AdminMessageDeliverySpaceController extends BaseController {
  constructor(
    private readonly messageDeliverySpaceService: MessageDeliverySpaceService,
  ) {
    super();
  }

  /**
   * find floating population
   * @param messageFloatingPopulationDto
   */
  @Get('/admin/message-delivery-space')
  async findFloatingPopulation(
    @Query() messageFloatingPopulationDto: MessageFloatingPopulationDto,
  ) {
    return await this.messageDeliverySpaceService.findFloatingPopulation(
      messageFloatingPopulationDto,
    );
  }
}
