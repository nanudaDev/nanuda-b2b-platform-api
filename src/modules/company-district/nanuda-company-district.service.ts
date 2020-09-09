require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { BaseService, APPROVAL_STATUS } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyDistrict } from './company-district.entity';
import { Repository } from 'typeorm';
import { CompanyDistrictListDto } from './dto';
import Axios from 'axios';

export class SearchResults {
  lat: string;
  lon: string;
  cities?: CompanyDistrict[];
  regions?: CompanyDistrict[];
  districts?: CompanyDistrict[];
}

export class DropdownResults {
  district?: boolean;
  region?: boolean;
  name?: string;
}

@Injectable()
export class NanudaCompanyDistrictService extends BaseService {
  constructor(
    @InjectRepository(CompanyDistrict)
    private readonly companyDistrictRepo: Repository<CompanyDistrict>,
  ) {
    super();
  }

  /**
   * search
   * @param companyDistrictListDto
   */
  async search(
    companyDistrictListDto: CompanyDistrictListDto,
  ): Promise<SearchResults> {
    const searchResults = new SearchResults();

    //     "https://dapi.kakao.com/v2/local/search/keyword.json?y=37.514322572335935&x=127.06283102249932&radius=20000" \
    // --data-urlencode "query=카카오프렌즈" \
    // -H "Authorization: KakaoAK {REST_API_KEY}"
    if (companyDistrictListDto.keyword) {
      let latLon = await Axios.get(
        'https://dapi.kakao.com/v2/local/search/address.json',
        {
          params: { query: companyDistrictListDto.keyword },
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
            params: { query: companyDistrictListDto.keyword },
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
    const cities = await this.companyDistrictRepo
      .createQueryBuilder('companyDistrict')
      .CustomInnerJoinAndSelect(['deliverySpaces'])
      .where('companyDistrict.companyDistrictStatus = :companyDistrictStatus', {
        companyDistrictStatus: APPROVAL_STATUS.APPROVAL,
      })
      // .limit(2)
      .select([
        'companyDistrict.no',
        'companyDistrict.region1DepthName',
        'companyDistrict.address',
        'companyDistrict.nameKr',
        'companyDistrict.lat',
        'companyDistrict.lon',
        'deliverySpaces',
      ])
      .getMany();
    cities.map(city => {
      city.deliverySpaceCount = city.deliverySpaces.length;
      delete city.deliverySpaces;
    });
    searchResults.cities = cities;
    return searchResults;
  }

  async companyDistrictDropDown(
    companyDistrictListDto: CompanyDistrictListDto,
  ) {
    const topResults: DropdownResults[] = [];
    const secondResults: DropdownResults[] = [];
    const dropdownDistrict = await this.companyDistrictRepo
      .createQueryBuilder('companyDistrict')
      .CustomInnerJoinAndSelect(['deliverySpaces'])
      .where('companyDistrict.companyDistrictStatus = :companyDistrictStatus', {
        companyDistrictStatus: APPROVAL_STATUS.APPROVAL,
      })
      .AndWhereLike(
        'companyDistrict',
        'region2DepthName',
        companyDistrictListDto.keyword,
      )
      .select([
        'companyDistrict.region2DepthName',
        'companyDistrict.region3DepthName',
      ])
      .getMany();
    const reduced: any = this.removeDuplicate(
      dropdownDistrict,
      'region2DepthName',
    );
    reduced.map(reduce => {
      const top = new DropdownResults();
      top.name = reduce.region2DepthName;
      top.district = true;
      topResults.push(top);
      const drop = new DropdownResults();
      drop.name = `${reduce.region2DepthName} ${reduce.region3DepthName}`;
      drop.region = true;
      secondResults.push(drop);
    });
    return { topResults, secondResults };
  }

  private removeDuplicate(array: any, key: string) {
    return [...new Map(array.map(item => [item[key], item])).values()];
  }
}
