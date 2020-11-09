import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { NanudaPresentationEventService } from './nanuda-presentation-event.service';
import { PresentationEvent } from './presentation-event.entity';
import { PresentationEventService } from './presentation-event.service';

@Controller()
@ApiTags('NANUDA PRESENTATION EVENT')
export class NanudaPresentationEventController extends BaseController {
  constructor(
    private readonly nanudaPresentationEventService: NanudaPresentationEventService,
  ) {
    super();
  }

  /**
   * find one for nanuda user
   * @param eventNo
   */
  @Get('/nanuda/presentation-event/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) eventNo: number,
  ): Promise<PresentationEvent> {
    return await this.nanudaPresentationEventService.findOne(eventNo);
  }
}
