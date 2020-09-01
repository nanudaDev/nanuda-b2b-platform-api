import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { CompanyDistrict } from './company-district.entity';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class CompanyDistrictAnalysisService extends BaseService {
  constructor(
    @InjectRepository(CompanyDistrict)
    private readonly spaceRepo: Repository<CompanyDistrict>,
    // analysis는 분석 데이터베이스 alias입니다. app.module.ts참조
    @InjectEntityManager('analysis')
    private readonly entityManager: EntityManager,
  ) {
    super();
  }
  // 1. 점포 주변의 평균 매출 현황을 볼 수 있습니다.
  //  점포 주변의 평균 연매출 현황을 볼 수 있습니다.
  async avgStoreSales(param) {
    const lat = param.lat;
    const lon = param.lon;
    const query = `(WITH cte AS (SELECT t5.kb_id, COUNT(DISTINCT t5.trans_dt) AS dt_count, SUM(t5.trans_amt) AS trans_amt \
      FROM (SELECT t1.kb_id, t1.trans_dt, SUM(t1.trans_amt)/t1.store_in_cluster AS trans_amt, ST_DISTANCE_SPHERE(ST_SRID(point(t1.lon, t1.lat),4326), t2.poc) AS distance \
      FROM wq.kb_trans_data_olap t1 \
      join (SELECT ST_SRID(point(longpoint, latpoint),4326) AS poc, latpoint-(r/units) AS lat_min, latpoint+(r/units) AS lat_max, longpoint-(r /(units * COS(RADIANS(latpoint)))) AS lon_min, longpoint+(r /(units * COS(RADIANS(latpoint)))) AS lon_max \
      FROM (SELECT ${lat} AS latpoint, ${lon} AS longpoint, 500 AS r, 111045 AS units) AS t3) AS t2 \
      ON (1=1) WHERE t1.lat BETWEEN lat_min AND lat_max AND t1.lon BETWEEN lon_min AND lon_max AND t1.storetype_cd \
      IN (2099, 2104, 2107, 2109, 2110, 2111, 2112, 2113, 2199) and t1.trans_dt >= (SELECT DATE_SUB(MAX(trans_dt), INTERVAL 6 MONTH) AS trans_dt \
      FROM wq.kb_trans_data) GROUP BY 1,2 having distance < 400) as t5 GROUP BY 1 ) SELECT avg(trans_amt/dt_count/3)/0.16 AS KB_AVG_AMT FROM cte) ;`;
    const results = await this.entityManager.query(query);
    return { return: results[0] };
  }

  async avgBizSales(param) {
    const lat = param.lat;
    const lon = param.lon;
    const query = `(WITH cte AS (SELECT t5.kb_id, storetype_nm, COUNT(DISTINCT t5.trans_dt) AS dt_count, SUM(t5.trans_amt) AS trans_amt \
    FROM (SELECT t1.kb_id, t1.trans_dt, t1.storetype_cd, SUM(t1.trans_amt)/t1.store_in_cluster AS trans_amt, ST_DISTANCE_SPHERE(ST_SRID(point(t1.lon, t1.lat),4326), t2.poc) AS distance \
    FROM wq.kb_trans_data_olap t1 \
    join (SELECT ST_SRID(point(longpoint, latpoint),4326) AS poc, latpoint-(r/units) AS lat_min, latpoint+(r/units) AS lat_max, longpoint-(r /(units * COS(RADIANS(latpoint)))) AS lon_min, longpoint+(r /(units * COS(RADIANS(latpoint)))) AS lon_max \
    FROM (SELECT ${lat} AS latpoint, ${lon} AS longpoint, 500 AS r, 111045 AS units) AS t3) AS t2 \
    ON (1=1) WHERE t1.lat BETWEEN lat_min AND lat_max AND t1.lon BETWEEN lon_min AND lon_max AND t1.storetype_cd \
    IN (2004, 2099, 2104, 2107, 2109, 2110, 2111, 2112, 2113, 2199) and t1.trans_dt >= (SELECT DATE_SUB(MAX(trans_dt), INTERVAL 6 MONTH) AS trans_dt \
    FROM wq.kb_trans_data) GROUP BY 1,2 having distance < 400) as t5 \
    LEFT JOIN wq.kb_storetype_code t6 ON t5.storetype_cd = t6.storetype_cd GROUP BY 1) SELECT storetype_nm AS KB_STORE_TYPE, avg(trans_amt/dt_count/3)/0.16 AS KB_AVG_AMT \
    FROM cte group by 1) ;`;

    const results = await this.entityManager.query(query);
    if (!results) {
      throw new BadRequestException();
    }
    return { result: results };
  }

  async ageGroupDis(param) {
    const lat = param.lat;
    const lon = param.lon;
    const query = `(WITH cte AS (SELECT t1.kb_id, t1.A10/t1.dates AS A10 , t1.A20/t1.dates AS A20, t1.A30/t1.dates AS A30, t1.A40/t1.dates AS A40, t1.A50/t1.dates AS A50, t1.A60/t1.dates AS A60, (t1.TOTAL-t1.AOT)/t1.dates AS TOTAL, ST_DISTANCE_SPHERE(ST_SRID(point(t1.lon, t1.lat),4326), t2.poc) AS distance \
    FROM wq.kb_trans_data_pivot t1 join (SELECT ST_SRID(point(longpoint, latpoint),4326) AS poc, latpoint-(r/units) AS lat_min, latpoint+(r/units) AS lat_max, longpoint-(r /(units *COS(RADIANS(latpoint)))) AS lon_min, longpoint+(r /(units *COS(RADIANS(latpoint)))) AS lon_max \
    FROM (SELECT ${lat} AS latpoint, ${lon} AS longpoint, 500 AS r, 111045 AS units) AS t3) AS t2 ON (1=1) WHERE t1.lat BETWEEN lat_min AND lat_max AND t1.lon \
    BETWEEN lon_min AND lon_max AND t1.storetype_cd \
    IN (2004, 2099, 2104, 2107, 2109, 2110, 2111, 2112, 2113, 2199) \
    GROUP BY 1 having distance < 400 order by distance asc) SELECT SUM(A10)/SUM(TOTAL) AS A10, SUM(A20)/SUM(TOTAL) AS A20, SUM(A30)/SUM(TOTAL) AS A30, SUM(A40)/SUM(TOTAL) AS A40, SUM(A50)/SUM(TOTAL) AS A50, SUM(A60)/SUM(TOTAL) AS A60 FROM cte) ;`;

    const results = await this.entityManager.query(query);
    return { result: results[0] };
  }

  async dayDistribution(param) {
    const lat = param.lat;
    const lon = param.lon;

    const query = `(WITH cte AS (SELECT t1.kb_id, t1.WD1/t1.dates AS SUN , t1.WD2/t1.dates AS MON, t1.WD3/t1.dates AS TUE, t1.WD4/t1.dates AS WED, t1.WD5/t1.dates AS THU, t1.WD6/t1.dates AS FRI, t1.WD7/t1.dates AS SAT, t1.TOTAL/t1.dates AS TOTAL, ST_DISTANCE_SPHERE(ST_SRID(point(t1.lon, t1.lat),4326), t2.poc) AS distance FROM wq.kb_trans_data_pivot t1 \
    join (SELECT ST_SRID(point(longpoint, latpoint),4326) AS poc, latpoint-(r/units) AS lat_min, latpoint+(r/units) AS lat_max, longpoint-(r /(units * COS(RADIANS(latpoint)))) AS lon_min, longpoint+(r /(units * COS(RADIANS(latpoint)))) AS lon_max \
    FROM (SELECT ${lat} AS latpoint, ${lon} AS longpoint, 500 AS r, 111045 AS units) AS t3) AS t2 \
    ON (1=1) WHERE t1.lat BETWEEN lat_min AND lat_max AND t1.lon BETWEEN lon_min AND lon_max AND t1.storetype_cd \
    IN (2004, 2099, 2104, 2107, 2109, 2110, 2111, 2112, 2113, 2199) \
    GROUP BY 1 having distance < 400 order by distance asc) SELECT SUM(MON)/SUM(TOTAL) AS MON, SUM(TUE)/SUM(TOTAL) AS TUE, SUM(WED)/SUM(TOTAL) AS WED, SUM(THU)/SUM(TOTAL) AS THU, SUM(FRI)/SUM(TOTAL) AS FRI, SUM(SAT)/SUM(TOTAL) AS SAT, SUM(SUN)/SUM(TOTAL) AS SUN FROM cte) ;`;

    const results = await this.entityManager.query(query);

    return { result: results[0] };
  }

  async genderDistribution(param) {
    const lat = param.lat;
    const lon = param.lon;

    const query = `(WITH cte AS (SELECT t1.kb_id, t1.M/t1.dates AS M , t1.FM/t1.dates AS FM, t1.BZ/t1.dates AS BZ, t1.TOTAL/t1.dates AS TOTAL, ST_DISTANCE_SPHERE(ST_SRID(point(t1.lon, t1.lat),4326), t2.poc) AS distance \
    FROM wq.kb_trans_data_pivot t1 \
    join (SELECT ST_SRID(point(longpoint, latpoint),4326) AS poc, latpoint-(r/units) AS lat_min, latpoint+(r/units) AS lat_max, longpoint-(r /(units *COS(RADIANS(latpoint)))) AS lon_min, longpoint+(r /(units *COS(RADIANS(latpoint)))) AS lon_max \
    FROM (SELECT ${lat} AS latpoint, ${lon} AS longpoint, 500 AS r, 111045 AS units) AS t3) AS t2 \
    ON (1=1) WHERE t1.lat BETWEEN lat_min AND lat_max AND t1.lon \
    BETWEEN lon_min AND lon_max AND t1.storetype_cd \
    IN (2004, 2099, 2104, 2107, 2109, 2110, 2111, 2112, 2113, 2199) GROUP BY 1 having distance < 400 order by distance asc) SELECT SUM(M)/SUM(M + FM) AS M, SUM(FM)/SUM(M + FM) AS FM FROM cte) ;`;

    const results = await this.entityManager.query(query);

    return { result: results[0] };
  }

  async employeeRatio(param) {
    const lat = param.lat;
    const lon = param.lon;

    const query = `(WITH cte AS ((SELECT t1.pk_id, t1.jnngp_cnt, t1.crrmm_ntc_amt, ST_DISTANCE_SPHERE(ST_SRID(point(t1.lon, t1.lat),4326), t2.poc) AS distance \
    FROM wq.nps_data t1 \
    JOIN (SELECT ST_SRID(point(longpoint, latpoint),4326) AS poc, latpoint-(r/units) AS lat_min, latpoint+(r/units) AS lat_max, longpoint-(r /(units * COS(RADIANS(latpoint)))) AS lon_min, longpoint+(r /(units * COS(RADIANS(latpoint)))) AS lon_max \
    FROM (SELECT ${lat} AS latpoint, ${lon} AS longpoint, 500 AS r, 111045 AS units) AS t3) AS t2 \
    ON (1=1) WHERE t1.lat BETWEEN lat_min AND lat_max AND t1.lon BETWEEN lon_min AND lon_max AND t1.biz_status = 1 AND t1.data_crt_ym \
    IN (SELECT MAX(data_crt_ym) AS data_crt_ym FROM wq.nps_data) having distance < 400) UNION ALL (SELECT t1.pk_id, t1.jnngp_cnt, t1.crrmm_ntc_amt, 400 as distance \
    FROM wq.nps_data t1 \
    WHERE '매장 주소' LIKE CONCAT(t1.WKPL_LTNO_DTL_ADDR,'%') AND '매장 도로명 주소' LIKE CONCAT(t1.WKPL_ROAD_NM_DTL_ADDR,'%') AND t1.lat is null and t1.lon is null AND t1.biz_status = 1 AND t1.data_crt_ym \
    IN (SELECT MAX(data_crt_ym) AS data_crt_ym FROM wq.nps_data))) SELECT COUNT(pk_id) AS NPS_CO_COUNT, SUM(jnngp_cnt) AS NPS_EMP, AVG(crrmm_ntc_amt/jnngp_cnt) AS NPS_CO_AVG_WAGE FROM cte) ;`;

    const results = await this.entityManager.query(query);
    return { result: results[0] };
  }
}
