import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';
import { AdminNanudaUserCreateDto, AdminNanudaUserListDto } from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NanudaUser } from './nanuda-user.entity';

@Injectable()
export class NanudaUserService extends BaseService {
  constructor(
    @InjectRepository(NanudaUser)
    private readonly nanudaUserRepo: Repository<NanudaUser>,
  ) {
    super();
  }

  /**
   * create for admin
   * @param adminNanudaUserCreateDto
   */
  async createForAdmin(
    adminNanudaUserCreateDto: AdminNanudaUserCreateDto,
  ): Promise<NanudaUser> {
    let nanudaUser = new NanudaUser(adminNanudaUserCreateDto);
    nanudaUser = await this.nanudaUserRepo.save(nanudaUser);
    return nanudaUser;
  }

  /**
   * find all for admin
   * @param adminNanudaUserListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminNanudaUserListDto: AdminNanudaUserListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<NanudaUser>> {
    if (
      adminNanudaUserListDto.phone &&
      adminNanudaUserListDto.phone.includes('-')
    ) {
      adminNanudaUserListDto.phone = adminNanudaUserListDto.phone.replace(
        /-/g,
        '',
      );
    }
    const qb = this.nanudaUserRepo
      .createQueryBuilder('nanudaUser')
      .AndWhereLike(
        'nanudaUser',
        'name',
        adminNanudaUserListDto.name,
        adminNanudaUserListDto.exclude('name'),
      )
      .AndWhereLike(
        'nanudaUser',
        'phone',
        adminNanudaUserListDto.phone,
        adminNanudaUserListDto.exclude('phone'),
      )
      .WhereAndOrder(adminNanudaUserListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find one
   * @param nanudaUserNo
   */
  async findOneForAdmin(nanudaUserNo: number): Promise<NanudaUser> {
    return await this.nanudaUserRepo.findOne(nanudaUserNo);
  }
}
