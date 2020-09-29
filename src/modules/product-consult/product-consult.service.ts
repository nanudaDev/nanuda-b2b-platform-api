import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/core';
import {
  AdminProductConsultListDto,
  AdminProductConsultUpdateDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { ProductConsult } from './product-consult.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ProductConsultModule } from './product-consult.module';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';

@Injectable()
export class ProductConsultService extends BaseService {
  constructor(
    @InjectRepository(ProductConsult)
    private readonly productConsultRepo: Repository<ProductConsult>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminProductConsutListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminProductConsutListDto: AdminProductConsultListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<ProductConsult>> {
    const qb = this.productConsultRepo
      .createQueryBuilder('productConsult')
      .CustomLeftJoinAndSelect([
        'admin',
        'nanudaUser',
        'availableTime',
        'spaceType',
      ])
      .CustomInnerJoinAndSelect(['codeManagement', 'addressInfo'])
      .AndWhereLike(
        'productConsult',
        'addressCode',
        adminProductConsutListDto.addressCode,
        adminProductConsutListDto.exclude('addressCode'),
      )
      .AndWhereLike(
        'admin',
        'name',
        adminProductConsutListDto.adminName,
        adminProductConsutListDto.exclude('adminName'),
      )
      .AndWhereLike(
        'nanudaUser',
        'name',
        adminProductConsutListDto.nanudaUserName,
        adminProductConsutListDto.exclude('nanudaUserName'),
      )
      .AndWhereLike(
        'nanudaUser',
        'phone',
        adminProductConsutListDto.nanudaUserPhone,
        adminProductConsutListDto.exclude('nanudaUserPhone'),
      )
      .AndWhereEqual(
        'nanudaUser',
        'gender',
        adminProductConsutListDto.gender,
        adminProductConsutListDto.exclude('gender'),
      )
      .AndWhereEqual(
        'productConsult',
        'pConsultManager',
        adminProductConsutListDto.adminNo,
        adminProductConsutListDto.exclude('adminNo'),
      )
      .WhereAndOrder(adminProductConsutListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find for admin
   * @param productConsultNo
   */
  async findOneForAdmin(productConsultNo: number): Promise<ProductConsult> {
    const consult = await this.productConsultRepo
      .createQueryBuilder('productConsult')
      .CustomInnerJoinAndSelect(['codeManagement'])
      .CustomLeftJoinAndSelect([
        'admin',
        'addressInfo',
        'nanudaUser',
        'availableTime',
        'spaceType',
      ])
      .where('productConsult.no = :no', { no: productConsultNo })
      .getOne();
    if (!consult) {
      throw new NotFoundException();
    }
    return consult;
  }

  /**
   * update product consult
   * @param productConsultNo
   * @param adminProductConsultUpdateDto
   */
  async updateForAdmin(
    productConsultNo: number,
    adminProductConsultUpdateDto: AdminProductConsultUpdateDto,
  ): Promise<ProductConsult> {
    const consult = await this.entityManager.transaction(
      async entityManager => {
        let consult = await entityManager
          .getRepository(ProductConsult)
          .findOne(productConsultNo);
        if (!consult) {
          throw new NotFoundException();
        }
        if (adminProductConsultUpdateDto.gender) {
          let nanudaUser = await entityManager
            .getRepository(NanudaUser)
            .findOne(consult.nanudaUserNo);
          if (!nanudaUser) {
            throw new NotFoundException({ message: 'User not found' });
          }
          nanudaUser.gender = adminProductConsultUpdateDto.gender;
          nanudaUser = await entityManager.save(nanudaUser);
        }
        consult = consult.set(adminProductConsultUpdateDto);
        consult = await entityManager.save(consult);
        return consult;
      },
    );
    return consult;
  }
}
