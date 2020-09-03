import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BaseController, AuthRolesGuard, CONST_COMPANY_USER } from '../../core';
import { AuthService } from './auth.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  CompanyUserLoginDto,
  CompanyUserPasswordUpdateDto,
  CompanyUserPhoneDto,
} from './dto';
import { UserInfo } from 'src/common';
import { CompanyUser } from '../company-user/company-user.entity';

@Controller()
@ApiTags('AUTH COMPANY USER')
export class UserAuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }
  /**
   * login for regular user
   * @param nanudaUserLoginDto
   */
  @Post('/auth/company-user/login')
  async login(
    @Body() companyUserLoginDto: CompanyUserLoginDto,
  ): Promise<string> {
    return await this.authService.companUserLogin(companyUserLoginDto);
  }

  @ApiBearerAuth()
  @UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
  @Post('/auth/company-user/validate-password')
  async validatePassword(
    @UserInfo() companyUser: CompanyUser,
    @Body() companyUserPasswordUpdateDto: CompanyUserPasswordUpdateDto,
  ) {
    return {
      isValidated: await this.authService.validatePasswordForCompanyUser(
        companyUser.no,
        companyUserPasswordUpdateDto,
      ),
    };
  }

  /**
   * change password when logged in
   * @param companyUserPasswordUpdateDto
   * @param companyUser
   */
  @ApiBearerAuth()
  @UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
  @Post('/auth/company-user/update-password')
  async updatePasswordWhenLoggedIn(
    @Body() companyUserPasswordUpdateDto: CompanyUserPasswordUpdateDto,
    @UserInfo() companyUser: CompanyUser,
  ) {
    return await this.authService.updatePasswordForCompanyUser(
      companyUser.no,
      companyUserPasswordUpdateDto,
    );
  }

  /**
   * change password when logged in
   * @param companyUserPasswordUpdateDto
   * @param companyUser
   */
  @ApiBearerAuth()
  @UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
  @Get('/auth/company-user/find-by-phone')
  async findByPhoneUser(@Query() phone: CompanyUserPhoneDto) {
    return await this.authService.findByPhone(phone);
  }

  /**
   * change password when logged in
   * @param companyUserPasswordUpdateDto
   * @param companyUser
   */
  @ApiBearerAuth()
  @UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
  @Get('/auth/company-user/find-by-id/:id([0-9]+)')
  async findByNo(@Param('id', ParseIntPipe) companyUserNo: number) {
    return await this.authService.validateUserById(companyUserNo);
  }
}
