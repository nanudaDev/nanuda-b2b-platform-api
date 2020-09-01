import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthRolesGuard, CONST_ADMIN_USER, BaseController } from 'src/core';
import { SpaceTypeService } from './space-type.service';
import { SpaceType } from './space-type.entity';

@Controller()
@ApiTags('ADMIN SPACE TYPE')
@UseGuards(new AuthRolesGuard(...CONST_ADMIN_USER))
export class AdminSpaceTypeController extends BaseController {
  constructor(private readonly spaceTypeService: SpaceTypeService) {
    super();
  }

  @Get('/admin/space-type')
  async findAll(): Promise<SpaceType[]> {
    return await this.spaceTypeService.findAll();
  }
}
