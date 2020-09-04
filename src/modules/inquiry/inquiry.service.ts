import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseService, INQUIRY } from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Inquiry } from './inquiry.entity';
import { Repository, EntityManager } from 'typeorm';
import {
  AdminInquiryListDto,
  AdminInquiryReplyListDto,
  AdminInquiryReplyCreateDto,
  InquiryCreateDto,
  InquiryReplyCreateDto,
  AdminInquiryReplyUpdateDto,
  InquiryReplyListDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { InquiryListDto } from './dto/inquiry-list.dto';
import { InquiryReplyUpdateDto } from './dto/inquiry-reply-update.dto';
import { NanudaSlackNotificationService } from 'src/core/utils';

@Injectable()
export class InquiryService extends BaseService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepo: Repository<Inquiry>,
    private readonly nanudaSlackNotificationService: NanudaSlackNotificationService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  //   admin services
  async findAllForAdmin(
    adminInquiryListDto: AdminInquiryListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<Inquiry>> {
    const inquiry = this.inquiryRepo
      .createQueryBuilder('inquiry')
      .CustomInnerJoinAndSelect(['codeManagement'])
      .CustomLeftJoinAndSelect(['admin', 'company', 'companyUser'])
      .where('inquiry.isInquiryReply = :isInquiryReply', {
        isInquiryReply: YN.NO,
      })
      .AndWhereLike(
        'companyUser',
        'name',
        adminInquiryListDto.companyUserName,
        adminInquiryListDto.exclude('companyUserName'),
      )
      .AndWhereLike(
        'company',
        'nameKr',
        adminInquiryListDto.companyName,
        adminInquiryListDto.exclude('companyName'),
      )
      .AndWhereLike(
        'inquiry',
        'title',
        adminInquiryListDto.title,
        adminInquiryListDto.exclude('title'),
      )
      .WhereAndOrder(adminInquiryListDto)
      .Paginate(pagination);

    const [items, totalCount] = await inquiry.getManyAndCount();
    await Promise.all(
      items.map(async item => {
        const count = await this.inquiryRepo.find({
          where: { isInquiryReply: YN.YES, inquiryNo: item.no },
        });
        item.replyCount = count.length;
      }),
    );
    return { items, totalCount };
  }

  /**
   * find inquiry main thread
   * @param inquiryNo
   */
  async findOneInquiryForAdmin(inquiryNo: number): Promise<Inquiry> {
    const inquiry = await this.inquiryRepo
      .createQueryBuilder('inquiry')
      .CustomInnerJoinAndSelect(['codeManagement'])
      .CustomLeftJoinAndSelect(['admin', 'company', 'companyUser'])
      .where('inquiry.no = :no', { no: inquiryNo })
      .getOne();

    if (!inquiry) {
      throw new NotFoundException();
    }
    return inquiry;
  }

  /**
   * close inquiry
   * @param inquiryNo
   */
  async closeInquiry(inquiryNo: number): Promise<Inquiry> {
    let inquiry = await this.findOneInquiryForAdmin(inquiryNo);
    inquiry.isClosed = YN.YES;
    inquiry = await this.inquiryRepo.save(inquiry);
    return inquiry;
  }

  async findAllRepliesForAdmin(
    inquiryNo: number,
    adminInquiryReplyListDto: AdminInquiryReplyListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<Inquiry>> {
    const replies = this.inquiryRepo
      .createQueryBuilder('inquiryReply')
      .CustomLeftJoinAndSelect(['admin', 'companyUser', 'company'])
      .where('inquiryReply.inquiryNo = :inquiryNo', { inquiryNo: inquiryNo })
      .andWhere('inquiryReply.isInquiryReply = :isInquiryReply', {
        isInquiryReply: YN.YES,
      })
      .AndWhereLike(
        'admin',
        'name',
        adminInquiryReplyListDto.adminName,
        adminInquiryReplyListDto.exclude('adminName'),
      )
      .AndWhereLike(
        'companyUser',
        'name',
        adminInquiryReplyListDto.companyUserName,
        adminInquiryReplyListDto.exclude('companyUserName'),
      )
      .WhereAndOrder(adminInquiryReplyListDto)
      .Paginate(pagination);

    const [items, totalCount] = await replies.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * create new reply for admin
   * @param adminNo
   * @param companyNo
   * @param adminInquiryReplyCreateDto
   */
  async createReply(
    adminNo: number,
    inquiryNo: number,
    adminInquiryReplyCreateDto: AdminInquiryReplyCreateDto,
  ): Promise<Inquiry> {
    const checkInquiry = await this.inquiryRepo.findOne(inquiryNo);
    if (!checkInquiry) {
      throw new NotFoundException();
    }
    let newReply = new Inquiry(adminInquiryReplyCreateDto);
    newReply.adminNo = adminNo;
    newReply.companyNo = checkInquiry.companyNo;
    newReply.inquiryNo = inquiryNo;
    newReply.isInquiryReply = YN.YES;
    newReply = await this.inquiryRepo.save(newReply);
    return newReply;
  }

  /**
   * edit existing reply
   * @param inquiryReplyNo
   * @param inquiryNo
   * @param adminNo
   * @param adminInquiryReplyUpdateDto
   */
  async editReplyForAdmin(
    inquiryReplyNo: number,
    inquiryNo: number,
    adminNo: number,
    adminInquiryReplyUpdateDto: AdminInquiryReplyUpdateDto,
  ): Promise<Inquiry> {
    let reply = await this.inquiryRepo.findOne({
      no: inquiryReplyNo,
      inquiryNo: inquiryNo,
    });
    if (!reply) {
      throw new NotFoundException();
    }
    if (reply.adminNo !== adminNo) {
      throw new BadRequestException({
        message: '본인 댓글만 수정할 수 있습니다.',
      });
    }
    reply = reply.set(adminInquiryReplyUpdateDto);
    reply = await this.inquiryRepo.save(reply);
    return reply;
  }

  // company services

  /**
   * create inquiry for company user
   * @param companyUserNo
   * @param companyNo
   * @param inquiryCreateDto
   */
  async createInquiry(
    companyUserNo: number,
    companyNo: number,
    inquiryCreateDto: InquiryCreateDto,
  ): Promise<Inquiry> {
    let newInquiry = new Inquiry(inquiryCreateDto);
    newInquiry.companyNo = companyNo;
    newInquiry.companyUserNo = companyUserNo;
    newInquiry = await this.inquiryRepo.save(newInquiry);
    // slack for admin
    const getInfo = await this.inquiryRepo
      .createQueryBuilder('inquiry')
      .CustomLeftJoinAndSelect(['company', 'companyUser'])
      .CustomInnerJoinAndSelect(['codeManagement'])
      .where('inquiry.no = :no', { no: newInquiry.no })
      .getOne();
    if (inquiryCreateDto.inquiryType === INQUIRY.SYSTEM) {
      await this.nanudaSlackNotificationService.systemInquiry(getInfo);
    } else {
      await this.nanudaSlackNotificationService.inquiryNotification(getInfo);
    }
    return newInquiry;
  }

  /**
   * create reply for company user
   * @param companyUserNo
   * @param companyNo
   * @param inquiryNo
   * @param inquiryReplyCreateDto
   */
  async createReplyForCompanyUser(
    companyUserNo: number,
    companyNo: number,
    inquiryNo: number,
    inquiryReplyCreateDto: InquiryReplyCreateDto,
  ): Promise<Inquiry> {
    const checkInquiry = await this.inquiryRepo.findOne(inquiryNo);
    if (companyNo !== checkInquiry.companyNo) {
      throw new BadRequestException({ message: 'Wrong company' });
    }
    let reply = new Inquiry(inquiryReplyCreateDto);
    reply.companyUserNo = companyUserNo;
    reply.companyNo = companyNo;
    reply.inquiryNo = inquiryNo;
    reply = await this.inquiryRepo.save(reply);
    reply = await this.inquiryRepo
      .createQueryBuilder('inquiry')
      .CustomInnerJoinAndSelect(['company', 'companyUser'])
      .where('inquiry.no = :no', { no: reply.no })
      .getOne();
    await this.nanudaSlackNotificationService.inquiryReplyNotification(
      checkInquiry,
      reply,
    );
    return reply;
  }

  /**
   * find all for company user
   * @param companyNo
   * @param inquiryListDto
   * @param pagination
   */
  async findAllForCompanyUser(
    companyNo: number,
    inquiryListDto: InquiryListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Inquiry>> {
    const inquiry = this.inquiryRepo
      .createQueryBuilder('inquiry')
      .CustomInnerJoinAndSelect(['codeManagement'])
      .CustomLeftJoinAndSelect(['companyUser'])
      .where('inquiry.companyNo = :companyNo', { companyNo: companyNo })
      .andWhere('inquiry.isInquiryReply = :isInquiryReply', {
        isInquiryReply: YN.NO,
      })
      .AndWhereLike(
        'companyUser',
        'name',
        inquiryListDto.companyUserName,
        inquiryListDto.exclude('companyUserName'),
      )
      .WhereAndOrder(inquiryListDto)
      .Paginate(pagination);
    const [items, totalCount] = await inquiry.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * reply list
   * @param inquiryNo
   * @param companyNo
   * @param inquiryReplyListDto
   * @param pagination
   */
  async findAllRepliesForCompanyUser(
    inquiryNo: number,
    companyNo: number,
    inquiryReplyListDto: InquiryReplyListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<Inquiry>> {
    const reply = this.inquiryRepo
      .createQueryBuilder('inquiryReply')
      .CustomLeftJoinAndSelect(['company', 'companyUser', 'admin'])
      .where('inquiryReply.companyNo = :companyNo', { companyNo: companyNo })
      .andWhere('inquiryReply.inquiryNo = :inquiryNo', { inquiryNo: inquiryNo })
      .andWhere('inquiryReply.isInquiryReply = :isInquiryReply', {
        isInquiryReply: YN.YES,
      })
      .WhereAndOrder(inquiryReplyListDto)
      .Paginate(pagination);

    const [items, totalCount] = await reply.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find one for company user
   * @param inquiryNo
   * @param companyNo
   */
  async findOneForCompanyUser(
    inquiryNo: number,
    companyNo: number,
  ): Promise<Inquiry> {
    const inquiry = await this.inquiryRepo
      .createQueryBuilder('inquiry')
      .CustomInnerJoinAndSelect(['codeManagement'])
      .CustomLeftJoinAndSelect(['company', 'companyUser'])
      .where('inquiry.no = :no', { no: inquiryNo })
      .andWhere('inquiry.companyNo = :companyNo', { companyNo: companyNo })
      .getOne();

    if (!inquiry) {
      throw new NotFoundException();
    }

    return inquiry;
  }

  /**
   * inquiry reply edit
   * @param inquiryReplyNo
   * @param inquiryNo
   * @param companyNo
   * @param companyUserNo
   * @param inquiryReplyUpdateDto
   */
  async editReply(
    inquiryReplyNo: number,
    inquiryNo: number,
    companyNo: number,
    companyUserNo: number,
    inquiryReplyUpdateDto: InquiryReplyUpdateDto,
  ): Promise<Inquiry> {
    let inquiryReply = await this.inquiryRepo.findOne({
      where: {
        no: inquiryReplyNo,
        inquiryNo: inquiryNo,
        companyNo: companyNo,
      },
    });
    if (inquiryReply.companyUserNo !== companyUserNo) {
      throw new BadRequestException({
        message: '본인 댓글만 수정할 수 있습니다.',
      });
    }
    inquiryReply = inquiryReply.set(inquiryReplyUpdateDto);
    inquiryReply.isEdited = YN.YES;
    inquiryReply = await this.inquiryRepo.save(inquiryReply);
    return inquiryReply;
  }

  /**
   * find one reply for company user
   * @param companyNo
   * @param inquiryReplyNo
   */
  async findOneReplyForCompanyUser(
    companyNo: number,
    inquiryNo: number,
    inquiryReplyNo: number,
  ): Promise<Inquiry> {
    const reply = await this.inquiryRepo.findOne({
      companyNo: companyNo,
      no: inquiryReplyNo,
      isInquiryReply: YN.YES,
      inquiryNo: inquiryNo,
    });
    if (!reply) {
      throw new NotFoundException();
    }
    return reply;
  }
}
