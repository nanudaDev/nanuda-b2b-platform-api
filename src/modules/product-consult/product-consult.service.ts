import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/core';
import {
  AdminProductConsultListDto,
  AdminProductConsultUpdateDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { ProductConsult } from './product-consult.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductConsultModule } from './product-consult.module';

@Injectable()
export class ProductConsultService extends BaseService {
  constructor(
    @InjectRepository(ProductConsult)
    private readonly productConsultRepo: Repository<ProductConsult>,
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
      .CustomLeftJoinAndSelect(['admin', 'nanudaUser'])
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
        'phone',
        adminProductConsutListDto.nanudaUserPhone,
        adminProductConsutListDto.exclude('nanudaUserPhone'),
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
      .CustomLeftJoinAndSelect(['admin', 'addressInfo', 'nanudaUser'])
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
    let consult = await this.productConsultRepo.findOne(productConsultNo);
    consult = consult.set(adminProductConsultUpdateDto);
    consult = await this.productConsultRepo.save(consult);
    return consult;
  }
}
