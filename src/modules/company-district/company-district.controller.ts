import {
  Controller,
  UseGuards,
  Get,
  Query,
  Patch,
  Param,
  ParseIntPipe,
  Body,
  Post,
} from '@nestjs/common';
import { BaseController, AuthRolesGuard, CONST_COMPANY_USER } from 'src/core';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserInfo, PaginatedRequest, PaginatedResponse } from 'src/common';
import { CompanyDistrictService } from './company-district.service';
import { CompanyUser } from '../company-user/company-user.entity';
import { CompanyDistrict } from './company-district.entity';
import {
  CompanyDistrictListDto,
  CompanyDistrictUpdateDto,
  CompanyDistrictCreateDto,
} from './dto';

@Controller()
@ApiTags('COMPANY DISTRICT')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
export class CompanyDistrictController extends BaseController {
  constructor(private readonly companyDistrictService: CompanyDistrictService) {
    super();
  }

  @Get('/company-district')
  async findForCompanyUser(
    @UserInfo() companyUser: CompanyUser,
    @Query() companyDistrictListDto: CompanyDistrictListDto,
    @Query() pagination?: PaginatedRequest,
  ): Promise<PaginatedResponse<CompanyDistrict>> {
    companyDistrictListDto.companyNo = companyUser.companyNo;
    return await this.companyDistrictService.findCompanyDistrictForCompanyUser(
      companyDistrictListDto,
      pagination,
    );
  }

  /**
   * find one
   * @param companyDistrictNo
   * @param companyUser
   */
  @Get('/company-district/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) companyDistrictNo: number,
    @UserInfo() companyUser: CompanyUser,
  ): Promise<CompanyDistrict> {
    return await this.companyDistrictService.findOneForCompanyUser(
      companyUser.companyNo,
      companyDistrictNo,
    );
  }

  /**
   * find for company user
   * @param companyUser
   */
  @Get('/company-district/select-option')
  async findAll(
    @UserInfo() companyUser: CompanyUser,
  ): Promise<CompanyDistrict[]> {
    return await this.companyDistrictService.findForCompanyUser(
      companyUser.companyNo,
    );
  }

  /**
   * create for company user
   * @param companyUser
   * @param companyDistrictCreateDto
   */
  @Post('/company-district')
  async create(
    @UserInfo() companyUser: CompanyUser,
    @Body() companyDistrictCreateDto: CompanyDistrictCreateDto,
  ): Promise<CompanyDistrict> {
    companyDistrictCreateDto.companyNo = companyUser.no;
    return await this.companyDistrictService.create(
      companyDistrictCreateDto,
      companyUser.no,
    );
  }

  /**
   * update
   * @param companyUser
   * @param companyDistrictNo
   * @param companyDistrictUpdateDto
   */
  @Patch('/company-district/:id([0-9]+)')
  async update(
    @UserInfo() companyUser: CompanyUser,
    @Param('id', ParseIntPipe) companyDistrictNo: number,
    @Body() companyDistrictUpdateDto: CompanyDistrictUpdateDto,
  ): Promise<CompanyDistrict> {
    return await this.companyDistrictService.updateForCompanyUser(
      companyUser.companyNo,
      companyDistrictNo,
      companyDistrictUpdateDto,
    );
  }
}
