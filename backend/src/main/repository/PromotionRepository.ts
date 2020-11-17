import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Promotion } from '../entity/Promotion';
import { PromotionQueryDTO } from '../validation/PromotionQueryValidation';

/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
@EntityRepository(Promotion)
export class PromotionRepository extends Repository<Promotion> {
  /**
   * Gets all promotions by constructing a query builder.
   * * Depending on whether promotionQuery has any content, we will need to apply the necessary operations on top of
   * the queryBuilder in order to support filtering operations
   * */
  async getAllPromotions(promotionQuery?: PromotionQueryDTO): Promise<any> {
    if (
      promotionQuery &&
      JSON.stringify(promotionQuery) !== JSON.stringify({})
    ) {
      return this.applyQueryOptions(promotionQuery);
    } else {
      return this.createQueryBuilder('promotion')
        .innerJoinAndSelect('promotion.discount', 'discount')
        .getMany();
    }
  }

  /**
   * Depending on which properties are defined inside promotionQuery, we add those properties into our query for the queryBuilder to execute.
   */
  private applyQueryOptions(promotionQuery: PromotionQueryDTO): Promise<any> {
    const queryBuilder = this.createQueryBuilder('promotion');

    if (promotionQuery?.category) {
      queryBuilder.andWhere('promotion.category = :category', {
        category: promotionQuery.category,
      });
    }

    if (promotionQuery?.cuisine) {
      queryBuilder.andWhere('promotion.cuisine = :cuisine', {
        cuisine: promotionQuery.cuisine,
      });
    }

    if (promotionQuery?.discountType) {
      queryBuilder.andWhere('discount.type = :type', {
        type: promotionQuery.discountType,
      });
    }

    if (promotionQuery?.expirationDate) {
      queryBuilder.andWhere('promotion.expirationDate >= :date', {
        date: new Date(promotionQuery.expirationDate),
      });
    }

    if (promotionQuery?.searchQuery) {
      return this.fullTextSearch(queryBuilder, promotionQuery);
    }

    return queryBuilder.getMany();
  }

  private async fullTextSearch(
    queryBuilder: SelectQueryBuilder<Promotion>,
    promotionQuery: PromotionQueryDTO
  ): Promise<any> {
    // todo: modify searchQuery accordingly
    // todo: decide how to handle special characters (e.g. single quotes, AT&T as a single word)
    const searchQuery = promotionQuery.searchQuery;

    const arrayOfIdRank: IdRank[] = await this.createQueryBuilder('promotion')
      .select('promotion.id', 'id')
      .addSelect(
        `ts_rank_cd(tsvector, replace(plainto_tsquery('${searchQuery}')::text, '&', '|')::tsquery)`,
        'rank'
      )
      .where(
        `tsvector @@ replace(plainto_tsquery('${searchQuery}')::text, '&', '|')::tsquery`
      )
      // .addSelect(`ts_rank_cd(tsvector, plainto_tsquery('${searchQuery}'))`, 'rank')
      // .where(`tsvector @@ plainto_tsquery('${searchQuery}')`)
      .orderBy('rank', 'DESC')
      .getRawMany();

    if (!arrayOfIdRank?.length) {
      return [];
    }

    const promotions: Promotion[] = await queryBuilder
      .innerJoinAndSelect('promotion.discount', 'discount')
      .andWhere('promotion.id IN (:...ids)', {
        ids: arrayOfIdRank.map((idRank) => idRank.id),
      })
      .getMany();

    if (!promotions?.length) {
      return [];
    }

    const mapIdToPromotion: Map<string, Promotion> = new Map(
      promotions.map((promotion) => [promotion.id, promotion])
    );

    const result = [];
    for (const idRank of arrayOfIdRank) {
      const promotion = mapIdToPromotion.get(idRank.id);
      if (promotion) {
        promotion.rank = idRank.rank;
        result.push(promotion);
      }
    }

    return result;
  }
}

interface IdRank {
  id: string;
  rank: number;
}
