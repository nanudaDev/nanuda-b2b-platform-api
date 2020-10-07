require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import Axios from 'axios';
import { PaginatedRequest, PaginatedResponse, YN } from 'src/common';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import {
  DropdownResults,
  SearchResults,
} from '../company-district/nanuda-company-district.service';
import { SpaceListDto } from './dto';
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
      .andWhere('space.showYn = :delYn', { showYn: YN.YES })
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
      top.name = `${reduce.sido}`;
      top.district = true;
      topResults.push(top);
    });
    const reduced2: any = this.__remove_duplicate(dropdownSpace, 'sigungu');
    reduced2.map(space => {
      const second = new DropdownResults();
      second.no = space.no;
      second.name = `${space.sido} ${space.sigungu}`;
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

  //   remove duplicate
  private __remove_duplicate(array: any, key: string) {
    return [...new Map(array.map(item => [item[key], item])).values()];
  }
}
