import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  UseGuards,
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
  Body,
} from '@nestjs/common';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { NanudaUserService } from './nanuda-user.service';
import { AdminNanudaUserListDto, AdminNanudaUserUpdateDto } from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { NanudaUser } from './nanuda-user.entity';

@Controller()
@ApiTags('ADMIN NANUDA USER')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminNanudaUserController extends BaseController {
  constructor(private readonly nanudaUserService: NanudaUserService) {
    super();
  }

  /**
   * find all for admin
   * @param adminNanudaUserListDto
   * @param pagination
   */
  @Get('/admin/nanuda-user')
  async findAll(
    @Query() adminNanudaUserListDto: AdminNanudaUserListDto,
    @Query() pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<NanudaUser>> {
    return await this.nanudaUserService.findAllForAdmin(
      adminNanudaUserListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param nanudaUserNo
   */
  @Get('/admin/nanuda-user/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) nanudaUserNo: number,
  ): Promise<NanudaUser> {
    return await this.nanudaUserService.findOneForAdmin(nanudaUserNo);
  }

  /**
   * delete for admin
   * @param nanudaUserNo
   */
  @Delete('/admin/nanuda-user/:id([0-9]+)')
  async delete(@Param('id', ParseIntPipe) nanudaUserNo: number) {
    return await this.nanudaUserService.deleteForAdmin(nanudaUserNo);
  }

  /**
   * update for nanuda user
   * @param nanudaUserNo
   * @param adminNanudaUserUpdateDto
   */
  @Patch('/admin/nanuda-user/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) nanudaUserNo: number,
    @Body() adminNanudaUserUpdateDto: AdminNanudaUserUpdateDto,
  ): Promise<NanudaUser> {
    return await this.nanudaUserService.updateForAdmin(
      nanudaUserNo,
      adminNanudaUserUpdateDto,
    );
  }
}
