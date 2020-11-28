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
    const queryBuilder = this.createQueryBuilder(
      'promotion'
    ).innerJoinAndSelect('promotion.discount', 'discount');

    if (promotionQuery?.promotionType) {
      queryBuilder.andWhere('promotion.promotionType = :promotionType', {
        promotionType: promotionQuery.promotionType,
      });
    }

    if (promotionQuery?.cuisine) {
      queryBuilder.andWhere('promotion.cuisine = :cuisine', {
        cuisine: promotionQuery.cuisine,
      });
    }

    if (promotionQuery?.discountType) {
      queryBuilder.andWhere('discount.discountType = :discountType', {
        discountType: promotionQuery.discountType,
      });
    }

    // see https://github.com/ubclaunchpad/foodies/issues/54
    if (promotionQuery?.expirationDate) {
      queryBuilder.andWhere(
        "promotion.expirationDate ::timestamptz at time zone 'UTC' >= :date ::timestamptz at time zone 'UTC'",
        {
          date: promotionQuery.expirationDate,
        }
      );
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

    const fullTextSearchResults: FullTextSearchInterface[] = await this.createQueryBuilder(
      'promotion'
    )
      .select('promotion.id', 'id')
      .addSelect(
        "ts_rank_cd(tsvector, replace(plainto_tsquery(:searchQuery)::text, '&', '|')::tsquery)",
        'rank'
      )
      .addSelect(
        "ts_headline(description, replace(plainto_tsquery(:searchQuery)::text, '&', '|')::tsquery, 'MaxFragments=3')",
        'boldDescription'
      )
      // todo: double check, if we set max length for title we can use HighlightAll, otherwise we can use MaxWords/MinWords as well
      .addSelect(
        "ts_headline(name, replace(plainto_tsquery(:searchQuery)::text, '&', '|')::tsquery, 'HighlightAll=true')",
        'boldName'
      )
      .where(
        "tsvector @@ replace(plainto_tsquery(:searchQuery)::text, '&', '|')::tsquery",
        {
          searchQuery: promotionQuery.searchQuery,
        }
      )
      .orderBy('rank', 'DESC')
      .getRawMany();

    if (!fullTextSearchResults?.length) {
      return [];
    }

    // todo: can we optimize this? Although the id column is already index (b/c primary key)
    const promotions: Promotion[] = await queryBuilder
      .andWhere('promotion.id IN (:...ids)', {
        ids: fullTextSearchResults.map((idRank) => idRank.id),
      })
      .getMany();

    if (!promotions?.length) {
      return [];
    }

    const mapIdToPromotion: Map<string, Promotion> = new Map(
      promotions.map((promotion) => [promotion.id, promotion])
    );

    const result: PromotionFullTextSearch[] = [];
    for (const fullTextSearchResult of fullTextSearchResults) {
      const promotion = mapIdToPromotion.get(fullTextSearchResult.id);
      if (promotion) {
        const promotionWithRank: PromotionFullTextSearch = {
          ...promotion,
          rank: fullTextSearchResult.rank,
          boldDescription: fullTextSearchResult.boldDescription,
          boldName: fullTextSearchResult.boldName,
        };
        result.push(promotionWithRank);
      }
    }

    return result;
  }
}

/**
 * Represents results returned from postgres full text search.
 * * rank - scale for how relevant promotion matches the search query
 * * boldName and boldDescription - postgres highlights areas that match the search query
 * */
interface FullTextSearchInterface {
  id: string;
  rank: number;
  boldName: string;
  boldDescription: string;
}

/**
 * Used only for full text search when client applies search query options to get promotions
 * * rank - represents how relevant documents are to a particular query, so that the most relevant one can be shown
 * * boldName and boldDescription - postgres highlights areas that match the search query
 * */
export interface PromotionFullTextSearch extends Promotion {
  rank: number;
  boldName: string;
  boldDescription: string;
}
