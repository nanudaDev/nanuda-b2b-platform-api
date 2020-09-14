import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseService } from 'src/core';
import {
  AdminMenuListDto,
  AdminMenuCreateDto,
  AdminMenuDeleteDto,
} from './dto';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { Menu } from './menu.entity';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class MenuService extends BaseService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepo: Repository<Menu>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly fileUploadService: FileUploadService,
  ) {
    super();
  }

  /**
   * find all for admin
   * @param adminMenuListDto
   * @param pagination
   */
  async findAll(
    adminMenuListDto: AdminMenuListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Menu>> {
    const qb = this.menuRepo
      .createQueryBuilder('menu')
      .CustomLeftJoinAndSelect(['brand'])
      .AndWhereLike(
        'brand',
        'nameKr',
        adminMenuListDto.brandName,
        adminMenuListDto.exclude('brandName'),
      )
      .AndWhereLike(
        'menu',
        'nameKr',
        adminMenuListDto.nameKr,
        adminMenuListDto.exclude('nameKr'),
      )
      .AndWhereLike(
        'menu',
        'nameEng',
        adminMenuListDto.nameEng,
        adminMenuListDto.exclude('nameEng'),
      )
      .WhereAndOrder(adminMenuListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  async findOneForAdmin(menuNo: number): Promise<Menu> {
    const menu = await this.menuRepo
      .createQueryBuilder('menu')
      .CustomLeftJoinAndSelect(['brand'])
      .where('menu.no = :no', { no: menuNo })
      .getOne();

    if (!menu) {
      throw new NotFoundException();
    }

    return menu;
  }

  /**
   * create for admin
   * @param adminMenuCreateDto
   */
  async createForAdmin(adminMenuCreateDto: AdminMenuCreateDto): Promise<Menu> {
    const menu = await this.menuRepo.findOne({
      nameKr: adminMenuCreateDto.nameKr,
      brandNo: adminMenuCreateDto.brandNo,
    });
    if (menu) {
      throw new BadRequestException({
        message: '메뉴가 이미 존재합니다.',
        error: 400,
      });
    }
    let newMenu = new Menu(adminMenuCreateDto);
    if (newMenu.images && newMenu.images.length > 0) {
      newMenu.images = await this.fileUploadService.moveS3File(newMenu.images);
      if (!newMenu.images) {
        throw new BadRequestException({ message: 'Upload failed!' });
      }
    }
    newMenu = await this.menuRepo.save(newMenu);
    return newMenu;
  }

  //   async deleteMenusForAdmin(adminMenuDeleteDto: AdminMenuDeleteDto) {

  //   }
}
