import {
  Controller,
  UseGuards,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { MenuService } from './menu.service';
import {
  AdminMenuListDto,
  AdminMenuCreateDto,
  AdminMenuUpdateDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { Menu } from './menu.entity';

@Controller()
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
@ApiTags('ADMIN MENU')
export class AdminMenuController extends BaseController {
  constructor(private readonly menuService: MenuService) {
    super();
  }

  /**
   * find all for admin
   * @param adminMenuListDto
   * @param pagination
   */
  @Get('/admin/menu')
  async findAll(
    @Query() adminMenuListDto: AdminMenuListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Menu>> {
    return await this.menuService.findAll(adminMenuListDto, pagination);
  }

  /**
   * find one for admin
   * @param menuNo
   */
  @Get('/admin/menu/:id([0-9]+)')
  async findOne(@Param('id', ParseIntPipe) menuNo: number): Promise<Menu> {
    return await this.menuService.findOneForAdmin(menuNo);
  }

  /**
   * create for admin
   * @param adminMenuCreateDto
   */
  @Post('/admin/menu')
  async create(@Body() adminMenuCreateDto: AdminMenuCreateDto): Promise<Menu> {
    return await this.menuService.createForAdmin(adminMenuCreateDto);
  }

  /**
   * update for admin
   * @param menuNo
   * @param adminMenuUpdateDto
   */
  @Patch('/admin/menu/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) menuNo: number,
    @Body() adminMenuUpdateDto: AdminMenuUpdateDto,
  ): Promise<Menu> {
    return await this.menuService.updateForAdmin(menuNo, adminMenuUpdateDto);
  }
}
