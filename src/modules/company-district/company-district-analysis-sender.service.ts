import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyDistrict } from './company-district.entity';
import { Repository } from 'typeorm';
import { CompanyDistrictAnalysisService } from './company-district-analysis.service';
import { YN } from 'src/common';

@Injectable()
export class CompanyDistrictAnalysisSenderService extends BaseService {
  constructor(
    @InjectRepository(CompanyDistrict)
    private readonly companyDistrictRepo: Repository<CompanyDistrict>,
    private readonly companyDistrictAnalysisService: CompanyDistrictAnalysisService,
  ) {
    super();
  }

  async setVicinityAnalysis(districtNo: number, lat: string, lon: string) {
    console.log(districtNo);
    const param = { lat: parseFloat(lat), lon: parseFloat(lon) };
    const start = new Date().getTime();
    console.log(`Started: ${start}`);
    const result = await Promise.all([
      await this.companyDistrictAnalysisService.avgStoreSales(param),
      await this.companyDistrictAnalysisService.avgBizSales(param),
      await this.companyDistrictAnalysisService.employeeRatio(param),
      await this.companyDistrictAnalysisService.ageGroupDis(param),
      await this.companyDistrictAnalysisService.dayDistribution(param),
      await this.companyDistrictAnalysisService.genderDistribution(param),
    ]);

    const sendResult = {
      avgStoreSales: result[0], // 점포 주변의 평균 매출 현황
      avgYearStoreSales: result[0], // 점포 주변의 평균 연매출 현황을 볼 수 있습니다
      avgBizConSales: result[1], // 점포 주변의 업종(업태)별 월 평균 매출 현황
      employeeRatio: result[2], // 점포 주변의 직장인구, 비율
      ageGroupDis: result[3], // 연령대별 고객 분포를 볼 수 있으며 가장 높은 연령대를 표시
      dayDistribution: result[4], // 요일별 매출 분포를 볼 수 있으며 가장 높은 요일을 표시
      genderDistribution: this.__set_adjust_ratio(result[5]), // 성별 고객 분포를 볼 수 있으며 가장 높은 성별을 표시
      location: { lat, lon },
    };

    const district = await this.companyDistrictRepo.findOne({
      where: { no: districtNo },
    });
    if (!district) {
      throw new NotFoundException();
    }
    await this.companyDistrictRepo
      .createQueryBuilder()
      .update(CompanyDistrict)
      .set({ vicinityInfo: sendResult })
      .where('no = :no', { no: districtNo })
      .execute();
  }

  private __set_adjust_ratio(data) {
    if (data.hasOwnProperty('M') && data.hasOwnProperty('FM')) {
      const mRatio = parseFloat(data.M);
      const fmRatio = parseFloat(data.FM);
      if (!isNaN(mRatio) && !isNaN(fmRatio)) {
        const total = mRatio + fmRatio;
        data.FM = total > 1 ? String(1 - total + fmRatio) : String(fmRatio);
      }
    }
    return data;
  }
}
