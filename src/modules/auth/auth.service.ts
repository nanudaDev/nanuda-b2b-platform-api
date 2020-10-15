import { BaseService, APPROVAL_STATUS } from '../../core';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PasswordService } from './password.service';
import { Admin } from '../admin';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserSigninPayload, UserType, Auth } from './types';
import {
  AdminLoginDto,
  CompanyUserLoginDto,
  CompanyUserPasswordUpdateDto,
  CompanyUserPhoneDto,
} from './dto';
import { YN } from '../../common';
import { CompanyUser } from '../company-user/company-user.entity';
import { CompanyUserUpdateDto } from '../company-user/dto';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    @InjectRepository(CompanyUser)
    private readonly companyUserRepo: Repository<CompanyUser>,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {
    super();
  }
  /**
   * Login for admin
   * @param adminLoginDto
   */
  async adminLogin(adminLoginDto: AdminLoginDto): Promise<string> {
    // remove hyphen from login credentials

    if (adminLoginDto.phone && adminLoginDto.phone.includes('-')) {
      adminLoginDto.phone = adminLoginDto.phone.replace(/-/g, '');
    }
    const admin = await this.adminRepo.findOne({
      phone: adminLoginDto.phone,
      delYN: YN.NO,
    });
    if (!admin) {
      throw new NotFoundException({
        message: '존재하지 않는 관리자입니다.',
      });
    }
    if (!adminLoginDto.password) {
      throw new BadRequestException({
        message: '비밀번호를 입력해주세요.',
        error: 400,
      });
    }
    if (admin && admin.password !== adminLoginDto.password) {
      throw new BadRequestException({
        message: '비밀번호가 일치하지 않습니다.',
        error: 400,
      });
    }
    const loggedInAdmin = await this.adminRepo.findOne({
      phone: adminLoginDto.phone,
      delYN: YN.NO,
      password: adminLoginDto.password,
    });
    if (!loggedInAdmin) {
      throw new NotFoundException();
    }
    if (admin.adminYN !== YN.YES) {
      throw new NotFoundException();
    }
    const token = await this.sign(loggedInAdmin, {}, adminLoginDto.rememberMe);

    return token;
  }

  /**
   * Login for Nanuda  user
   */
  async companUserLogin(
    companyUserLoginDto: CompanyUserLoginDto,
  ): Promise<string> {
    // remove hyphen for consistency
    if (companyUserLoginDto.phone && companyUserLoginDto.phone.includes('-')) {
      companyUserLoginDto.phone = companyUserLoginDto.phone.replace(/-/g, '');
    }
    const companyUser = await this.companyUserRepo
      .createQueryBuilder('companyUser')
      .CustomInnerJoinAndSelect(['company'])
      .where('companyUser.phone = :phone', { phone: companyUserLoginDto.phone })
      .getOne();
    companyUser.companyStatus = companyUser.company.companyStatus;
    if (!companyUser) {
      throw new NotFoundException();
    }
    // hash passwords
    const passwordValid = await this.passwordService.validatePassword(
      companyUserLoginDto.password,
      companyUser.password,
    );
    if (!passwordValid) {
      throw new BadRequestException({
        message: '비밀번호가 일치하지 않습니다.',
        error: 400,
      });
    }
    const token = await this.sign(companyUser);
    // personally do not like how they are divided due to lack of error warnings
    // if (companyUser.companyUserStatus !== APPROVAL_STATUS.APPROVAL) {
    //   throw new BadRequestException({
    //     message: `Not approved to login. Current status is ${companyUser.companyUserStatus}`,
    //     error: 400,
    //   });
    // }
    // update last login time
    await this.companyUserRepo
      .createQueryBuilder('companyUser')
      .update()
      .set({ lastLoginAt: new Date() })
      .where('no = :no', { no: companyUser.no })
      .execute();
    return token;
  }

  /**
   * find user by phone number
   * @param companyUserPhoneDto
   */
  async findByPhone(companyUserPhoneDto: CompanyUserPhoneDto) {
    const user = await this.companyUserRepo
      .createQueryBuilder('companyUser')
      .CustomInnerJoinAndSelect(['company'])
      .where('companyUser.phone = :phone', { phone: companyUserPhoneDto.phone })
      .getOne();
    if (!user) {
      throw new NotFoundException();
    }
    user.companyStatus = user.company.companyStatus;
    const token = await this.sign(user, {}, true);
    return { user, token };
  }

  /**
   * find user by id
   * @param companyUserNo
   */
  async findById(companyUserNo: number) {
    const user = await this.companyUserRepo
      .createQueryBuilder('companyUser')
      .CustomInnerJoinAndSelect(['company'])
      .where('companyUser.no = :no', { no: companyUserNo })
      .getOne();
    if (!user) {
      throw new NotFoundException();
    }
    user.companyStatus = user.company.companyStatus;
    const token = await this.sign(user, {}, true);
    return { user, token };
  }

  /**
   * sign to jwt payload
   * @param user
   * @param extend
   */
  async sign(user: Admin | CompanyUser, extend?: any, rememberMe?: boolean) {
    const options = rememberMe
      ? { expiresIn: process.env.JWT_REMEMBER_ME_EXPIRED_IN }
      : {};
    const userSignInInfo: UserSigninPayload = {
      _id: user.phone,
      _no: user.no,
      username: user.name,
      userType: user.userType,
      adminRole: user.authCode,
      userStatus: user.companyUserStatus,
      companyStatus: user.companyStatus,
    };
    return this.jwtService.sign({ ...userSignInInfo, ...extend }, options);
  }

  /**
   * Validate admin
   * @param adminId
   */
  async validateAdminById(adminId: number): Promise<Admin> {
    return await this.adminRepo.findOne(adminId);
  }

  /**
   * validate company user
   * @param companyNo
   */
  async validateUserById(companyUserNo: number): Promise<CompanyUser> {
    const qb = await this.companyUserRepo
      .createQueryBuilder('companyUser')
      .innerJoinAndSelect('companyUser.company', 'company')
      .where('companyUser.no = :no', { no: companyUserNo })
      .getOne();
    qb.companyStatus = qb.company.companyStatus;
    return qb;
  }

  /**
   * validate admin and return payload
   * @param token
   */
  async validateAdminByToken(token) {
    if (!token) {
      throw new BadRequestException({
        message: 'No token.',
      });
    }
    const payload = await this.jwtService.decode(token.token);
    return payload;
  }

  /**
   * verify user by phone
   * @param companyUserPhoneDto
   */
  async validateUserByPhone(companyUserPhoneDto: CompanyUserPhoneDto) {
    const companyUser = await this.companyUserRepo.findOne({
      phone: companyUserPhoneDto.phone,
    });
    if (!companyUser) {
      throw new NotFoundException();
    } else {
      return companyUser.no;
    }
  }

  /**
   * validate password
   * @param companyUserNo
   * @param companyUserPasswordUpdateDto
   */
  async validatePasswordForCompanyUser(
    companyUserNo: number,
    companyUserPasswordUpdateDto: CompanyUserPasswordUpdateDto,
  ): Promise<boolean> {
    const password = companyUserPasswordUpdateDto.password;
    const companyUser = await this.companyUserRepo.findOne({
      where: {
        no: companyUserNo,
        delYN: YN.NO,
      },
    });
    const validate = await this.passwordService.validatePassword(
      password,
      companyUser.password,
    );
    if (!validate) {
      throw new BadRequestException({
        message: '비밀번호가 일치하지 않습니다.',
      });
    }
    return true;
  }

  /**
   * change password
   * @param companyUserNo
   * @param companyUserPasswordUpdateDto
   */
  async updatePasswordForCompanyUser(
    companyUserNo: number,
    companyUserPasswordUpdateDto: CompanyUserPasswordUpdateDto,
  ): Promise<CompanyUser> {
    let companyUser = await this.companyUserRepo.findOne({
      where: {
        no: companyUserNo,
        delYN: YN.NO,
      },
    });
    const newPassword = await this.passwordService.hashPassword(
      companyUserPasswordUpdateDto.password,
    );
    companyUser.password = newPassword;
    companyUser.passwordChangedYn = YN.YES;
    companyUser = await this.companyUserRepo.save(companyUser);
    return companyUser;
  }
}
