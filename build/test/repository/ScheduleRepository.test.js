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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const BaseRepositoryTest_1 = __importDefault(require("./BaseRepositoryTest"));
const ScheduleRepository_1 = require("../../main/repository/ScheduleRepository");
const ScheduleFactory_1 = require("../factory/ScheduleFactory");
describe('Unit tests for DiscountRepository', function () {
    let scheduleRepository;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.create();
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.close();
    }));
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.clear();
        scheduleRepository = typeorm_1.getCustomRepository(ScheduleRepository_1.ScheduleRepository);
    }));
    test('Should not be able to save schedule without promotion', () => __awaiter(this, void 0, void 0, function* () {
        const schedule = new ScheduleFactory_1.ScheduleFactory().generate();
        try {
            yield scheduleRepository.save(schedule);
            fail('Should have failed');
        }
        catch (e) {
            expect(e.message).toContain('violates not-null constraint');
        }
    }));
});
//# sourceMappingURL=ScheduleRepository.test.js.map