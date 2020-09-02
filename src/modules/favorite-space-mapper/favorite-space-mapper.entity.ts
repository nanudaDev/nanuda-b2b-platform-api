import { BaseEntity } from 'src/core';
import { Entity } from 'typeorm';

@Entity({ name: 'B2B_FAVORITE_SPACE_MAPPER' })
export class FavoriteSpaceMapper extends BaseEntity<FavoriteSpaceMapper> {}
