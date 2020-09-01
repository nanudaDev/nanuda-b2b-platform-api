import { BaseEntity } from 'src/core';
import { Entity } from 'typeorm';

@Entity({ name: 'FAVORITE_SPACE_MAPPER' })
export class FavoriteSpaceMapper extends BaseEntity<FavoriteSpaceMapper> {}
