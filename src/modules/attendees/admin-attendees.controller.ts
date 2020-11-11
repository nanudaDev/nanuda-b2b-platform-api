import {
  Controller,
  Get,
  UseGuards,
  Query,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import {
  AuthRolesGuard,
  BaseController,
  BaseDto,
  CONST_ADMIN_USER,
} from 'src/core';
import { Attendees } from './attendees.entity';
import { AttendeesService } from './attendees.service';
import {
  AdminAttendeesCreateDto,
  AdminAttendeesListDto,
  AdminAttendeesUpdateDto,
} from './dto';

@Controller()
@ApiTags('ADMIN ATTENDEES')
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
@ApiBearerAuth()
export class AdminAttendeesController extends BaseController {
  constructor(private readonly attendeesService: AttendeesService) {
    super();
  }

  /**
   * find all for admin
   * @param adminAttendeesListDto
   * @param pagination
   */
  @Get('/admin/attendees')
  async findAll(
    @Query() adminAttendeesListDto: AdminAttendeesListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Attendees>> {
    return await this.attendeesService.findAllForAdmin(
      adminAttendeesListDto,
      pagination,
    );
  }

  /**
   * find one for admin
   * @param attendeesNo
   */
  @Get('/admin/attendees/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) attendeesNo: number,
  ): Promise<Attendees> {
    return await this.attendeesService.findOneForAdmin(attendeesNo);
  }

  /**
   * create for admin
   * @param adminAttendeesCreateDto
   */
  @Post('/admin/attendees')
  async create(
    @Body() adminAttendeesCreateDto: AdminAttendeesCreateDto,
  ): Promise<Attendees> {
    return await this.attendeesService.createForAdmin(adminAttendeesCreateDto);
  }

  /**
   * update for admin
   * @param attendeesNo
   * @param adminAttendeesUpdateDto
   */
  @Patch('/admin/attendees/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) attendeesNo: number,
    @Body() adminAttendeesUpdateDto: AdminAttendeesUpdateDto,
  ): Promise<Attendees> {
    return await this.attendeesService.updateForAdmin(
      attendeesNo,
      adminAttendeesUpdateDto,
    );
  }
}
