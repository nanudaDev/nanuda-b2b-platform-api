require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { BaseService, APPROVAL_STATUS } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyDistrict } from './company-district.entity';
import { Repository } from 'typeorm';
import { CompanyDistrictListDto } from './dto';
import Axios from 'axios';
import { YN } from 'src/common';

export class SearchResults {
  lat: string;
  lon: string;
  cities?: CompanyDistrict[];
  regions?: CompanyDistrict[];
  districts?: CompanyDistrict[];
}

export class DropdownResults {
  no?: number;
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

    // "https://dapi.kakao.com/v2/local/search/keyword.json?y=37.514322572335935&x=127.06283102249932&radius=20000" \
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
    // TODO: typeorm subquery로 해결
    cities.map(city => {
      const filteredArray = city.deliverySpaces.filter(
        deliverySpace =>
          deliverySpace.showYn === YN.YES && deliverySpace.delYn === YN.NO,
      );
      city.deliverySpaceCount = filteredArray.length;
      delete city.deliverySpaces;
    });
    const filteredCities = cities.filter(city => city.deliverySpaceCount > 0);
    searchResults.cities = filteredCities;
    return searchResults;
  }

  /**
   * get center for map keyword
   * @param companyDistrictListDto
   */
  async getCenterForMap(companyDistrictListDto: CompanyDistrictListDto) {
    //     "https://dapi.kakao.com/v2/local/search/keyword.json?y=37.514322572335935&x=127.06283102249932&radius=20000" \
    // --data-urlencode "query=카카오프렌즈" \
    // -H "Authorization: KakaoAK {REST_API_KEY}"
    const searchResults = new SearchResults();
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
    return searchResults;
  }

  /**
   * get dropdown
   * @param companyDistrictListDto
   */
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
      .andWhere(
        'companyDistrict.region1DepthName like :keyword or companyDistrict.region2DepthName like :keyword or companyDistrict.region3DepthName like :keyword or companyDistrict.address like :keyword',
        {
          keyword: `%${companyDistrictListDto.keyword}%`,
        },
      )
      .select([
        'companyDistrict.no',
        'companyDistrict.region1DepthName',
        'companyDistrict.region2DepthName',
        'companyDistrict.region3DepthName',
      ])
      .getMany();
    const reduced: any = this.removeDuplicate(
      dropdownDistrict,
      'region2DepthName',
    );
    // reduce map
    reduced.map(reduce => {
      const top = new DropdownResults();
      top.no = reduce.no;
      top.name = `${reduce.region1DepthName} ${reduce.region2DepthName}`;
      top.district = true;
      topResults.push(top);
    });
    dropdownDistrict.map(district => {
      const second = new DropdownResults();
      second.no = district.no;
      second.name = `${district.region1DepthName} ${district.region2DepthName} ${district.region3DepthName}`;
      second.region = true;
      secondResults.push(second);
    });
    return { topResults, secondResults };
  }

  private removeDuplicate(array: any, key: string) {
    return [...new Map(array.map(item => [item[key], item])).values()];
  }
}
