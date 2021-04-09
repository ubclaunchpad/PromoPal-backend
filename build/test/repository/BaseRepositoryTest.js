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
const typeorm_1 = require("typeorm");
const connection = {
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.createConnection({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: 'postgres',
                database: 'foodies_test',
                synchronize: true,
                dropSchema: true,
                logging: false,
                entities: ['src/main/entity/**/*.ts'],
                migrations: ['src/main/migration/**/*.ts'],
                migrationsRun: true,
                subscribers: ['src/main/subscriber/**/*.ts'],
                cli: {
                    entitiesDir: 'src/main/entity',
                    migrationsDir: 'src/main/migration',
                    subscribersDir: 'src/main/subscriber',
                },
            });
        });
    },
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.clear();
            yield typeorm_1.getConnection().close();
        });
    },
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            yield connection.query('delete from user_profile');
        });
    },
};
exports.default = connection;
//# sourceMappingURL=BaseRepositoryTest.js.map