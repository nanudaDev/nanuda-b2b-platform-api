import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BaseController } from 'src/core';
import {
  NanudaAttendeesOnlineCreateDto,
  NanudaSecondMeetingApplyDto,
} from './dto';
import { NanudaAttendeesOnlineService } from './nanuda-user-attendees-online.service';
import { SecondMeetingApplicant } from './second-meeting-applicant.entity';
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
    @Req() req: Request,
  ) {
    return await this.attendeesOnlineService.createAttendees(
      nanudaAttendeesOnlineCreateDto,
      req,
    );
  }

  /**
   * second meeting applicant create
   * @param secondMeetingApplicantDto
   */
  @Post('/nanuda/second-meeting-applicant')
  async secondMeetingApplicantCreate(
    @Body() secondMeetingApplicantDto: NanudaSecondMeetingApplyDto,
  ): Promise<SecondMeetingApplicant> {
    return await this.attendeesOnlineService.secondMeetingApplicateCreate(
      secondMeetingApplicantDto,
    );
  }
}
