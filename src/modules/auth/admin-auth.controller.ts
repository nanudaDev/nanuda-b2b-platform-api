import { Controller, Post, Body } from '@nestjs/common';
import { BaseController } from '../../core';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto';
import { Auth, UserSigninPayload } from './types';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../admin';
import { Repository } from 'typeorm';

@Controller()
@ApiTags('AUTH ADMIN')
export class AdminAuthController extends BaseController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
  ) {
    super();
  }

  /**
   * admin login
   * @param adminLoginDto
   */
  @ApiOperation({
    description: '관리자 로그인',
  })
  @Post('/auth/admin/login')
  async login(@Body() adminLoginDto: AdminLoginDto): Promise<string> {
    return await this.authService.adminLogin(adminLoginDto);
  }

  /**
   * validate token using jwt-decode
   * @param token
   */
  @Post('/admin/validate-token')
  async validateToken(@Body() token: string) {
    return await this.authService.validateAdminByToken(token);
  }
}
