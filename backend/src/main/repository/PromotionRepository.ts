import {
  EntityRepository,
  getCustomRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Promotion } from '../entity/Promotion';
import {
  PromotionQueryDTO,
  PromotionQueryValidation,
} from '../validation/PromotionQueryValidation';

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
@EntityRepository(Promotion)
export class PromotionRepository extends Repository<Promotion> {
  /**
   * Gets all promotions by constructing a query builder.
   * * Depending on whether request.query exists, we will need to apply the necessary operations on top of
   * the queryBuilder in order to support filtering operations
   * */
  async getAllPromotions(query: any): Promise<any> {
    let queryBuilder = getCustomRepository(PromotionRepository)
      .createQueryBuilder('promotion')
      .innerJoinAndSelect('promotion.discount', 'discount');

    if (query) {
      const promotionQuery: PromotionQueryDTO = await PromotionQueryValidation.schema.validateAsync(
        query,
        { abortEarly: false }
      );
      queryBuilder = this.applyQueryOptions(queryBuilder, promotionQuery);
    }

    return queryBuilder.getMany();
  }

  /**
   * Depending on which properties are defined inside promotionQuery, we add those properties into our query for the queryBuilder to execute.
   */
  private applyQueryOptions(
    queryBuilder: SelectQueryBuilder<Promotion>,
    promotionQuery: PromotionQueryDTO
  ): SelectQueryBuilder<Promotion> {
    if (promotionQuery?.category) {
      queryBuilder = queryBuilder.andWhere('promotion.category = :category', {
        category: promotionQuery.category,
      });
    }

    if (promotionQuery?.cuisine) {
      queryBuilder = queryBuilder.andWhere('promotion.cuisine = :cuisine', {
        cuisine: promotionQuery.cuisine,
      });
    }

    if (promotionQuery?.discountType) {
      queryBuilder = queryBuilder.andWhere('discount.type = :type', {
        type: promotionQuery.discountType,
      });
    }

    if (promotionQuery?.expirationDate) {
      queryBuilder = queryBuilder.andWhere(
        'promotion.expirationDate >= :date',
        {
          date: new Date(promotionQuery.expirationDate),
        }
      );
    }

    if (promotionQuery?.name) {
      let name = promotionQuery.name;

      // first escape % and _ (request needs to show it as https://stackoverflow.com/questions/17342671/pass-a-percent-sign-in-a-url-and-get-exact-value-of-it-using-php)
      // this way users can query promotions that contain % or _
      name = name.replace('%', '\\%');
      name = name.replace('_', '\\_');

      // add wildcards
      name = `%${name.replace(/ /g, '%')}%`;

      queryBuilder = queryBuilder.andWhere('promotion.name ilike :name', {
        name: name,
      });
    }

    return queryBuilder;
  }
}
