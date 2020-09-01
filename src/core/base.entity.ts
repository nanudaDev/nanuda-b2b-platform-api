/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/ban-types */
import { BaseEntity as TypeormBaseEntity, Column } from 'typeorm';
import { BaseDto } from './base.dto';

export class BaseEntity<T> extends TypeormBaseEntity {
  // [x: string]: any;

  constructor(partial?: Partial<T>) {
    super();
    partial &&
      Object.keys(partial).map(key => {
        // if (key !== 'no' && this.hasOwnProperty(key)) {
        if (key !== 'no' && partial[key] !== undefined) {
          this[key] = partial[key];
        }
      });
  }

  set(partial: Object, deep: boolean = false): this {
    partial &&
      Object.keys(partial).map(key => {
        // if (key !== 'no' && this.hasOwnProperty(key)) {
        if (partial[key] !== undefined) {
          if (deep) {
            this[key] = partial[key];
          } else {
            if (!(partial[key] instanceof BaseDto)) {
              this[key] = partial[key];
            }
          }
        }
        // }
      });
    return this;
  }

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: Date;
}
