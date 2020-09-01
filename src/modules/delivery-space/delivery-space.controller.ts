import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  UseGuards,
  Controller,
  Get,
  Query,
  ParseIntPipe,
  Param,
  Post,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import {
  AuthRolesGuard,
  CONST_COMPANY_USER,
  BaseController,
  COMPANY_USER,
} from 'src/core';
import {
  DeliverySpaceListDto,
  DeliverySpaceCreateDto,
  DeliverySpaceUpdateDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse, UserInfo } from 'src/common';
import { DeliverySpace } from './delivery-space.entity';
import { CompanyUser } from '../company-user/company-user.entity';
import { DeliverySpaceService } from './delivery-space.service';

@Controller()
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
@ApiTags('DELIVERY SPACE')
export class DeliverySpaceController extends BaseController {
  constructor(private readonly deliverySpaceService: DeliverySpaceService) {
    super();
  }

  /**
   * find all for company user
   * @param deliverySpaceListDto
   * @param pagination
   * @param companyUser
   */
  @Get('/delivery-space')
  async findAll(
    @Query() deliverySpaceListDto: DeliverySpaceListDto,
    @Query() pagination: PaginatedRequest,
    @UserInfo() companyUser: CompanyUser,
  ): Promise<PaginatedResponse<DeliverySpace>> {
    return await this.deliverySpaceService.findAllForCompanyUser(
      companyUser.companyNo,
      deliverySpaceListDto,
      pagination,
    );
  }

  @Get('/delivery-space/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) deliverySpaceNo: number,
    @UserInfo() companyUser: CompanyUser,
  ): Promise<DeliverySpace> {
    return await this.deliverySpaceService.findOneForCompanyUser(
      deliverySpaceNo,
      companyUser.companyNo,
    );
  }

  /**
   * delivery space post fot company user
   * @param companyUser
   * @param deliverySpaceCreateDto
   */
  @Post('/delivery-space')
  async create(
    @UserInfo() companyUser: CompanyUser,
    @Body() deliverySpaceCreateDto: DeliverySpaceCreateDto,
  ): Promise<DeliverySpace> {
    return await this.deliverySpaceService.createForCompanyUser(
      companyUser.no,
      companyUser.companyNo,
      deliverySpaceCreateDto,
    );
  }

  /**
   * update for company user
   * @param deliverySpaceNo
   * @param companyUser
   * @param deliverySpaceUpdateDto
   */
  @Patch('/delivery-space/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) deliverySpaceNo: number,
    @UserInfo() companyUser: CompanyUser,
    @Body() deliverySpaceUpdateDto: DeliverySpaceUpdateDto,
  ): Promise<DeliverySpace> {
    return await this.deliverySpaceService.updateByCompanyUser(
      deliverySpaceNo,
      companyUser.companyNo,
      companyUser.no,
      deliverySpaceUpdateDto,
    );
  }

  /**
   * delete
   * @param companyUser
   * @param deliverySpaceNo
   */
  @UseGuards(new AuthRolesGuard(COMPANY_USER.ADMIN_COMPANY_USER))
  @Delete('/delivery-space/:id([0-9]+)')
  async deleteSpace(
    @UserInfo() companyUser: CompanyUser,
    @Param('id', ParseIntPipe) deliverySpaceNo: number,
  ) {
    return await this.deliverySpaceService.deleteByCompanyUser(
      deliverySpaceNo,
      companyUser.companyNo,
    );
  }
}
