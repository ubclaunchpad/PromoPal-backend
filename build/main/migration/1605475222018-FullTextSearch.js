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
exports.FullTextSearch1605475222018 = void 0;
class FullTextSearch1605475222018 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('create index tsvector_idx on promotion using gin (tsvector)');
            yield queryRunner.query("create trigger tsvectorupdate before insert or update on promotion for each row execute procedure tsvector_update_trigger(tsvector, 'pg_catalog.english', name, description)");
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query('drop index tsvector_idx');
            yield queryRunner.query('drop trigger tsvectorupdate on promotion');
        });
    }
}
exports.FullTextSearch1605475222018 = FullTextSearch1605475222018;
//# sourceMappingURL=1605475222018-FullTextSearch.js.map