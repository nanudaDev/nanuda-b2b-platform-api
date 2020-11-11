import { Query } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { Attendees } from './attendees.entity';
import {
  AdminAttendeesCreateDto,
  AdminAttendeesListDto,
  AdminAttendeesUpdateDto,
} from './dto';

export class AttendeesService extends BaseService {
  constructor(
    @InjectRepository(Attendees)
    private readonly attendeesRepos: Repository<Attendees>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * create for admin
   * @param adminAttendeesCreateDto
   */
  async createForAdmin(
    adminAttendeesCreateDto: AdminAttendeesCreateDto,
  ): Promise<Attendees> {
    let newAttendee = new Attendees(adminAttendeesCreateDto);
    newAttendee = await this.attendeesRepos.save(newAttendee);
    // get event
    // const attendedData = await this.attendeesRepos
    //   .createQueryBuilder('attendee')
    //   .CustomInnerJoinAndSelect(['event'])
    //   .where('attendee.no = :no', { no: newAttendee.no })
    //   .getOne();
    // // send message to user
    // await this.nanudaSmsNotificationService.sendPresentationEvent(attendedData);
    // 문자 보낼지 고민 중
    return newAttendee;
  }

  /**
   * update for admin
   * @param attendeesNo
   * @param adminAttendeesUpdateDto
   */
  async updateForAdmin(
    attendeesNo: number,
    adminAttendeesUpdateDto: AdminAttendeesUpdateDto,
  ): Promise<Attendees> {
    let attendee = await this.attendeesRepos.findOne(attendeesNo);
    attendee = attendee.set(adminAttendeesUpdateDto);
    attendee = await this.attendeesRepos.save(attendee);
    return attendee;
  }

  /**
   * find all for admin
   * @param adminAttendeesListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminAttendeesListDto: AdminAttendeesListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Attendees>> {
    const qb = this.attendeesRepos
      .createQueryBuilder('attendees')
      .CustomInnerJoinAndSelect(['event'])
      .CustomLeftJoinAndSelect(['genderInfo'])
      .AndWhereLike(
        'attendees',
        'name',
        adminAttendeesListDto.name,
        adminAttendeesListDto.exclude('name'),
      )
      .AndWhereLike(
        'attendees',
        'phone',
        adminAttendeesListDto.phone,
        adminAttendeesListDto.exclude('phone'),
      )
      .WhereAndOrder(adminAttendeesListDto)
      .Paginate(pagination);

    let [items, totalCount] = await qb.getManyAndCount();
    await Promise.all(
      items.map(async item => {
        const isUser = await this.entityManager
          .getRepository(NanudaUser)
          .findOne({ where: { phone: item.phone } });
        if (!isUser) {
          item.isNanudaUser = YN.NO;
        } else {
          item.isNanudaUser = YN.YES;
        }
      }),
    );
    return { items, totalCount };
  }

  /**
   * find one for admin
   * @param attendeesNo
   */
  async findOneForAdmin(attendeesNo: number): Promise<Attendees> {
    const qb = await this.attendeesRepos
      .createQueryBuilder('attendees')
      .CustomInnerJoinAndSelect(['event'])
      .CustomLeftJoinAndSelect(['genderInfo'])
      .where('attendees.no = :no', { no: attendeesNo })
      .getOne();

    return qb;
  }

  async compareAttendeesDataWithPreviousEvent(eventNo: number) {}
}
