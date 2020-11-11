require('dotenv').config();
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
import {
  AdminPresentationEventListDto,
  AdminPresentationEventCreateDto,
  AdminPresentationEventUpdateeDto,
} from './dto';
import { PresentationEvent } from './presentation-event.entity';
import Axios from 'axios';

export class PresentationEventService extends BaseService {
  constructor(
    @InjectRepository(PresentationEvent)
    private readonly presentationEventRepo: Repository<PresentationEvent>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly fileUploadService: FileUploadService,
  ) {
    super();
  }

  /**
   * create for admin
   * @param adminPresentationEventCreateDto
   */
  async createForAdmin(
    adminPresentationEventCreateDto: AdminPresentationEventCreateDto,
  ): Promise<PresentationEvent> {
    if (
      adminPresentationEventCreateDto.image &&
      adminPresentationEventCreateDto.image.length > 0
    ) {
      adminPresentationEventCreateDto.image = await this.fileUploadService.moveS3File(
        adminPresentationEventCreateDto.image,
      );
      if (!adminPresentationEventCreateDto.image) {
        throw new BadRequestException({ message: 'Image upload failed!' });
      }
    }
    if (
      adminPresentationEventCreateDto.mobileImage &&
      adminPresentationEventCreateDto.mobileImage.length > 0
    ) {
      adminPresentationEventCreateDto.mobileImage = await this.fileUploadService.moveS3File(
        adminPresentationEventCreateDto.mobileImage,
      );
      if (!adminPresentationEventCreateDto.mobileImage) {
        throw new BadRequestException({
          message: 'Mobile image upload failed!',
        });
      }
    }
    let newEvent = new PresentationEvent(adminPresentationEventCreateDto);
    newEvent = await this.presentationEventRepo.save(newEvent);
    return newEvent;
  }

  /**
   * update for admin
   * @param eventNo
   * @param adminPresentationEventUpdateDto
   */
  async updateForAdmin(
    eventNo: number,
    adminPresentationEventUpdateDto: AdminPresentationEventUpdateeDto,
  ): Promise<PresentationEvent> {
    let presentationEvent = await this.presentationEventRepo.findOne(eventNo);
    if (
      adminPresentationEventUpdateDto.image &&
      adminPresentationEventUpdateDto.image.length > 0
    ) {
      adminPresentationEventUpdateDto.image = await this.fileUploadService.moveS3File(
        adminPresentationEventUpdateDto.image,
      );
      if (!adminPresentationEventUpdateDto.image) {
        throw new BadRequestException({ message: 'Image upload failed!' });
      }
    }
    if (
      adminPresentationEventUpdateDto.mobileImage &&
      adminPresentationEventUpdateDto.mobileImage.length > 0
    ) {
      adminPresentationEventUpdateDto.mobileImage = await this.fileUploadService.moveS3File(
        adminPresentationEventUpdateDto.mobileImage,
      );
      if (!adminPresentationEventUpdateDto.mobileImage) {
        throw new BadRequestException({
          message: 'Mobile image upload failed!',
        });
      }
    }
    presentationEvent = presentationEvent.set(adminPresentationEventUpdateDto);
    presentationEvent = await this.presentationEventRepo.save(
      presentationEvent,
    );
    return presentationEvent;
  }

  /**
   * find all for admin
   * @param adminPresentationListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminPresentationListDto: AdminPresentationEventListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<PresentationEvent>> {
    const qb = this.presentationEventRepo
      .createQueryBuilder('presentationEvent')
      .CustomInnerJoinAndSelect(['eventTypeInfo'])
      .CustomLeftJoinAndSelect(['signedUpAttendees'])
      .AndWhereLike(
        'presentationEvent',
        'title',
        adminPresentationListDto.title,
        adminPresentationListDto.exclude('title'),
      )
      .AndWhereLike(
        'presentationEvent',
        'address',
        adminPresentationListDto.address,
        adminPresentationListDto.exclude('address'),
      )
      .AndWhereLike(
        'signedUpAttendees',
        'name',
        adminPresentationListDto.attendeesName,
        adminPresentationListDto.exclude('attendeesName'),
      )
      .AndWhereLike(
        'signedUpAttendees',
        'phone',
        adminPresentationListDto.attendeesPhone,
        adminPresentationListDto.exclude('attendeesPhone'),
      )
      .WhereAndOrder(adminPresentationListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find one for admin
   * @param presentationEventNo
   */
  async findOne(presentationEventNo: number): Promise<PresentationEvent> {
    const qb = await this.presentationEventRepo
      .createQueryBuilder('presentationEvent')
      .CustomInnerJoinAndSelect(['eventTypeInfo'])
      .CustomLeftJoinAndSelect(['signedUpAttendees'])
      .where('presentationEvent.no = :no', { no: presentationEventNo })
      .getOne();
    let queryParams =
      '?' +
      encodeURIComponent('ServiceKey') +
      `=${process.env.OPEN_API_DATA_KR_KEY}`; /* Service Key*/
    queryParams +=
      '&' +
      encodeURIComponent('subwayStationName') +
      '=' +
      encodeURIComponent('강남');
    const sub = await Axios.get(
      `${process.env.OPEN_API_DATA_KR_URL_GET_STATION}${queryParams}`,
    );
    qb.subwayStations = sub.data.response.body;
    return qb;
  }

  /**
   * hard delete for admin
   * @param presentationEventNo
   */
  async deleteForAdmin(presentationEventNo: number) {
    const checkEvent = await this.presentationEventRepo.findOne(
      presentationEventNo,
    );
    if (!checkEvent) {
      throw new NotFoundException();
    }
    await this.presentationEventRepo
      .createQueryBuilder()
      .delete()
      .from(PresentationEvent)
      .where('no = :no', { no: presentationEventNo })
      .execute();
  }
}
