import {
  Controller,
  UseGuards,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  BaseController,
  AuthRolesGuard,
  COMPANY_USER,
  CONST_COMPANY_USER,
  ADMIN_USER,
  CONST_ADMIN_USER,
} from 'src/core';
import { CompanyService } from '../company/company.service';
import { CompanyUserCreateDto, CompanyUserUpdateDto } from './dto';
import { UserInfo, PaginatedRequest, PaginatedResponse } from 'src/common';
import { CompanyUser } from './company-user.entity';
import { CompanyUserService } from './company-user.service';
import { CompanyUserListDto } from './dto/company-user-list.dto';
import { CompanyUserPhoneDto } from '../auth/dto';

@Controller()
@ApiTags('COMPANY USER')
@ApiBearerAuth()
export class CompanyUserController extends BaseController {
  constructor(private readonly companyUserService: CompanyUserService) {
    super();
  }

  /**
   * find me
   * @param companyUser
   */
  @UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
  @Get('/company-user/find-me')
  async findMe(@UserInfo() companyUser: CompanyUser): Promise<CompanyUser> {
    return await this.companyUserService.findMe(companyUser.no);
  }

  /**
   * find one for company number
   * @param companyUserNo
   */
  @UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
  @Get('/company-user/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) companyUserNo: number,
    @UserInfo() companyUser: CompanyUser,
  ): Promise<CompanyUser> {
    return await this.companyUserService.findOne(
      companyUserNo,
      companyUser.companyNo,
    );
  }

  /**
   * find all for company user
   * @param companyUserListDto
   * @param pagination
   */
  @UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
  @Get('/company-user')
  async findAll(
    @Query() companyUserListDto: CompanyUserListDto,
    @Query() pagination: PaginatedRequest,
    @UserInfo() companyUser: CompanyUser,
  ): Promise<PaginatedResponse<CompanyUser>> {
    companyUserListDto.companyNo = companyUser.companyNo;
    return await this.companyUserService.findAllCompanyUserForCompanyUser(
      companyUserListDto,
      pagination,
    );
  }

  /**
   * create company user by company user admin
   * @param companyUserCreateDto
   * @param companyUser
   */
  @UseGuards(new AuthRolesGuard(COMPANY_USER.ADMIN_COMPANY_USER))
  @Post('/company-user')
  async create(
    @Body() companyUserCreateDto: CompanyUserCreateDto,
    @UserInfo() companyUser: CompanyUser,
  ): Promise<CompanyUser> {
    return await this.companyUserService.createForCompanyUserAdmin(
      companyUserCreateDto,
      companyUser,
    );
  }

  /**
   * update company user by company user
   * @param companyUser
   * @param companyUserUpdateDto
   */
  @Patch('/company-user')
  @UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ groups: [ADMIN_USER.SUPER] })
  async update(
    @UserInfo() companyUser: CompanyUser,
    @Body() companyUserUpdateDto: CompanyUserUpdateDto,
  ): Promise<CompanyUser> {
    return await this.companyUserService.updateByCompanyUser(
      companyUser.no,
      companyUserUpdateDto,
    );
  }

  /**
   * withdraw user
   * @param companyUser
   */
  @Delete('/company-user/withdraw')
  @UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
  async withdraw(@UserInfo() companyUser: CompanyUser) {
    return {
      isDeleted: await this.companyUserService.deleteUser(companyUser.no),
    };
  }

  /**
   * admin company user delete company user
   * @param companyUserNo
   */
  @Delete('/company-user/:id([0-9])')
  @UseGuards(new AuthRolesGuard(COMPANY_USER.ADMIN_COMPANY_USER))
  async deleteUser(@Param('id', ParseIntPipe) companyUserNo: number) {
    return {
      isDeleted: await this.companyUserService.deleteUser(companyUserNo),
    };
  }

  @UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
  @Get('/company-user/find-by-phone')
  async findByPhone(@Query() phone: CompanyUserPhoneDto): Promise<CompanyUser> {
    return await this.companyUserService.findByPhone(phone);
  }
}
