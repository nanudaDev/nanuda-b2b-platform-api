import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
import {
  B2CNanudaSlackNotificationService,
  NanudaSmsNotificationService,
} from 'src/core/utils';
import { EntityManager, Repository } from 'typeorm';
import { PresentationEvent } from '../presentation-event/presentation-event.entity';
import { Attendees } from './attendees.entity';
import { NanudaAttendeesCreateDto } from './dto';
import { Request } from 'express';

@Injectable()
export class NanudaAttendeesService extends BaseService {
  constructor(
    @InjectRepository(Attendees)
    private readonly attendeesRepo: Repository<Attendees>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly nanudaSmsNotificationService: NanudaSmsNotificationService,
    private readonly b2cslackNotificationService: B2CNanudaSlackNotificationService,
  ) {
    super();
  }

  /**
   * create new attendee data
   * @param nanudaAttendeesCreateDto
   */
  async createForNanudaUser(
    nanudaAttendeesCreateDto: NanudaAttendeesCreateDto,
    req: Request,
  ): Promise<Attendees> {
    let newAttendee = new Attendees(nanudaAttendeesCreateDto);
    const checkEvent = await this.entityManager
      .getRepository(PresentationEvent)
      .findOne(newAttendee.eventNo);
    if (!checkEvent || checkEvent.presentationDate < new Date()) {
      throw new NotFoundException('Event not found!');
    }
    newAttendee = await this.attendeesRepo.save(newAttendee);
    newAttendee = await this.attendeesRepo
      .createQueryBuilder('attendee')
      .CustomInnerJoinAndSelect(['event'])
      .innerJoinAndSelect('event.eventTypeInfo', 'eventTypeInfo')
      .where('attendee.no = :no', { no: newAttendee.no })
      .getOne();
    // Send slack
    await this.b2cslackNotificationService.attendeesNotification(newAttendee);
    // send sms
    await this.nanudaSmsNotificationService.sendPresentationEvent(
      newAttendee,
      req,
    );
    return newAttendee;
  }
}
