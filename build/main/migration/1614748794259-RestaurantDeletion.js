"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantDeletion1614748794259 = void 0;
class RestaurantDeletion1614748794259 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            CREATE OR REPLACE FUNCTION cleanupRestaurant()
                RETURNS TRIGGER
                LANGUAGE PLPGSQL
            AS $$
            BEGIN
                delete from restaurant
                where id = old."restaurantId" and
                    not exists(select * from promotion P where P."restaurantId" = old."restaurantId" and P.id != old.id for update);
                return old;
            END
            $$;
            `);
            yield queryRunner.query(`
            create trigger cleanupRestaurant
            after delete on promotion
            for each row
            execute procedure cleanupRestaurant();
            `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('drop trigger cleanupRestaurant on promotion;');
            yield queryRunner.query('drop function cleanupRestaurant();');
        });
    }
}
exports.RestaurantDeletion1614748794259 = RestaurantDeletion1614748794259;
//# sourceMappingURL=1614748794259-RestaurantDeletion.js.map