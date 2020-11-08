import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { AuthRolesGuard, BaseController, CONST_ADMIN_USER } from 'src/core';
import {
  AdminPresentationEventCreateDto,
  AdminPresentationEventListDto,
  AdminPresentationEventUpdateeDto,
} from './dto';
import { PresentationEvent } from './presentation-event.entity';
import { PresentationEventService } from './presentation-event.service';

@Controller()
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
@ApiTags('ADMIN PRESENTATION EVENT')
export class AdminPresentationEventController extends BaseController {
  constructor(
    private readonly presentationEventService: PresentationEventService,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminPresentationEventListDto
   * @param pagination
   */
  @Get('/admin/presentation-event')
  async findAll(
    @Query() adminPresentationEventListDto: AdminPresentationEventListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<PresentationEvent>> {
    return await this.presentationEventService.findAllForAdmin(
      adminPresentationEventListDto,
      pagination,
    );
  }

  @Get('/admin/presentation-event/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) presentationEventNo: number,
  ): Promise<PresentationEvent> {
    return await this.presentationEventService.findOne(presentationEventNo);
  }

  /**
   * create for admin
   * @param adminPresentationEventCreatDto
   */
  @Post('/admin/presentation-event')
  async create(
    @Body() adminPresentationEventCreatDto: AdminPresentationEventCreateDto,
  ): Promise<PresentationEvent> {
    return await this.presentationEventService.createForAdmin(
      adminPresentationEventCreatDto,
    );
  }

  /**
   * update for admin
   * @param presentationEventNo
   * @param adminPresentationEventUpdateDto
   */
  @Patch('/admin/presentation-event/:id([0-9]+)')
  async updateForAdmin(
    @Param('id', ParseIntPipe) presentationEventNo: number,
    @Body() adminPresentationEventUpdateDto: AdminPresentationEventUpdateeDto,
  ): Promise<PresentationEvent> {
    return await this.presentationEventService.updateForAdmin(
      presentationEventNo,
      adminPresentationEventUpdateDto,
    );
  }
}
