import { BaseController, AuthRolesGuard, CONST_COMPANY_USER } from 'src/core';
import { SpaceTypeService } from './space-type.service';
import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from '../auth';
import { SpaceType } from './space-type.entity';

@Controller()
@ApiTags('SPACE TYPE')
@ApiBearerAuth()
@UseGuards(new AuthRolesGuard(...CONST_COMPANY_USER))
export class SpaceTypeController extends BaseController {
  constructor(private readonly spaceTypeService: SpaceTypeService) {
    super();
  }

  @Get('/space-type')
  async findAll(): Promise<SpaceType[]> {
    return await this.spaceTypeService.findAll();
  }
}
