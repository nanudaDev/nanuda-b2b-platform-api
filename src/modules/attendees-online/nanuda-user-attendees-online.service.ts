import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { YN } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { AttendeesOnline } from './attendees-online.entity';
import { NanudaAttendeesOnlineCreateDto } from './dto';

@Injectable()
export class NanudaAttendeesOnlineService extends BaseService {
  constructor(
    @InjectRepository(AttendeesOnline)
    private readonly attendeesOnlineRepo: Repository<AttendeesOnline>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * create nanuda user
   * @param nanudaAttendeesOnlineCreateDto
   */
  async createAttendees(
    nanudaAttendeesOnlineCreateDto: NanudaAttendeesOnlineCreateDto,
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
      where: nanudaAttendeesOnlineCreateDto,
    });
    //  if already applied
    if (checkIfApplied) {
      return '이미 신청한 전화번호입니다.';
    }
    let newAttendee = new AttendeesOnline(nanudaAttendeesOnlineCreateDto);
    newAttendee = await this.attendeesOnlineRepo.save(newAttendee);
    // check if larger than three days or less
    const createdDate = new Date(newAttendee.createdAt);
    const appliedDate = new Date(newAttendee.presentationDate);
    const differenceInTime = appliedDate.getTime() - createdDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    // check three day flag
    if (differenceInDays >= 3) {
      newAttendee.threeDayFlag = YN.YES;
    } else {
      newAttendee.threeDayFlag = YN.NO;
    }
    if (checkIfUser) {
      newAttendee.isNanudaUser = YN.YES;
    }
    // await sms notification
    // await slack notification
    return newAttendee;
  }
}
