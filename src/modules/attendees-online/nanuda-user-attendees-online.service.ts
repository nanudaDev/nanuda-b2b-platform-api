import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { YN } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { AttendeesOnline } from './attendees-online.entity';
import {
  NanudaAttendeesOnlineCreateDto,
  NanudaSecondMeetingApplyDto,
} from './dto';
import * as crypto from 'crypto';
import {
  B2CNanudaSlackNotificationService,
  NanudaSmsNotificationService,
} from 'src/core/utils';
import { Request } from 'express';
import * as moment from 'moment';
import { SecondMeetingApplicant } from './second-meeting-applicant.entity';

@Injectable()
export class NanudaAttendeesOnlineService extends BaseService {
  constructor(
    @InjectRepository(AttendeesOnline)
    private readonly attendeesOnlineRepo: Repository<AttendeesOnline>,
    @InjectRepository(SecondMeetingApplicant)
    private readonly secondMeetingApplicantRepo: Repository<
      SecondMeetingApplicant
    >,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly nanudaSmsNotificationService: NanudaSmsNotificationService,
    private readonly nanudaSlackNotification: B2CNanudaSlackNotificationService,
  ) {
    super();
  }

  /**
   * create nanuda user
   * @param nanudaAttendeesOnlineCreateDto
   */
  async createAttendees(
    nanudaAttendeesOnlineCreateDto: NanudaAttendeesOnlineCreateDto,
    req: Request,
  ): Promise<string | AttendeesOnline> {
    const days = 3;
    const todayDate = new Date().toISOString().slice(0, 10);
    const checkIfUser = await this.entityManager
      .getRepository(NanudaUser)
      .findOne({
        where: {
          phone: nanudaAttendeesOnlineCreateDto.phone,
          name: nanudaAttendeesOnlineCreateDto.name,
        },
      });
    const checkIfApplied = await this.attendeesOnlineRepo.findOne({
      where: {
        name: nanudaAttendeesOnlineCreateDto.name,
        phone: nanudaAttendeesOnlineCreateDto.phone,
      },
    });
    const iPExists = await this.attendeesOnlineRepo.findOne({
      where: { requestIp: nanudaAttendeesOnlineCreateDto.requestIp },
    });
    // if IP EXISTS
    if (iPExists) {
      return '가입한 IP주소입니다.';
    }
    //  if already applied
    if (checkIfApplied) {
      return '이미 신청한 전화번호입니다.';
    }
    let newAttendee = new AttendeesOnline(nanudaAttendeesOnlineCreateDto);
    newAttendee.tempCode = crypto.randomBytes(36).toString('hex');
    // console.log(newAttendee.tempCode);
    newAttendee = await this.attendeesOnlineRepo.save(newAttendee);
    // check if larger than three days or less
    const createdDate = new Date(newAttendee.createdAt);
    const appliedDate = new Date(newAttendee.presentationDate);
    const differenceInTime = appliedDate.getTime() - createdDate.getTime();
    const differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
    // check three day flag
    if (differenceInDays >= 3) {
      newAttendee.threeDayFlag = YN.YES;
      newAttendee.threeDayBeforeMessageDate = moment(appliedDate)
        .subtract(3, 'day')
        .format('YYYY-MM-DD');
    } else {
      newAttendee.threeDayFlag = YN.NO;
    }
    newAttendee.oneDayBeforeMessageDate = moment(appliedDate)
      .subtract(1, 'day')
      .format('YYYY-MM-DD');
    if (checkIfUser) {
      newAttendee.isNanudaUser = YN.YES;
    }
    await this.attendeesOnlineRepo.save(newAttendee);
    // await sms notification
    await this.nanudaSmsNotificationService.sendPresentationEventOnline(
      newAttendee,
      req,
    );
    // await slack notification
    newAttendee.totalAttendees = await this.attendeesOnlineRepo
      .createQueryBuilder('attendeesOnline')
      .getCount();
    newAttendee.attendeesByDate = await this.attendeesOnlineRepo
      .createQueryBuilder('attendeesOnline')
      .AndWhereOnDayOf(new Date(appliedDate).toISOString().slice(0, 10))
      .getCount();
    await this.nanudaSlackNotification.attendeesOnlineNotification(newAttendee);
    return newAttendee;
  }

  /**
   * second kmeeting application url
   * @param nanudaSecondMeetingApplyDto
   */
  async secondMeetingApplicateCreate(
    nanudaSecondMeetingApplyDto: NanudaSecondMeetingApplyDto,
  ): Promise<SecondMeetingApplicant> {
    let secondMeetingApplicant = new SecondMeetingApplicant(
      nanudaSecondMeetingApplyDto,
    );
    const checkIfUser = await this.entityManager
      .getRepository(NanudaUser)
      .findOne({
        where: {
          name: nanudaSecondMeetingApplyDto.name,
          phone: nanudaSecondMeetingApplyDto.phone,
        },
      });

    if (checkIfUser) {
      secondMeetingApplicant.isNanudaUser = YN.YES;
    }
    const firstMeetingData = await this.attendeesOnlineRepo.findOne({
      where: {
        name: nanudaSecondMeetingApplyDto.name,
        phone: nanudaSecondMeetingApplyDto.phone,
      },
    });
    if (firstMeetingData) {
      secondMeetingApplicant.firstMeetingAppliedDate = firstMeetingData.presentationDate
        .toISOString()
        .slice(0, 10);
    }
    secondMeetingApplicant = await this.secondMeetingApplicantRepo.save(
      secondMeetingApplicant,
    );
    // await slack notification
    await this.nanudaSlackNotification.secondMeetingNotification(
      secondMeetingApplicant,
    );
    return secondMeetingApplicant;
  }
}
