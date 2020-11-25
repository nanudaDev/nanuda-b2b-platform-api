import {
  Controller,
  Get,
  UseGuards,
  Query,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { BaseController } from 'src/core';
import { AdminListDto, AdminCreateDto, AdminUpdateDto } from './dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthRolesGuard } from 'src/core/guards';
import { CONST_ADMIN_USER, ADMIN_USER } from 'src/shared';
import { PaginatedRequest, PaginatedResponse, UserInfo, YN } from 'src/common';
import { Admin } from './admin.entity';
import { AdminService } from './admin.service';
import { AdminUpdateStatusDto } from './dto/admin-update-status.dto';
import { PasswordTestDto } from './dto/password-testing.dto';

@ApiTags('ADMIN')
@ApiBearerAuth()
@Controller()
export class AdminController extends BaseController {
  constructor(private readonly adminService: AdminService) {
    super();
  }

  /**
   * admin list
   * @param adminListDto
   * @param pagination
   */
  @ApiOperation({})
  @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
  @Get('/admin')
  async findAll(
    @Query() adminListDto: AdminListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Admin>> {
    adminListDto.delYn === YN.NO;
    return await this.adminService.findAll(adminListDto, pagination);
  }

  /**
   * Admin find one
   * @param id
   */
  @ApiOperation({})
  @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
  @Get('/admin/:id([0-9]+)')
  async findOne(@Param('id', ParseIntPipe) adminId: number): Promise<Admin> {
    return await this.adminService.findOne(adminId);
  }

  /**
   * create admin
   * @param adminCreateDto
   */
  @ApiOperation({
    description: '관리자가 새로운 관리자 등록',
  })
  @Post('/admin')
  @UseGuards(new AuthRolesGuard(ADMIN_USER.SUPER))
  async create(@Body() adminCreateDto: AdminCreateDto): Promise<Admin> {
    return await this.adminService.create(adminCreateDto);
  }

  /**
   * create admin
   * @param adminCreateDto
   */
  @ApiOperation({
    description: '관리자 본인 등록',
  })
  @Post('/admin/register')
  async register(@Body() adminCreateDto: AdminCreateDto): Promise<Admin> {
    return await this.adminService.create(adminCreateDto);
  }

  /**
   * admin soft delete
   * @param adminId
   */
  @ApiOperation({})
  @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
  @Delete('/admin/:id([0-9]+)')
  async delete(@Param('id', ParseIntPipe) adminId: number): Promise<Admin> {
    return await this.adminService.delete(adminId);
  }

  /**
   * hard delete admin for super admin
   * @param adminId
   */
  @ApiOperation({})
  @UseGuards(new AuthRolesGuard(ADMIN_USER.SUPER))
  @Delete('/admin/hard-delete/:id([0-9]+)')
  async hardDelete(@Param('id', ParseIntPipe) adminId: number) {
    return { isDeleted: await this.adminService.hardDelete(adminId) };
  }
  /**
   * admin self update
   * @param admin
   * @param id
   * @param adminUpdateDto
   */
  @ApiOperation({})
  @Patch('/admin/self-update/:id([0-9]+)')
  @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
  async selfUpdate(
    @UserInfo() admin: Admin,
    @Param('id', ParseIntPipe) id: number,
    @Body() adminUpdateDto: AdminUpdateDto,
  ): Promise<Admin> {
    return await this.adminService.update(admin, id, adminUpdateDto);
  }

  /**
   * update status for admin
   */
  @ApiOperation({
    description: '권한 변경 엔드포인트',
  })
  @Patch('/admin/:id([0-9]+)')
  @UseGuards(new AuthRolesGuard(ADMIN_USER.SUPER))
  async updateStatus(
    @Body() adminUpdateStatusDto: AdminUpdateStatusDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Admin> {
    return await this.adminService.updateStatus(id, adminUpdateStatusDto);
  }

  // testing
  @Post('/admin/change-pw/:id([0-9]+)')
  async changePW(
    @Body() passwordDto: PasswordTestDto,
    @Param('id', ParseIntPipe) adminId: number,
  ) {
    return await this.adminService.encryptPassword(adminId, passwordDto);
  }

  /**
   * find myself
   * @param admin
   */
  @Get('/admin/find-me')
  @UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
  async findMe(@UserInfo() admin: Admin): Promise<Admin> {
    return await this.adminService.findMe(admin.no);
  }

  /**
   * general update for admin
   * @param adminNo
   * @param adminUpdateDto
   */
  @Patch('/admin/update/:id([0-9]+)')
  async updateAdmin(
    @Param('id', ParseIntPipe) adminNo: number,
    @Body() adminUpdateDto: AdminUpdateDto,
  ): Promise<Admin> {
    return await this.adminService.updateAdmin(adminNo, adminUpdateDto);
  }
}
