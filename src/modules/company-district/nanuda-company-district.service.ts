require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { BaseService, APPROVAL_STATUS } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyDistrict } from './company-district.entity';
import { Repository } from 'typeorm';
import { CompanyDistrictListDto, NanudaCompanyDistrictSearchDto } from './dto';
import Axios from 'axios';
import { YN } from 'src/common';
import { Space } from '../space/space.entity';

export class SearchResults {
  lat: string;
  lon: string;
  cities?: CompanyDistrict[] | Space[];
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
   * @param nanudaCompanyDistrictSearchDto
   */
  async search(
    companyDistrictSearchDto: CompanyDistrictListDto,
    nanudaCompanyDistrictSearchDto: NanudaCompanyDistrictSearchDto,
  ): Promise<SearchResults> {
    console.log(nanudaCompanyDistrictSearchDto);
    const searchResults = new SearchResults();

    // "https://dapi.kakao.com/v2/local/search/keyword.json?y=37.514322572335935&x=127.06283102249932&radius=20000" \
    // --data-urlencode "query=카카오프렌즈" \
    // -H "Authorization: KakaoAK {REST_API_KEY}"
    if (companyDistrictSearchDto.keyword) {
      let latLon = await Axios.get(
        'https://dapi.kakao.com/v2/local/search/address.json',
        {
          params: { query: companyDistrictSearchDto.keyword },
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
            params: { query: companyDistrictSearchDto.keyword },
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
    let qb = this.companyDistrictRepo
      .createQueryBuilder('companyDistrict')
      .CustomInnerJoinAndSelect(['company', 'deliverySpaces'])
      .leftJoinAndSelect('deliverySpaces.contracts', 'contracts')
      .innerJoinAndSelect('deliverySpaces.amenities', 'amenities')
      // .leftJoinAndSelect('deliverySpaces.brands', 'brands')
      // .leftJoinAndSelect(
      //   'deliverySpaces.deliverySpaceOptions',
      //   'deliverySpaceOptions',
      // )
      .where('companyDistrict.companyDistrictStatus = :companyDistrictStatus', {
        companyDistrictStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere('company.companyStatus =:companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere('deliverySpaces.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpaces.delYn = :delYn', { delYn: YN.NO })
      .andWhere('deliverySpaces.quantity > 0')
      .andWhere('deliverySpaces.remainingCount > 0')
      // removed excludedDto
      .AndWhereIn('amenities', 'no', nanudaCompanyDistrictSearchDto.amenityIds)
      // .AndWhereIn('brands', 'no', nanudaCompanyDistrictSearchDto.brandIds)
      // .AndWhereIn(
      //   'deliverySpaceOptions',
      //   'no',
      //   nanudaCompanyDistrictSearchDto.deliverySpaceOptionIds,
      // )
      .groupBy('companyDistrict.no');
    if (
      nanudaCompanyDistrictSearchDto.amenityIds &&
      nanudaCompanyDistrictSearchDto.amenityIds.length > 0
    ) {
      qb.having(
        `COUNT(DISTINCT amenities.no) = ${nanudaCompanyDistrictSearchDto.amenityIds.length}`,
      );
    }
    const cities = await qb.getMany();
    // TODO: typeorm subquery로 해결
    // cities.map(city => {
    //   city.deliverySpaces.map(deliverySpace => {
    //     const remaining =
    //       deliverySpace.quantity - deliverySpace.contracts.length;
    //     if (remaining === 0) {
    //       const index = city.deliverySpaces.indexOf(deliverySpace);
    //       city.deliverySpaces.splice(index, 1);
    //     }
    //   });
    // });
    searchResults.cities = cities;
    searchResults.cities.map(city => {
      if (city.deliverySpaces.length < 1) {
        delete city.deliverySpaces;
      }
      if (!city.deliverySpaces) {
        const index = cities.indexOf(city);
        cities.splice(index, 1);
      }
    });

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
   * TODO: Limit by 5
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
      .CustomInnerJoinAndSelect(['company', 'deliverySpaces'])
      .where('companyDistrict.companyDistrictStatus = :companyDistrictStatus', {
        companyDistrictStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere('company.companyStatus =:companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere('deliverySpaces.delYn = :delYn', { delYn: YN.NO })
      .andWhere('deliverySpaces.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpaces.remainingCount > 0')
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
    const reduced: any = this.__remove_duplicate(
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

  async companyDistrictDown2(companyDistrictListDto: CompanyDistrictListDto) {
    const topResults: DropdownResults[] = [];
    const secondResults: DropdownResults[] = [];
    const thirdResulsts: DropdownResults[] = [];
    const first = await this.companyDistrictRepo
      .createQueryBuilder('companyDistrict')
      .CustomInnerJoinAndSelect(['deliverySpaces'])
      .where('companyDistrict.companyDistrictStatus = :companyDistrictStatus', {
        companyDistrictStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere('deliverySpaces.delYn = :delYn', { delYn: YN.NO })
      .andWhere('deliverySpaces.showYn = :showYn', { showYn: YN.YES })
      // .andWhere(
      //   'companyDistrict.region1DepthName like :keyword or companyDistrict.region2DepthName like :keyword or companyDistrict.region3DepthName like :keyword or companyDistrict.address like :keyword',
      //   {
      //     keyword: `%${companyDistrictListDto.keyword}%`,
      //   },
      // )
      .AndWhereLike(
        'companyDistrict',
        'region1DepthName',
        companyDistrictListDto.keyword,
      )
      .select(['companyDistrict.no', 'companyDistrict.region1DepthName'])
      .getMany();

    const firstReduced: any = this.__remove_duplicate(
      first,
      'region1DepthName',
    );
    firstReduced.map(reduce => {
      const top = new DropdownResults();
      top.no = reduce.no;
      top.name = reduce.region1DepthName;
      topResults.push(top);
    });

    const second = await this.companyDistrictRepo
      .createQueryBuilder('companyDistrict')
      .CustomInnerJoinAndSelect(['deliverySpaces'])
      .where('companyDistrict.companyDistrictStatus = :companyDistrictStatus', {
        companyDistrictStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere('deliverySpaces.delYn = :delYn', { delYn: YN.NO })
      .andWhere('deliverySpaces.showYn = :showYn', { showYn: YN.YES })
      // .andWhere(
      //   'companyDistrict.region1DepthName like :keyword or companyDistrict.region2DepthName like :keyword or companyDistrict.region3DepthName like :keyword or companyDistrict.address like :keyword',
      //   {
      //     keyword: `%${companyDistrictListDto.keyword}%`,
      //   },
      // )
      .AndWhereLike(
        'companyDistrict',
        'region2DepthName',
        companyDistrictListDto.keyword,
      )
      .select([
        'companyDistrict.no',
        'companyDistrict.region1DepthName',
        'companyDistrict.region2DepthName',
      ])
      .getMany();

    const secondReduced: any = this.__remove_duplicate(
      second,
      'region2DepthName',
    );

    secondReduced.map(reduce => {
      const top = new DropdownResults();
      top.no = reduce.no;
      top.name = `${reduce.region1DepthName} ${reduce.region2DepthName}`;
      secondResults.push(top);
    });

    const third = await this.companyDistrictRepo
      .createQueryBuilder('companyDistrict')
      .CustomInnerJoinAndSelect(['deliverySpaces'])
      .where('companyDistrict.companyDistrictStatus = :companyDistrictStatus', {
        companyDistrictStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere('deliverySpaces.delYn = :delYn', { delYn: YN.NO })
      .andWhere('deliverySpaces.showYn = :showYn', { showYn: YN.YES })
      .AndWhereLike(
        'companyDistrict',
        'region3DepthName',
        companyDistrictListDto.keyword,
      )
      .select([
        'companyDistrict.no',
        'companyDistrict.region1DepthName',
        'companyDistrict.region2DepthName',
        'companyDistrict.region3DepthName',
      ])
      .getMany();

    const thirdReduced: any = this.__remove_duplicate(
      third,
      'region3DepthName',
    );

    thirdReduced.map(reduce => {
      const top = new DropdownResults();
      top.no = reduce.no;
      top.name = `${reduce.region1DepthName} ${reduce.region2DepthName} ${reduce.region3DepthName}`;
      thirdResulsts.push(top);
    });

    return [...topResults, ...secondResults, ...thirdResulsts];
  }

  /**
   * find available districts
   */
  async findAllAvailableDistricts(): Promise<CompanyDistrict[]> {
    const qb = await this.companyDistrictRepo
      .createQueryBuilder('companyDistrict')
      // .CustomInnerJoinAndSelect(['company'])
      .innerJoin('companyDistrict.deliverySpaces', 'deliverySpaces')
      .innerJoin('companyDistrict.company', 'company')
      .where('companyDistrict.companyDistrictStatus = :companyDistrictStatus', {
        companyDistrictStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere('deliverySpaces.delYn = :delYn', { delYn: YN.NO })
      .andWhere('deliverySpaces.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpaces.remainingCount > 0')
      .select([
        'companyDistrict.no',
        'companyDistrict.region1DepthName',
        'companyDistrict.region2DepthName',
        'companyDistrict.region3DepthName',
      ])
      .getMany();

    return qb;
  }

  private __remove_duplicate(array: any, key: string) {
    return [...new Map(array.map(item => [item[key], item])).values()];
  }
}
