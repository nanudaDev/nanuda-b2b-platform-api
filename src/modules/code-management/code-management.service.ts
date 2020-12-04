import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeManagement } from './code-management.entity';
import { Repository } from 'typeorm';
import {
  AdminCodeManagementCreateDto,
  AdminCodeManagementListDto,
} from './dto';
import { BaseService } from '../../core';
import {
  PaginatedResponse,
  PaginatedRequest,
  YN,
  ORDER_BY_VALUE,
} from 'src/common';
import { AdminCodeManagementUpdateDto } from './dto/admin-code-management-update.dto';
import { Admin } from '../admin';
// import * as generate from '../../generator';

@Injectable()
export class CodeManagementService extends BaseService {
  constructor(
    @InjectRepository(CodeManagement)
    private readonly codeManagementRepo: Repository<CodeManagement>,
  ) {
    super();
  }

  /**
   * Create new code
   * @param adminCodeManagementCreateDto
   */
  // TODO: error
  async create(
    adminCodeManagementCreateDto: AdminCodeManagementCreateDto,
  ): Promise<CodeManagement> {
    let newCode = new CodeManagement(adminCodeManagementCreateDto);
    // check if code exists first
    const checkCode = await this.codeManagementRepo.findOne({
      key: newCode.key,
    });
    if (checkCode) {
      throw new BadRequestException('unique');
    }
    newCode = await this.codeManagementRepo.save(newCode);
    // await generate.generate;
    return newCode;
  }

  /**
   * get code list for admin
   * @param adminCodeManagementListDto
   * @param pagination
   */
  async findAll(
    adminCodeManagementListDto: AdminCodeManagementListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<CodeManagement>> {
    const [items, totalCount] = await this.codeManagementRepo
      .createQueryBuilder('CodeManagement')
      .WhereAndOrder(adminCodeManagementListDto)
      .Paginate(pagination)
      .getManyAndCount();
    return { items, totalCount };
  }

  /**
   * find all for non admin
   * @param pagination
   */
  async findAllForHome(
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<CodeManagement>> {
    const [items, totalCount] = await this.codeManagementRepo
      .createQueryBuilder('CodeManagement')
      .Paginate(pagination)
      .getManyAndCount();
    return { items, totalCount };
  }

  /**
   * code management detail
   * @param codeNO
   */
  async findOne(codeNo: number): Promise<CodeManagement> {
    return await this.codeManagementRepo.findOne(codeNo);
  }

  /**
   * update existing code
   * @param codeNO
   * @param adminCodeManagementUpdateDto
   */
  async update(
    codeNo: number,
    adminCodeManagementUpdateDto: AdminCodeManagementUpdateDto,
  ): Promise<CodeManagement> {
    let code = await this.codeManagementRepo.findOne(codeNo);
    code = code.set(adminCodeManagementUpdateDto);
    code = await this.codeManagementRepo.save(code);
    return code;
  }

  /**
   * hard delete code from database
   * @param codeNO
   * @param admin
   */
  async hardDelete(admin: Admin, codeNo: number): Promise<boolean> {
    const findCode = await this.codeManagementRepo.findOne(codeNo);
    if (!findCode) throw new BadRequestException();
    // const privilegedAdmin = ['Joseph', 'Eddie'];
    // if (!privilegedAdmin.includes(admin.name)) {
    //   throw new ForbiddenException();
    // }
    await this.codeManagementRepo.delete(codeNo);
    return true;
  }

  /**
   * find all founder consult codes
   */
  async findFounderConsultCodes(): Promise<CodeManagement[]> {
    const codes = await this.codeManagementRepo.find({
      where: {
        category1: 'FOUNDER_CONSULT',
        delYn: YN.NO,
      },
      order: {
        orderBy: ORDER_BY_VALUE.ASC,
      },
    });
    return codes;
  }

  async findDeliveryFounderConsultCodes(): Promise<CodeManagement[]> {
    const codes = await this.codeManagementRepo.find({
      where: {
        category1: 'B2B_FOUNDER_CONSULT',
        delYn: YN.NO,
      },
      order: {
        orderBy: ORDER_BY_VALUE.ASC,
      },
    });
    return codes;
  }

  /**
   * 문의 유형
   */
  async findInquiryTypes(): Promise<CodeManagement[]> {
    const codes = await this.codeManagementRepo.find({
      where: {
        category1: 'INQUIRY',
        delYn: YN.NO,
      },
    });
    return codes;
  }

  /**
   * find available times
   */
  async findAvailableTimes(): Promise<CodeManagement[]> {
    const codes = await this.codeManagementRepo.find({
      where: {
        category1: 'AVAILABLE_TIME',
      },
    });
    return codes;
  }

  async findGenderTypes(): Promise<CodeManagement[]> {
    const codes = await this.codeManagementRepo.find({
      where: {
        category1: 'GENDER',
      },
    });
    return codes;
  }

  async findAnyTypes(category?: string): Promise<CodeManagement[]> {
    const codes = await this.codeManagementRepo.find({
      where: {
        category1: category,
      },
    });
    return codes;
  }
}
