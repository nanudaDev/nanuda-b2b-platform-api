import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/core';
import {
  SmallBusinessApplicationCreateDto,
  SmallBusinessApplicationListDto,
  SmallBusinessApplicationUpdateDto,
} from './dto';
import { SmallBusinessApplication } from './small-business-application.entity';
import { SmallBusinessApplicationService } from './small-business-application.service';

@Controller()
@ApiTags('SMALL BUSINESS APPLICATION')
export class SmallBusinessApplicationController extends BaseController {
  constructor(
    private readonly smallBusinessApplicationService: SmallBusinessApplicationService,
  ) {
    super();
  }

  /**
   * create application
   * @param smallBusinessApplicationCreateDto
   */
  @Post('/small-business-application')
  async create(
    @Body()
    smallBusinessApplicationCreateDto: SmallBusinessApplicationCreateDto,
  ): Promise<SmallBusinessApplication> {
    return await this.smallBusinessApplicationService.createForNanudaUser(
      smallBusinessApplicationCreateDto,
    );
  }

  /**
   * update for user
   * @param applicationNo
   * @param smallBusinessApplicationUpdateDto
   */
  @Patch('/small-business-application/:id([0-9]+)')
  async update(
    @Param('id', ParseIntPipe) applicationNo: number,
    @Body()
    smallBusinessApplicationUpdateDto: SmallBusinessApplicationUpdateDto,
  ): Promise<SmallBusinessApplication> {
    return await this.smallBusinessApplicationService.updateForUser(
      applicationNo,
      smallBusinessApplicationUpdateDto,
    );
  }

  /**
   * find for user
   * @param smallBusinessApplicationListDto
   */
  @Get('/small-business-application')
  async findAll(
    @Query() smallBusinessApplicationListDto: SmallBusinessApplicationListDto,
  ): Promise<SmallBusinessApplication[]> {
    return await this.smallBusinessApplicationService.findOneForNanudaUser(
      smallBusinessApplicationListDto,
    );
  }
}
