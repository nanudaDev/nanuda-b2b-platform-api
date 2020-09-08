import { BaseService, SPACE_TYPE } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { FounderConsult } from '../founder-consult/founder-consult.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { AdminDashboardCitySelectionDto } from './dto';
import { DeliveryFounderConsult } from '../delivery-founder-consult/delivery-founder-consult.entity';
import { PaymentList } from '../payment-list/payment-list.entity';

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
    @InjectRepository(PaymentList, 'kitchen')
    private readonly paymentListRepo: Repository<PaymentList>,
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

  // payment list graph

  /**
   * payment list graph data
   * @param numberOfDays
   */
  async paymentListGraph(numberOfDays?: number) {
    const days = numberOfDays | 10;
    const query = `SELECT (SELECT NANUDA_NAME FROM NANUDA_KITCHEN_MASTER WHERE NANUDA_NO = A.NANUDA_NO) AS NANUDA_NAME, DATE_FORMAT(PAYMENT_TIME,'%Y-%m-%d') AS DATE_VAL, SUM(TOTAL_AMOUNT) AS SALES FROM PAYMENT_LIST A WHERE CARD_CANCEL_FL = 'N' AND APPROVAL_NO != 'undefined' AND DATE_FORMAT(PAYMENT_TIME,'%Y-%m-%d') BETWEEN DATE_FORMAT(DATE_SUB(now(), INTERVAL ${days} DAY),'%Y-%m-%d') AND DATE_FORMAT(now(),'%Y-%m-%d') GROUP BY LEFT(DATE_VAL,10), A.NANUDA_NO ORDER BY A.NANUDA_NO, DATE_VAL`;
    const chartData = new Graph();
    // labels for months
    const labels: any = [];
    const shopName: any = [];
    chartData.labels = labels;
    // dataset array
    const datasets: any = [];
    chartData.datasets = datasets;
    const graphData = await this.paymentListRepo.manager.query(query);
    graphData.map((data, i) => {
      if (!labels.includes(data.DATE_VAL)) {
        labels.push(data.DATE_VAL);
      }
      // push the name of the dates into labels
      if (!shopName.includes(data.NANUDA_NAME)) {
        shopName.push(data.NANUDA_NAME);
      }
    });
    let grouped = graphData.reduce((r, a) => {
      r[a.NANUDA_NAME] = [...(r[a.NANUDA_NAME] || []), a.DATE_VAL];
      return r;
    }, {});
    shopName.map(names => {
      labels.map(date => {
        if (!grouped[names].includes(date)) {
          graphData.push({
            NANUDA_NAME: names,
            SALES: 0,
            DATE_VAL: date,
          });
        }
      });
    });
    // create real dates
    graphData.map(data => {
      const date = data.DATE_VAL;
      const parts = date.split('-');
      const newDate = new Date(parts[0], parts[1] - 1, parts[2]);
      data.NEW_DATE = newDate;
    });

    graphData.sort((a, b) => a.NEW_DATE - b.NEW_DATE);

    graphData.map((data, i) => {
      let dataset: any = {};
      dataset.label = data.NANUDA_NAME;
      dataset.backgroundColor = `#${((Math.random() * 0xffffff) << 0).toString(
        16,
      )}`;
      dataset.data = [];
      graphData.map((revenue, i) => {
        if (revenue.NANUDA_NAME === data.NANUDA_NAME) {
          dataset.data.splice(i, 0, revenue.SALES);
        }
      });
      chartData.datasets.splice(i, 0, dataset);
    });
    // remove duplicate objects from mapping
    const uniqueData = Array.from(
      new Set(
        chartData.datasets
          .map(data => data.label)
          .map(label => {
            return chartData.datasets.find(data => data.label === label);
          }),
      ),
    );
    chartData.datasets = uniqueData;
    chartData.labels = labels;
    return chartData;
  }

  private removeDuplicate(array: any) {
    return array.filter((a: string, b: string) => array.indexOf(a) === b);
  }
}
