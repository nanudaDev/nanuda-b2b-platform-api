import { BaseService, SPACE_TYPE } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { FounderConsult } from '../founder-consult/founder-consult.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { AdminDashboardCitySelectionDto } from './dto';
import { DeliveryFounderConsult } from '../delivery-founder-consult/delivery-founder-consult.entity';

export class Graph {
  labels: any;
  datasets: GraphData[];
}

export class GraphData {
  data: any;
  label: string;
  borderColor: string;
  backgroundColor?: string;
  fill?: boolean;
}

export class DashboardService extends BaseService {
  constructor(
    @InjectRepository(FounderConsult)
    private readonly founderConsultRepo: Repository<FounderConsult>,
    @InjectRepository(DeliveryFounderConsult)
    private readonly deliveryFounderConsultRepo: Repository<
      DeliveryFounderConsult
    >,
  ) {
    super();
  }

  /**
   * delivery founder consult graph
   * @param month
   */
  async deliveryDashboardGraph(month?: number): Promise<Graph> {
    const months = month | 6;
    const chartData = new Graph();
    // labels for months
    const labels = [];
    chartData.labels = labels;
    // dataset array
    const datasets = [];
    chartData.datasets = datasets;
    const deliveryFounderConsultModel = new GraphData();
    const data = [];
    deliveryFounderConsultModel.data = data;
    deliveryFounderConsultModel.label = '배달형 공간 방문자 신청';
    deliveryFounderConsultModel.borderColor = 'rgba(22, 161, 234, 0.57)';
    deliveryFounderConsultModel.fill = false;
    for (let i = 0; i < months; i++) {
      labels.unshift(
        moment()
          .subtract(`${i}`, 'months')
          .format('YYYY-MM'),
      );
    }
    let dataArray = [];
    await Promise.all(
      chartData.labels.map(async (date: string, i: number) => {
        const startDate = `${date}-01`;
        const endDate = moment(new Date(startDate))
          .add('1', 'months')
          .format('YYYY-MM-DD');
        const checking = await this.deliveryFounderConsultRepo
          .createQueryBuilder('deliveryConsult')
          .AndWhereBetweenStartAndEndDate(startDate, endDate)
          .getMany();
        dataArray.push({ index: i, check: checking.length });
      }),
    );
    dataArray = dataArray.sort((a, b) => (a.index > b.index ? 1 : -1));
    dataArray.map(dataCount => {
      data.push(dataCount.check);
    });
    datasets.push(deliveryFounderConsultModel);
    return chartData;
  }

  async dashboardGraph(month?: number): Promise<Graph> {
    const months = month || 6;
    const chartData = new Graph();
    // labels for months
    const labels = [];
    chartData.labels = labels;
    // dataset array
    const datasets = [];
    chartData.datasets = datasets;
    // data inside dataset
    const founderConsultModel = new GraphData();
    const data = [];
    founderConsultModel.data = data;
    founderConsultModel.label = '방문자 신청';
    founderConsultModel.borderColor = 'rgba(246, 128, 18, 0.57)';
    founderConsultModel.fill = false;
    for (let i = 0; i < months; i++) {
      labels.unshift(
        moment()
          .subtract(`${i}`, 'months')
          .format('YYYY-MM'),
      );
    }
    let dataArray = [];
    await Promise.all(
      chartData.labels.map(async (date: string, i: number) => {
        const startDate = `${date}-01`;
        const endDate = moment(new Date(startDate))
          .add('1', 'months')
          .format('YYYY-MM-DD');
        const checking = await this.founderConsultRepo
          .createQueryBuilder('founderConsult')
          .CustomInnerJoinAndSelect(['space'])
          .innerJoinAndSelect('space.spaceType', 'spaceType')
          .where('spaceType.no = :no', { no: SPACE_TYPE.SPACE_SHARE })
          .AndWhereBetweenStartAndEndDate(startDate, endDate)
          .getMany();
        dataArray.push({ index: i, check: checking.length });
      }),
    );
    // index up data count
    dataArray = dataArray.sort((a, b) => (a.index > b.index ? 1 : -1));
    dataArray.map(dataCount => {
      data.push(dataCount.check);
    });
    datasets.push(founderConsultModel);
    return chartData;
  }

  /**
   * for each month
   */
  async founderConsultGraphPerCity() {
    // const endDate = new Date();
    const chartData = new Graph();
    let labels = [];
    const datasets = [];
    chartData.datasets = datasets;
    const founderConsultModel = new GraphData();
    const data = [];
    founderConsultModel.data = data;
    founderConsultModel.label = '지역(시/도)별 방문 신청 추이';
    founderConsultModel.backgroundColor = 'rgba(246, 128, 18, 0.57)';
    let dataArray = [];
    labels = await this.getCities();
    await Promise.all(
      labels.map(async (label, i) => {
        const spaces = await this.founderConsultRepo
          .createQueryBuilder('founderConsult')
          .CustomInnerJoinAndSelect(['space'])
          .where('space.sido = :sido', { sido: label })
          .innerJoinAndSelect('space.spaceType', 'spaceType')
          .andWhere('spaceType.no = :no', { no: SPACE_TYPE.SPACE_SHARE })
          .getMany();
        console.log({ index: i, name: label });
        dataArray.push({ index: i, check: spaces.length });
      }),
    );
    dataArray = dataArray.sort((a, b) => (a.index > b.index ? 1 : -1));
    dataArray.map(dataCount => {
      data.push(dataCount.check);
    });
    chartData.labels = labels;
    datasets.push(founderConsultModel);

    return chartData;
  }

  /**
   * for each month
   */
  async founderConsultGraphPerCityForCompanyUser(companyNo: number) {
    // const endDate = new Date();
    const chartData = new Graph();
    let labels = [];
    const datasets = [];
    chartData.datasets = datasets;
    const founderConsultModel = new GraphData();
    const data = [];
    founderConsultModel.data = data;
    founderConsultModel.label = '지역(시/도)별 방문 신청 추이';
    founderConsultModel.backgroundColor = 'rgba(246, 128, 18, 0.57)';
    let dataArray = [];
    labels = await this.getCities();
    await Promise.all(
      labels.map(async (label, i) => {
        const spaces = await this.founderConsultRepo
          .createQueryBuilder('founderConsult')
          .CustomInnerJoinAndSelect(['space'])
          .innerJoinAndSelect('space.spaceType', 'spaceType')
          .where('spaceType.no = :no', { no: SPACE_TYPE.SPACE_SHARE })
          .leftJoinAndSelect('space.companyDistricts', 'compantDistricts')
          .leftJoinAndSelect('companyDistricts.company', 'company')
          .andWhere('space.sido = :sido', { sido: label })
          .andWhere('company.no = :companyNo', { no: companyNo })
          .getMany();
        dataArray.push({ index: i, check: spaces.length });
      }),
    );
    dataArray = dataArray.sort((a, b) => (a.index > b.index ? 1 : -1));
    dataArray.map(dataCount => {
      data.push(dataCount.check);
    });
    chartData.labels = labels;
    datasets.push(founderConsultModel);

    return chartData;
  }

  /**
   * select by cities
   * @param adminDashboardCitySelectionDto
   */
  async founderConsultGraphFilteredByCity(
    adminDashboardCitySelectionDto: AdminDashboardCitySelectionDto,
  ): Promise<Graph> {
    const chartData = new Graph();
    let labels = [];
    const datasets = [];
    chartData.datasets = datasets;
    const founderConsultModel = new GraphData();
    const data = [];
    founderConsultModel.data = data;
    founderConsultModel.label = '지역(시/도)별 방문 신청 추이';
    founderConsultModel.backgroundColor = 'rgba(246, 128, 18, 0.57)';
    let dataArray = [];
    labels = await this.getDistricts(adminDashboardCitySelectionDto.spaceCity);
    await Promise.all(
      labels.map(async (label, i) => {
        const spaces = await this.founderConsultRepo
          .createQueryBuilder('founderConsult')
          .CustomInnerJoinAndSelect(['space'])
          .leftJoinAndSelect('space.companyDistricts', 'companyDistricts')
          .leftJoinAndSelect('companyDistricts.company', 'company')
          .innerJoinAndSelect('space.spaceType', 'spaceType')
          .where('spaceType.no = :no', { no: SPACE_TYPE.SPACE_SHARE })
          .andWhere('space.sigungu = :sigungu', { sigungu: label })
          .getMany();
        dataArray.push({ index: i, check: spaces.length });
      }),
    );
    dataArray = dataArray.sort((a, b) => (a.index > b.index ? 1 : -1));
    dataArray.map(dataCount => {
      data.push(dataCount.check);
    });
    chartData.labels = labels;
    datasets.push(founderConsultModel);
    return chartData;
  }

  /**
   * get cities
   */
  async getCities() {
    const labels = [];
    const founderConsults = await this.founderConsultRepo
      .createQueryBuilder('founderConsult')
      .select('founderConsult.no')
      .innerJoin('founderConsult.space', 'space')
      .innerJoinAndSelect('space.spaceType', 'spaceType')
      .where('spaceType.no = :no', { no: SPACE_TYPE.SPACE_SHARE })
      .addSelect('space.sido')
      .getMany();
    founderConsults.map(founderConsult => {
      labels.push(founderConsult.space.sido);
    });
    return this.removeDuplicate(labels);
  }

  /**
   * get districts
   * @param spaceCity
   */
  async getDistricts(spaceCity: string) {
    const labels = [];
    const founderConsults = await this.founderConsultRepo
      .createQueryBuilder('founderConsult')
      .select('founderConsult.no')
      .innerJoin('founderConsult.space', 'space')
      .innerJoinAndSelect('space.spaceType', 'spaceType')
      .where('spaceType.no = :no', { no: SPACE_TYPE.SPACE_SHARE })
      .addSelect('space.sido')
      .addSelect('space.sigungu')
      .where('space.sido = :sido', {
        sido: spaceCity,
      })
      .getMany();
    founderConsults.map(founderConsult => {
      labels.push(founderConsult.space.sigungu);
    });
    return this.removeDuplicate(labels);
  }

  /**
   * company graph founder consult
   * @param companyNo
   */
  async companyDashboardGraph(
    companyNo: number,
    month?: number,
  ): Promise<Graph> {
    const months = month || 6;
    const chartData = new Graph();
    // labels for months
    const labels = [];
    chartData.labels = labels;
    // dataset array
    const datasets = [];
    chartData.datasets = datasets;
    // data inside dataset
    const founderConsultModel = new GraphData();
    const data = [];
    founderConsultModel.data = data;
    founderConsultModel.label = '방문자 신청';
    founderConsultModel.borderColor = '#F49D37';
    founderConsultModel.fill = false;
    for (let i = 0; i < months; i++) {
      labels.unshift(
        moment()
          .subtract(`${i}`, 'months')
          .format('YYYY-MM'),
      );
    }
    let dataArray = [];
    await Promise.all(
      chartData.labels.map(async (date: string, i: number) => {
        const startDate = `${date}-01`;
        const endDate = moment(new Date(startDate))
          .add('1', 'months')
          .format('YYYY-MM-DD');
        const checking = await this.founderConsultRepo
          .createQueryBuilder('founderConsult')
          .CustomInnerJoinAndSelect(['space'])
          .innerJoinAndSelect('space.companyDistricts', 'companyDistricts')
          .innerJoinAndSelect('companyDistricts.company', 'company')
          .where('company.no = :no', { no: companyNo })
          .AndWhereBetweenStartAndEndDate(startDate, endDate)
          .getMany();
        dataArray.push({ index: i, check: checking.length });
      }),
    );
    // index up data count
    dataArray = dataArray.sort((a, b) => (a.index > b.index ? 1 : -1));
    dataArray.map(dataCount => {
      data.push(dataCount.check);
    });
    datasets.push(founderConsultModel);
    return chartData;
  }

  private removeDuplicate(array: any) {
    return array.filter((a: string, b: string) => array.indexOf(a) === b);
  }
}
