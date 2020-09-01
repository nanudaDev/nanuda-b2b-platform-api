/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/ban-types */

export class BaseDto<T> {
  constructor(partial?: any) {
    Object.assign(this, partial);
  }

  exclude(property: string | { [x: string]: string[] }): this {
    if (property) {
      if (typeof property === 'object') {
        Object.keys(property).forEach(k => {
          if (typeof this[k] === 'object') {
            Object.keys(this[k]).forEach(k2 => {
              delete this[k][k2];
            });
          }
        });
      } else {
        delete this[property];
      }
    }
    return this;
  }

  setAttribute(partial: Object, deep: boolean = false): this {
    partial &&
      Object.keys(partial).map(key => {
        if (partial[key] !== undefined) {
          if (deep) {
            this[key] = partial[key];
          } else {
            if (!(partial[key] instanceof BaseDto)) {
              this[key] = partial[key];
            }
          }
        }
      });
    return this;
  }

  clone(): T {
    const type = Object.create(this);
    return Object.assign(type, this);
  }
}
