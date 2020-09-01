import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticeBoard } from './notice-board.entity';
import { Repository } from 'typeorm';
import {
  AdminNoticeBoardCreateDto,
  AdminNoticeBoardUpdateeDto,
  NoticeBoardListDto,
  AdminNoticeBoardListDto,
} from './dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { FileUploadService } from '../file-upload/file-upload.service';

export class NoticeBoardService extends BaseService {
  constructor(
    @InjectRepository(NoticeBoard)
    private readonly noticeBoardRepo: Repository<NoticeBoard>,
    private readonly fileUploadService: FileUploadService,
  ) {
    super();
  }

  /**
   * create notice board
   * @param adminNo
   * @param adminNoticeBoardCreateDto
   */
  async create(
    adminNo: number,
    adminNoticeBoardCreateDto: AdminNoticeBoardCreateDto,
  ): Promise<NoticeBoard> {
    if (
      adminNoticeBoardCreateDto.attachments &&
      adminNoticeBoardCreateDto.attachments.length > 0
    ) {
      adminNoticeBoardCreateDto.attachments = await this.fileUploadService.moveS3File(
        adminNoticeBoardCreateDto.attachments,
      );
      if (!adminNoticeBoardCreateDto.attachments) {
        throw new BadRequestException({ message: 'Upload failed!' });
      }
    }
    let noticeBoard = new NoticeBoard(adminNoticeBoardCreateDto);
    noticeBoard.adminNo = adminNo;
    noticeBoard = await this.noticeBoardRepo.save(noticeBoard);
    return noticeBoard;
  }

  /**
   * notice board update
   * @param adminNo
   * @param noticeBoardNo
   * @param adminNoticeBoardUpdateDto
   */
  async update(
    adminNo: number,
    noticeBoardNo: number,
    adminNoticeBoardUpdateDto: AdminNoticeBoardUpdateeDto,
  ): Promise<NoticeBoard> {
    let noticeBoard = await this.noticeBoardRepo.findOne(noticeBoardNo);
    if (noticeBoard) {
      throw new NotFoundException({
        message: '공지사항을 찾지 못했습니다.',
      });
    }
    noticeBoard = noticeBoard.set(adminNoticeBoardUpdateDto);
    noticeBoard.adminNo = adminNo;
    noticeBoard = await this.noticeBoardRepo.save(noticeBoard);
    return noticeBoard;
  }

  /**
   * find one
   * @param noticeBoardNo
   */
  async findOne(noticeBoardNo: number): Promise<NoticeBoard> {
    const noticeBoard = await this.noticeBoardRepo
      .createQueryBuilder('noticeBoard')
      .where('noticeBoard.no = :no', { no: noticeBoardNo })
      .getOne();
    if (!noticeBoard) {
      throw new NotFoundException({
        message: '공지사항을 찾지 못했습니다.',
      });
    }
    return noticeBoard;
  }

  async findOneForAdmin(noticeBoardNo: number): Promise<NoticeBoard> {
    const noticeBoard = await this.noticeBoardRepo
      .createQueryBuilder('noticeBoard')
      .CustomInnerJoinAndSelect(['admin'])
      .where('noticeBoard.no = :no', { no: noticeBoardNo })
      .getOne();
    if (!noticeBoard) {
      throw new NotFoundException({
        message: '공지사항을 찾지 못했습니다.',
      });
    }
    return noticeBoard;
  }

  /**
   * list for notice baord
   * @param noticeBoardListDto
   * @param pagination
   */
  async findAll(
    noticeBoardListDto: NoticeBoardListDto | AdminNoticeBoardListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<NoticeBoard>> {
    const qb = this.noticeBoardRepo
      .createQueryBuilder('noticeBoard')
      .CustomInnerJoinAndSelect(['codeManagement'])
      .CustomLeftJoinAndSelect(['admin'])
      .AndWhereLike(
        'noticeBoard',
        'title',
        noticeBoardListDto.title,
        noticeBoardListDto.exclude('title'),
      )
      .AndWhereLike(
        'noticeBoard',
        'url',
        noticeBoardListDto.url,
        noticeBoardListDto.exclude('url'),
      );
    if (noticeBoardListDto instanceof AdminNoticeBoardListDto) {
      qb.AndWhereLike(
        'admin',
        'name',
        noticeBoardListDto.adminName,
        noticeBoardListDto.exclude('adminName'),
      );
    }
    qb.WhereAndOrder(noticeBoardListDto).Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * delete notice board from admin
   * @param noticeBoardNo
   */
  async deleteNoticeBoard(noticeBoardNo: number) {
    await this.noticeBoardRepo
      .createQueryBuilder()
      .delete()
      .from(NoticeBoard)
      .where('no = :no', { no: noticeBoardNo })
      .execute();
  }
}
