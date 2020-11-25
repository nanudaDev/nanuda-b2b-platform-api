import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseService } from 'src/core';
import { AdminListDto, AdminCreateDto, AdminUpdateDto } from './dto';
import { PaginatedRequest, PaginatedResponse, YN } from '../../common';
import { Admin } from './admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUpdateStatusDto } from './dto/admin-update-status.dto';
import { PasswordTestDto } from './dto/password-testing.dto';
import { PasswordService } from '../auth';

@Injectable()
export class AdminService extends BaseService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
    private readonly passwordService: PasswordService,
  ) {
    super();
  }

  /**
   * Admin list
   * @param adminListDto
   * @param pagination
   */
  async findAll(
    adminListDto: AdminListDto,
    pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<Admin>> {
    const qb = await this.adminRepo
      .createQueryBuilder('Admin')
      .CustomLeftJoinAndSelect(['spaceType'])
      .AndWhereLike(
        'Admin',
        'name',
        adminListDto.name,
        adminListDto.exclude('name'),
      )
      .AndWhereLike(
        'Admin',
        'phone',
        adminListDto.phone,
        adminListDto.exclude('phone'),
      )
      .WhereAndOrder(adminListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();
    return { items, totalCount };
  }

  /**
   * admin detail
   * @param adminNo
   */
  async findOne(adminNo: number): Promise<Admin> {
    const admin = await this.adminRepo
      .createQueryBuilder('admin')
      .CustomLeftJoinAndSelect(['spaceType'])
      .where('admin.no = :no', { no: adminNo })
      .getOne();
    if (!admin) {
      throw new NotFoundException();
    }
    return admin;
  }

  /**
   * create admin
   * @param adminCreateDto
   */
  async create(adminCreateDto: AdminCreateDto): Promise<Admin> {
    const checkPhone = await this.adminRepo.findOne(adminCreateDto.phone);
    if (checkPhone) {
      throw new BadRequestException();
    }
    const admin = await this.adminRepo.save(new Admin(adminCreateDto));
    // 욕심 같아서는 여기에 슬랙 알림을...넣고 새로운 관리자 등록 알림
    return admin;
  }

  /**
   * delete admin
   * change status
   * @param adminId
   */
  async delete(adminId: number): Promise<Admin> {
    const checkAdmin = await this.adminRepo.findOne({
      where: {
        no: adminId,
        delYN: YN.NO,
      },
    });
    if (!checkAdmin) {
      throw new NotFoundException();
    }
    const deleted = new Admin(checkAdmin);
    deleted.delYN = YN.YES;
    return await this.adminRepo.save(deleted);
  }

  /**
   * hard delete
   * @param adminId
   */
  async hardDelete(adminNo: number): Promise<boolean> {
    await this.__check_if_admin_exists(adminNo);
    await this.adminRepo
      .createQueryBuilder()
      .delete()
      .from(Admin)
      .where('no = :no', { no: adminNo })
      .execute();
    return true;
  }

  /**
   * Admin update own information
   * @param user
   * @param adminId
   * @param adminUpdateDto
   */
  async update(
    user: Admin,
    adminId: number,
    adminUpdateDto: AdminUpdateDto,
  ): Promise<Admin> {
    if (user.no !== adminId) {
      throw new ForbiddenException({
        message: '본인 계정이 아닌 계정은 수정 못합니다.',
        error: 403,
      });
    }
    let admin = await this.adminRepo.findOne(adminId);
    admin = admin.set(adminUpdateDto);
    admin = await this.adminRepo.save(admin);
    return admin;
  }

  /**
   * change admin role - admin super only
   * @param adminId
   * @param adminUpdateStatusDto
   */
  async updateStatus(
    adminId: number,
    adminUpdateStatusDto: AdminUpdateStatusDto,
  ): Promise<Admin> {
    let admin = await this.adminRepo.findOne(adminId);
    admin = admin.set(adminUpdateStatusDto);
    admin = await this.adminRepo.save(admin);
    return admin;
  }

  async encryptPassword(adminId: number, passwordTestDto: PasswordTestDto) {
    let admin = await this.adminRepo.findOne(adminId);
    const newPassword = await this.passwordService.hashPassword(
      passwordTestDto.password,
    );
    admin = admin.set({ password: newPassword });
    admin = await this.adminRepo.save(admin);
    return admin;
  }

  /**
   * find me
   * @param adminNo
   */
  async findMe(adminNo: number): Promise<Admin> {
    return await this.__check_if_admin_exists(adminNo);
  }

  /**
   * general update route for admin
   * @param adminNo
   * @param adminUpdateDto
   */
  async updateAdmin(
    adminNo: number,
    adminUpdateDto: AdminUpdateDto,
  ): Promise<Admin> {
    let admin = await this.adminRepo.findOne(adminNo);
    admin = admin.set(adminUpdateDto);
    admin = await this.adminRepo.save(admin);
    return admin;
  }

  /**
   * check if an admin exists before function
   * @param adminId
   */
  private async __check_if_admin_exists(adminId: number): Promise<Admin> {
    const checkAdmin = await this.adminRepo.findOne({
      where: {
        no: adminId,
        delYN: YN.NO,
      },
    });
    if (!checkAdmin) {
      throw new NotFoundException({
        message: '존재하지 않는 관리자입니다.',
        error: 404,
      });
    }
    return checkAdmin;
  }
}
