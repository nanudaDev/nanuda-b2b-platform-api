import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { YN } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { AttendeesOnline } from './attendees-online.entity';
import { NanudaAttendeesOnlineCreateDto } from './dto';
import * as crypto from 'crypto';
import {
  B2CNanudaSlackNotificationService,
  NanudaSmsNotificationService,
} from 'src/core/utils';
import { Request } from 'express';

@Injectable()
export class NanudaAttendeesOnlineService extends BaseService {
  constructor(
    @InjectRepository(AttendeesOnline)
    private readonly attendeesOnlineRepo: Repository<AttendeesOnline>,
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
    console.log(Math.round(differenceInDays));
    // check three day flag
    if (differenceInDays >= 3) {
      newAttendee.threeDayFlag = YN.YES;
    } else {
      newAttendee.threeDayFlag = YN.NO;
    }
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
    await this.nanudaSlackNotification.attendeesOnlineNotification(newAttendee);
    return newAttendee;
  }
}
