import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import { NanudaAttendeesOnlineCreateDto } from './dto';
import { NanudaAttendeesOnlineService } from './nanuda-user-attendees-online.service';
@Controller()
@ApiTags('ATTENDEES ONLINE')
export class NanudaAttendeesOnlineController extends BaseController {
  constructor(
    private readonly attendeesOnlineService: NanudaAttendeesOnlineService,
  ) {
    super();
  }

  /**
   * create online attendee
   * @param nanudaAttendeesOnlineCreateDto
   */
  @Post('/nanuda/attendees-online')
  async createAttendee(
    @Body() nanudaAttendeesOnlineCreateDto: NanudaAttendeesOnlineCreateDto,
  ) {
    return await this.attendeesOnlineService.createAttendees(
      nanudaAttendeesOnlineCreateDto,
    );
  }
}
