require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import Axios from 'axios';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { BaseService, SPACE_TYPE } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import {
  DropdownResults,
  SearchResults,
} from '../company-district/nanuda-company-district.service';
import { NanudaSpaceSearchDto, SpaceListDto } from './dto';
import { Space } from './space.entity';

@Injectable()
export class NanudaSpaceService extends BaseService {
  constructor(
    @InjectRepository(Space) private readonly spaceRepo: Repository<Space>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  /**
   * get dropdown for search bar
   * @param spaceListDto
   */
  async spaceDropDown(spaceListDto: SpaceListDto) {
    const topResults: DropdownResults[] = [];
    const secondResults: DropdownResults[] = [];
    const dropdownSpace = await this.spaceRepo
      .createQueryBuilder('space')
      .andWhere('space.delYn = :delYn', { delYn: YN.NO })
      .andWhere('space.spaceTypeNo = :spaceTypeNo', {
        spaceTypeNo: SPACE_TYPE.SPACE_SHARE,
      })
      .andWhere('space.showYn = :showYn', { showYn: YN.YES })
      .andWhere(
        'space.sido like :keyword or space.sigungu like :keyword or space.bName2 like :keyword',
        {
          keyword: `%${spaceListDto.keyword}%`,
        },
      )
      .select(['space.no', 'space.sido', 'space.sigungu', 'space.bName2'])
      //   .groupBy('space.sido')
      .getMany();
    const reduced: any = this.__remove_duplicate(dropdownSpace, 'sido');
    reduced.map(reduce => {
      const top = new DropdownResults();
      top.no = reduce.no;
      top.name = `${reduce.sido} ${reduce.sigungu}`;
      top.district = true;
      topResults.push(top);
    });
    const reduced2: any = this.__remove_duplicate(dropdownSpace, 'sigungu');
    reduced2.map(space => {
      const second = new DropdownResults();
      second.no = space.no;
      second.name = `${space.sido} ${space.sigungu} ${space.bName2}`;
      secondResults.push(second);
    });
    return { topResults, secondResults };
  }

  /**
   * get center for map keyword
   * @param spaceListDto
   */
  async getCenterForMap(spaceListDto: SpaceListDto): Promise<SearchResults> {
    const searchResults = new SearchResults();
    if (spaceListDto.keyword) {
      let latLon = await Axios.get(
        'https://dapi.kakao.com/v2/local/search/address.json',
        {
          params: { query: spaceListDto.keyword },
          headers: {
            Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
            mode: 'cors',
          },
        },
      );
      if (latLon.data.documents && latLon.data.documents.length === 0) {
        latLon = await Axios.get(
          'https://dapi.kakao.com/v2/local/search/keyword.json',
          {
            params: { query: spaceListDto.keyword },
            headers: {
              Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
              mode: 'cors',
            },
          },
        );
        searchResults.lat = latLon.data.documents[0].y;
        searchResults.lon = latLon.data.documents[0].x;
      }
      searchResults.lat = latLon.data.documents[0].y;
      searchResults.lon = latLon.data.documents[0].x;
    }
    return searchResults;
  }

  /**
   * search
   * @param companyDistrictListDto
   */
  async search(
    spaceListDto: SpaceListDto,
    nanudaSpaceSearchDto: NanudaSpaceSearchDto,
  ): Promise<SearchResults> {
    const searchResults = new SearchResults();
    // "https://dapi.kakao.com/v2/local/search/keyword.json?y=37.514322572335935&x=127.06283102249932&radius=20000" \
    // --data-urlencode "query=카카오프렌즈" \
    // -H "Authorization: KakaoAK {REST_API_KEY}"
    if (spaceListDto.keyword) {
      let latLon = await Axios.get(
        'https://dapi.kakao.com/v2/local/search/address.json',
        {
          params: { query: spaceListDto.keyword },
          headers: {
            Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
            mode: 'cors',
          },
        },
      );
      if (latLon.data.documents && latLon.data.documents.length === 0) {
        latLon = await Axios.get(
          'https://dapi.kakao.com/v2/local/search/keyword.json',
          {
            params: { query: spaceListDto.keyword },
            headers: {
              Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
              mode: 'cors',
            },
          },
        );
        searchResults.lat = latLon.data.documents[0].y;
        searchResults.lon = latLon.data.documents[0].x;
      }
      searchResults.lat = latLon.data.documents[0].y;
      searchResults.lon = latLon.data.documents[0].x;
    }
    const qb = this.spaceRepo
      .createQueryBuilder('space')
      .where('space.delYn = :delYn', { delYn: YN.NO })
      .andWhere('space.showYn = :showYn', { showYn: YN.YES })
      // .AndWhereIn('brands', 'no', nanudaSpaceSearchDto.brandIds)
      .andWhere('space.spaceTypeNo = :spaceTypeNo', {
        spaceTypeNo: SPACE_TYPE.SPACE_SHARE,
      });
    // .limit(2)
    if (
      nanudaSpaceSearchDto.amenityIds &&
      nanudaSpaceSearchDto.amenityIds.length > 0
    ) {
      qb.CustomInnerJoinAndSelect(['amenities']);
      qb.AndWhereIn('amenities', 'no', nanudaSpaceSearchDto.amenityIds);
      qb.groupBy('space.no');
      qb.having(
        `COUNT(DISTINCT amenities.no) = ${nanudaSpaceSearchDto.amenityIds.length}`,
      );
    }

    const space = await qb.getMany();
    // TODO: typeorm subquery로 해결
    searchResults.cities = space;
    return searchResults;
  }

  /**
   * find relative space
   * @param spaceNo
   * @param pagination
   */
  async findRelativeSpaces(
    spaceNo: number,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Space>> {
    const selectedSpace = await this.spaceRepo.findOne(spaceNo);

    const qb = this.spaceRepo
      .createQueryBuilder('space')
      .CustomLeftJoinAndSelect(['fileManagements'])
      .where('space.delYn = :delYn', { delYn: YN.NO })
      .andWhere('space.showYn = :showYn', { showYn: YN.YES })
      .andWhere('space.spaceTypeNo = :spaceTypeNo', {
        spaceTypeNo: SPACE_TYPE.SPACE_SHARE,
      })
      .andWhere(
        `space.monthlyFee BETWEEN ${selectedSpace.rentalFee} - 50 AND ${selectedSpace.rentalFee} + 50`,
      )
      .andWhere('fileManagements.targetTable = :targetTable', {
        targetTable: 'SPACE',
      })
      .limit(5)
      .Paginate(pagination);

    let [items, totalCount] = await qb.getManyAndCount();
    items.map(item => {
      if (item.no === selectedSpace.no) {
        const index = items.indexOf(item);
        items.splice(index, 1);
        totalCount - 1;
      }
    });
    return { items, totalCount };
  }

  async spaceCount() {
    const qb = this.spaceRepo
      .createQueryBuilder('space')
      .where('space.delYn = :delYn', { delYn: YN.NO })
      .andWhere('space.showYn = :showYn', { showYn: YN.YES })
      .andWhere('space.spaceTypeNo = :spaceTypeNo', {
        spaceTypeNo: SPACE_TYPE.SPACE_SHARE,
      })
      .getCount();

    return await qb;
  }

  //   remove duplicate
  private __remove_duplicate(array: any, key: string) {
    return [...new Map(array.map(item => [item[key], item])).values()];
  }
}
