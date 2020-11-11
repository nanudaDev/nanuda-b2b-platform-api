import { Controller, Post, Body, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { Attendees } from './attendees.entity';
import { NanudaAttendeesCreateDto } from './dto';
import { NanudaAttendeesService } from './nanuda-attendees.service';
import { Request } from 'express';

@Controller()
@ApiTags('NANUDA ATTENDEES')
export class NanudaAttendeesController extends BaseController {
  constructor(private readonly nanudaAttendeesService: NanudaAttendeesService) {
    super();
  }

  /**
   * create for nanuda user
   * @param nanudaAttendeesCreateDto
   */
  @Post('/nanuda/attendees')
  async create(
    @Body() nanudaAttendeesCreateDto: NanudaAttendeesCreateDto,
    @Req() req?: Request,
  ): Promise<Attendees> {
    return await this.nanudaAttendeesService.createForNanudaUser(
      nanudaAttendeesCreateDto,
      req,
    );
  }
}
