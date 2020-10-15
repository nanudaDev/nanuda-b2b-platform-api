import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginatedRequest, PaginatedResponse, UserInfo } from 'src/common';
import { ADMIN_USER, AuthRolesGuard, BaseController } from 'src/core';
import { Admin } from '../admin';
import { Credential } from './credential.entity';
import { CredentialService } from './credential.service';
import { AdminCredentialCreateDto, AdminCredentialListDto } from './dto';

@Controller()
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(ADMIN_USER.SUPER))
@ApiTags('ADMIN CREDENTIAL')
export class AdminCredentialController extends BaseController {
  constructor(private readonly credentialService: CredentialService) {
    super();
  }

  /**
   * create credential
   * @param admin
   * @param adminCredentialCreateDto
   */
  @Post('/admin/credential')
  async create(
    @UserInfo() admin: Admin,
    @Body() adminCredentialCreateDto: AdminCredentialCreateDto,
  ): Promise<Credential> {
    return await this.credentialService.create(
      admin.no,
      adminCredentialCreateDto,
    );
  }

  /**
   * find all for admin
   * @param adminCredentialListDto
   * @param pagination
   */
  @Get('/admin/credential')
  async findAll(
    @Query() adminCredentialListDto: AdminCredentialListDto,
    @Query() pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Credential>> {
    return await this.credentialService.findAllForAdmin(
      adminCredentialListDto,
      pagination,
    );
  }

  /**
   * find one
   * @param credentialNo
   */
  @Get('/admin/credential/:id([0-9]+)')
  async findOne(
    @Param('id', ParseIntPipe) credentialNo: number,
  ): Promise<Credential> {
    return await this.credentialService.findOneForAdmin(credentialNo);
  }

  /**
   * decipher
   * @param credentialNo
   */
  @Get('/admin/credential/:id([0-9]+)/decipher')
  async decipherOne(
    @Param('id', ParseIntPipe) credentialNo: number,
  ): Promise<string> {
    return await this.credentialService.decipher(credentialNo);
  }

  /**
   * delete
   * @param credentialNo
   */
  @Delete('/admin/credential/:id([0-9]+)')
  async delete(@Param('id', ParseIntPipe) credentialNo: number) {
    return await this.credentialService.deleteCredential(credentialNo);
  }
}
