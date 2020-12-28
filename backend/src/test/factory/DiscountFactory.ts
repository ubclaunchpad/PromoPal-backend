import { DiscountType } from '../../main/data/DiscountType';
import { Discount } from '../../main/entity/Discount';

export class DiscountFactory {
  generate(discountType?: DiscountType, discountValue?: number) {
    return new Discount(
      discountType ?? DiscountType.AMOUNT,
      discountValue ?? 188.08
    );
  }
}
