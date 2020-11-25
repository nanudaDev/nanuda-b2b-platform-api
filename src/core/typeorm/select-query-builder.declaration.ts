/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaginatedRequest } from '../../common';
// import { classToClass } from 'class-transformer';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

/**
 * 참고)
 * https://medium.com/@ayushpratap2494/add-custom-methods-to-typeorm-query-builder-12e9030613c6
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 */

const ORDER_BY_PREFIX = 'orderBy';
const ALIAS_DELIMETER = '___';

const _util = {
  getOrderByProperty(value: string): string {
    if (!value) {
      throw new Error('orderKey value not found.');
    }
    // ex) value = orderByNo => No
    value = value.replace(ORDER_BY_PREFIX, '');
    value = _util.firstLetterToLowerCase(value);
    return value;
  },
  firstLetterToLowerCase(value: string): string {
    if (!value) {
      return value;
    }
    value = value.substring(0, 1).toLowerCase() + value.substring(1);
    return value;
  },
  // 대소문자 구분없이 조인 테이블 별칭을 사용할 수 있으므로 실제 별칭을 찾아 매핑한다.
  joinAliasMapper(joinTableAliases: string[], alias: string): string {
    joinTableAliases.some(joinTableAlias => {
      const regExp = new RegExp(joinTableAlias, 'i');
      if (alias.match(regExp)) {
        alias = joinTableAlias;
        return true; // iterate 종료
      }
      return false;
    });
    return alias;
  },
};

// Declaration Merging Of Module.
declare module 'typeorm/query-builder/SelectQueryBuilder' {
  interface SelectQueryBuilder<Entity> {
    /**
     * started, ended 날짜 검색
     */
    AddDateRange(
      this: SelectQueryBuilder<Entity>,
      START_DATE,
      END_DATE,
    ): SelectQueryBuilder<Entity>;

    /**
     * IN
     */
    IN(
      this: SelectQueryBuilder<Entity>,
      columnName,
      values,
    ): SelectQueryBuilder<Entity>;
    /**
     * IsDisplay
     */
    IsDisplay(
      this: SelectQueryBuilder<Entity>,
      isDisplay,
    ): SelectQueryBuilder<Entity>;
    /**
     * AndWhereLike, WhereAndOrder 등의 커스텀 메소드 보다 앞에 사용해야한다.
     */
    CustomInnerJoinAndSelect(
      this: SelectQueryBuilder<Entity>,
      RELATIONS: string[],
    ): SelectQueryBuilder<Entity>;
    /**
     * AndWhereLike, WhereAndOrder 등의 커스텀 메소드 보다 앞에 사용해야한다.
     */
    CustomLeftJoinAndSelect(
      this: SelectQueryBuilder<Entity>,
      RELATIONS: string[],
    ): SelectQueryBuilder<Entity>;
    /**
     * WhereAndOrder 보다 앞에 사용해야한다.
     *
     * excludedRequestDto 는 WhereAndOrder 에서 사용되지않도록 컬럼을 제거하는 용도로 사용한다.
     */
    AndWhereEqual(
      this: SelectQueryBuilder<Entity>,
      alias: string,
      property: string,
      value: any,
      excludedRequestDto: any,
    ): SelectQueryBuilder<Entity>;

    /**
     * WhereAndOrder 보다 앞에 사용해야한다.
     *
     * excludedRequestDto 는 WhereAndOrder 에서 사용되지않도록 컬럼을 제거하는 용도로 사용한다.
     */
    AndWhereLike(
      this: SelectQueryBuilder<Entity>,
      alias: string,
      property: string,
      value: string,
      excludedRequestDto?: any,
    ): SelectQueryBuilder<Entity>;
    /**
     * WhereAndOrder 보다 앞에 사용해야한다.
     *
     * excludedRequestDto 는 WhereAndOrder 에서 사용되지않도록 컬럼을 제거하는 용도로 사용한다.
     */
    AndWhereIn(
      this: SelectQueryBuilder<Entity>,
      alias: string,
      property: string,
      values: any[],
      excludedRequestDto?: any,
    ): SelectQueryBuilder<Entity>;

    AndWhereMatchInIds(
      this: SelectQueryBuilder<Entity>,
      alias: string,
      property: string,
      values: any[],
      excludedRequestDto?: any,
    ): SelectQueryBuilder<Entity>;
    /**
     * between current started, ended
     */
    AndWhereBetweenDate(
      this: SelectQueryBuilder<Entity>,
      date: Date,
    ): SelectQueryBuilder<Entity>;
    /**
     * 시작 날짜랑 마지막 날짜 정한다.
     */
    AndWhereBetweenStartAndEndDate(
      this: SelectQueryBuilder<Entity>,
      START_DATE: Date | string,
      END_DATE: Date | string,
      excludedRequestDto?: any,
      excludedRequestDto2?: any,
    ): SelectQueryBuilder<Entity>;
    /*
     * Between months for founder graph
     */
    AndWhereBetweenOpenedAt(
      this: SelectQueryBuilder<Entity>,
      START_DATE: Date | string,
      END_DATE: Date | string,
      excludedRequestDto?: any,
      excludedRequestDto2?: any,
    ): SelectQueryBuilder<Entity>;
    /*
     * Between opened at dates for founder consult
     */
    AndWhereBetweenStartDaysAndEndDays(
      this: SelectQueryBuilder<Entity>,
      START_DAY: Date | string,
      END_DATE: Date | string,
    ): SelectQueryBuilder<Entity>;
    /**
     * graph between start day and end day
     * @param this
     * @param START_DATE
     * @param END_DATE
     */
    AndWhereWithinMonth(
      this: SelectQueryBuilder<Entity>,
      START_DATE: Date | string,
      END_DATE: Date | string,
    ): SelectQueryBuilder<Entity>;

    /**
     * Where or Like
     */
    AndWhereOrLike(
      this: SelectQueryBuilder<Entity>,
      property: string,
      value: string,
    ): SelectQueryBuilder<Entity>;
    /**
     * AndWhereLike 등 보다 뒤에 사용해야한다
     * @param this
     * @param excludedRequestDto
     */
    WhereAndOrder(
      this: SelectQueryBuilder<Entity>,
      excludedRequestDto,
    ): SelectQueryBuilder<Entity>;

    /**
     * skip, take 를 이용한 페이징 처리
     */
    Paginate(
      this: SelectQueryBuilder<Entity>,
      pagination: PaginatedRequest,
    ): SelectQueryBuilder<Entity>;

    /**
     * find next
     * @param this
     * @param no
     */
    AndWhereNext(
      this: SelectQueryBuilder<Entity>,
      no: number,
    ): SelectQueryBuilder<Entity>;

    /**
     * find previous
     * @param this
     * @param no
     */
    AndWherePrevious(
      this: SelectQueryBuilder<Entity>,
      no: number,
    ): SelectQueryBuilder<Entity>;

    /**
     * less than certain number
     * @param this
     * @param alias
     * @param property
     * @param value
     * @param excludedRequestDto
     */
    AndWhereLessThan(
      this: SelectQueryBuilder<Entity>,
      alias: string,
      property: string,
      value?: any,
      excludedRequestDto?: any,
    ): SelectQueryBuilder<Entity>;
  }
}

// Get Date Range Selection (Add Where Conditions).
SelectQueryBuilder.prototype.AddDateRange = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  START_DATE: Date,
  END_DATE: Date,
): SelectQueryBuilder<Entity> {
  if (START_DATE && END_DATE) {
    this.andWhere(
      `${this.alias}.started >= :START_DATE AND ${this.alias}.ended <= :END_DATE`,
      {
        START_DATE,
        END_DATE,
      },
    );
  }
  return this;
};

SelectQueryBuilder.prototype.AndWhereBetweenDate = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  DATE?: Date,
): SelectQueryBuilder<Entity> {
  if (DATE) {
    this.andWhere(
      `${this.alias}.started <= :DATE AND ${this.alias}.ended >= :DATE`,
      { DATE },
    );
  }
  return this;
};

SelectQueryBuilder.prototype.AndWhereBetweenStartAndEndDate = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  START_DATE?: Date | string,
  END_DATE?: Date | string,
): SelectQueryBuilder<Entity> {
  if (START_DATE && END_DATE) {
    this.andWhere(
      `${this.alias}.createdAt BETWEEN DATE(:START_DATE) AND DATE(:END_DATE)`,
      {
        START_DATE,
        END_DATE,
      },
    );
  }
  if (!START_DATE && END_DATE) {
    this.andWhere(`${this.alias}.createdAt < DATE(:END_DATE)`, {
      END_DATE,
    });
  }
  if (START_DATE && !END_DATE) {
    this.andWhere(`${this.alias}.createdAt > DATE(:START_DATE)`, {
      START_DATE,
    });
  }
  return this;
};

SelectQueryBuilder.prototype.AndWhereBetweenOpenedAt = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  START_DATE?: Date | string,
  END_DATE?: Date | string,
): SelectQueryBuilder<Entity> {
  if (START_DATE && END_DATE) {
    this.andWhere(
      `${this.alias}.openedAt BETWEEN DATE(:START_DATE) AND DATE(:END_DATE)`,
      {
        START_DATE,
        END_DATE,
      },
    );
  }
  if (START_DATE && !END_DATE) {
    this.andWhere(`${this.alias}.openedAt >= DATE(:START_DATE)`, {
      START_DATE,
    });
  }
  return this;
};

/**
 * TODO: WHERE OR LIKE
 */
SelectQueryBuilder.prototype.AndWhereOrLike = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  property: string,
  value: string,
): SelectQueryBuilder<Entity> {
  return this;
};

/**
 * find next
 */
SelectQueryBuilder.prototype.AndWhereNext = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  no: number,
): SelectQueryBuilder<Entity> {
  this.andWhere(`${this.alias}.NO > :no ORDER BY NO LIMIT 1`, { no: no });
  this.select([`${this.alias}.no`]);
  return this;
};

/**
 * find previous
 */
SelectQueryBuilder.prototype.AndWherePrevious = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  no: number,
): SelectQueryBuilder<Entity> {
  this.andWhere(`${this.alias}.NO < :no ORDER BY NO DESC LIMIT 1`, { no: no });
  this.select([`${this.alias}.no`]);
  return this;
};

/**
 * less than
 */
SelectQueryBuilder.prototype.AndWhereLessThan = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  alias: string,
  property: string,
  value: any,
  excludedRequestDto?: any,
): SelectQueryBuilder<Entity> {
  if (value !== undefined) {
    console.log(`${ALIAS_DELIMETER}`);
    this.andWhere(
      `${alias}.${property} <= :${alias}${ALIAS_DELIMETER}${property}`,
      {
        [`${alias}${ALIAS_DELIMETER}${property}`]: value,
      },
    );
  }
  return this;
};

/**
 * And where within months
 */
SelectQueryBuilder.prototype.AndWhereWithinMonth = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  START_DATE?: Date | string,
  END_DATE?: Date | string,
): SelectQueryBuilder<Entity> {
  if (START_DATE) {
    this.andWhere(`${START_DATE} <= createdAt >= ${END_DATE}`, {
      START_DATE,
      END_DATE,
    });
  }
  return this;
};

SelectQueryBuilder.prototype.IN = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  columnName: string,
  values: string[],
): SelectQueryBuilder<Entity> {
  if (values.length > 0)
    this.andWhere(`${this.alias}.${columnName} IN (:...values)`, { values });
  return this;
};

SelectQueryBuilder.prototype.IsDisplay = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  isDisplay: boolean,
): SelectQueryBuilder<Entity> {
  if (isDisplay !== undefined && isDisplay !== null)
    this.andWhere(`${this.alias}.is_display = :isDisplay`, { isDisplay });
  return this;
};

// InnerJoinAndSelect For Joining Multiple Relations Of Sub Alias.
SelectQueryBuilder.prototype.CustomInnerJoinAndSelect = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  RELATIONS: string[],
): SelectQueryBuilder<Entity> {
  return RELATIONS.reduce((acc: any, item: any): any => {
    acc = acc.innerJoinAndSelect(`${this.alias}.${item}`, `${item}`);
    return acc;
  }, this);
};

// InnerJoinAndSelect For Joining Multiple Relations Of Sub Alias.
SelectQueryBuilder.prototype.CustomLeftJoinAndSelect = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  RELATIONS: string[],
): SelectQueryBuilder<Entity> {
  return RELATIONS.reduce((acc: any, item: any): any => {
    acc = acc.leftJoinAndSelect(`${this.alias}.${item}`, `${item}`);
    return acc;
  }, this);
};

SelectQueryBuilder.prototype.AndWhereEqual = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  alias: string,
  property: string,
  value: any,
  excludedRequestDto: any,
): SelectQueryBuilder<Entity> {
  if (value !== undefined) {
    this.andWhere(
      `${alias}.${property} = :${alias}${ALIAS_DELIMETER}${property}`,
      {
        [`${alias}${ALIAS_DELIMETER}${property}`]: value,
      },
    );
  }
  return this;
};

SelectQueryBuilder.prototype.AndWhereLike = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  alias: string,
  property: string,
  value: string,
  excludedRequestDto?: any,
): SelectQueryBuilder<Entity> {
  if (value !== undefined) {
    console.log(`${ALIAS_DELIMETER}`);
    this.andWhere(
      `${alias}.${property} LIKE :${alias}${ALIAS_DELIMETER}${property}`,
      {
        [`${alias}${ALIAS_DELIMETER}${property}`]: `%${value}%`,
      },
    );
  }
  return this;
};

SelectQueryBuilder.prototype.AndWhereIn = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  alias: string,
  property: string,
  values: any[],
  excludedRequestDto?: any,
): SelectQueryBuilder<Entity> {
  if (values && values.length > 0) {
    this.andWhere(
      `${alias}.${property} IN (:...${alias}${ALIAS_DELIMETER}${property})`,
      {
        [`${alias}${ALIAS_DELIMETER}${property}`]: values,
      },
    );
  }
  return this;
};

SelectQueryBuilder.prototype.AndWhereMatchInIds = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  alias: string,
  property: string,
  values: any[],
  excludedRequestDto?: any,
): SelectQueryBuilder<Entity> {
  if (values && values.length > 0) {
    values.map(value => {
      console.log(value, alias);
      this.andWhere(
        `${alias}.${property} IN (SELECT NO FROM AMENITY WHERE NO = ${value})`,
        // {
        //   [`${alias}${ALIAS_DELIMETER}${property}`]: value,
        // },
      );
    });
  }
  return this;
};

SelectQueryBuilder.prototype.WhereAndOrder = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  excludedRequestDto,
): SelectQueryBuilder<Entity> {
  // console.log(excludedRequestDto);
  // excludedRequestDto = classToClass(excludedRequestDto, {
  //   excludePrefixes: ['_'],
  //   excludeExtraneousValues: true,
  // });
  // console.log(excludedRequestDto);

  if (!excludedRequestDto) return this;

  const joinTableAliases = this.expressionMap.joinAttributes.map(
    attr => attr.alias && attr.alias.type === 'join' && attr.alias.name,
  );
  const parameters = this.getParameters();

  const where = {};
  Object.keys(excludedRequestDto)
    .filter(k => excludedRequestDto[k] !== undefined)
    .forEach(k => {
      // orderBy
      // ! 조인 테이블 컬럼 정렬은 지원하지않는다.
      if (k.indexOf(ORDER_BY_PREFIX) === 0) {
        let prop = _util.getOrderByProperty(k);
        prop = `${this.alias}.${prop}`;
        this.addOrderBy(prop, excludedRequestDto[k]);
        return;
      }

      // where
      // todo: 파라메터명 존재유무 체크로 스킵하는거 보다는 쿼리를 체크하는걸로 변경해야 한다.
      // 조인 컬럼인 경우
      if (typeof excludedRequestDto[k] === 'object') {
        Object.keys(excludedRequestDto[k]).forEach(property => {
          // 앞에서 이미 정의된 파라메터는 속성을 제거한다.
          if (parameters[`${k}${ALIAS_DELIMETER}${property}`]) {
            delete excludedRequestDto[k][property];
          }
        });
      } else if (parameters[`${this.alias}${ALIAS_DELIMETER}${k}`]) {
        // 앞에서 이미 정의된 파라메터는 스킵한다.
        return;
      }
      where[k] = excludedRequestDto[k];
    });

  console.log('--- SelectQueryBuilder.WhereAndOrder', where);

  // generate where
  Object.keys(where).forEach(k => {
    let whereQuery;
    let whereParam;

    // 치환되지않는 dto 조건절은 equal 검색을 한다.
    if (typeof where[k] === 'object' && !Array.isArray(where[k])) {
      // 조인 테이블 컬럼인 경우
      const alias = _util.joinAliasMapper(joinTableAliases, k);
      Object.keys(where[k]).forEach(property => {
        const param = `${alias}${ALIAS_DELIMETER}${property}`;
        whereParam = { [param]: where[k][property] };
        if (Array.isArray(where[k][property])) {
          whereQuery = `${alias}.${property} in (:${param})`;
        } else {
          whereQuery = `${alias}.${property} = :${param}`;
        }
        this.andWhere(whereQuery, whereParam);
      });
    } else {
      // 메인 테이블 컬럼인 경우
      whereParam = { [k]: where[k] };
      if (Array.isArray(where[k])) {
        whereQuery = `${this.alias}.${k} in (:${k})`;
      } else {
        whereQuery = `${this.alias}.${k} = :${k}`;
      }
      this.andWhere(whereQuery, whereParam);
    }
  });
  return this;
};

SelectQueryBuilder.prototype.Paginate = function<Entity>(
  this: SelectQueryBuilder<Entity>,
  pagination: PaginatedRequest,
): SelectQueryBuilder<Entity> {
  this.skip(pagination.skip * pagination.take - pagination.take).take(
    pagination.take,
  );
  return this;
};
