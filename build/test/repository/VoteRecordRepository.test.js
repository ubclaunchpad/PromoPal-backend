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
const VoteRecordRepository_1 = require("../../main/repository/VoteRecordRepository");
const UserRepository_1 = require("../../main/repository/UserRepository");
const PromotionRepository_1 = require("../../main/repository/PromotionRepository");
const BaseRepositoryTest_1 = __importDefault(require("./BaseRepositoryTest"));
const typeorm_1 = require("typeorm");
const UserFactory_1 = require("../factory/UserFactory");
const PromotionFactory_1 = require("../factory/PromotionFactory");
const VoteRecord_1 = require("../../main/entity/VoteRecord");
describe('Unit test for VoteRecord', function () {
    let voteRecordRepository;
    let userRepository;
    let promotionRepository;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.create();
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.close();
    }));
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.clear();
        voteRecordRepository = typeorm_1.getCustomRepository(VoteRecordRepository_1.VoteRecordRepository);
        userRepository = typeorm_1.getCustomRepository(UserRepository_1.UserRepository);
        promotionRepository = typeorm_1.getCustomRepository(PromotionRepository_1.PromotionRepository);
    }));
    test('Should be able to create a new voteRecord', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        const votingUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(votingUser);
        const voteRecord = voteRecordRepository.create({
            userId: votingUser.id,
            promotionId: promotion.id,
        });
        yield voteRecordRepository.save(voteRecord);
        const record = yield voteRecordRepository.findOne({
            user: votingUser,
            promotion: promotion,
        });
        expect(record).toBeDefined();
        expect(record.userId).toEqual(votingUser.id);
        expect(record.promotionId).toEqual(promotion.id);
        expect(record.voteState).toEqual(VoteRecord_1.VoteState.INIT);
    }));
    test('Should not able to create two vote record for one user', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        const votingUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(votingUser);
        yield voteRecordRepository.addVoteRecord(votingUser, promotion);
        try {
            yield voteRecordRepository.addVoteRecord(votingUser, promotion);
            fail('Should have failed');
        }
        catch (e) {
            expect(e.detail).toEqual(`Key ("userId", "promotionId")=(${votingUser.id}, ${promotion.id}) already exists.`);
        }
    }));
    test('Should be able to edit the vote state', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        const votingUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(votingUser);
        const voteRecord = voteRecordRepository.create({
            userId: votingUser.id,
            promotionId: promotion.id,
        });
        yield voteRecordRepository.save(voteRecord);
        let record;
        try {
            record = yield voteRecordRepository.findOneOrFail({
                user: votingUser,
                promotion: promotion,
            });
        }
        catch (e) {
            fail(e);
        }
        expect(record).toBeDefined();
        expect(record.userId).toEqual(votingUser.id);
        expect(record.promotionId).toEqual(promotion.id);
        expect(record.voteState).toEqual(VoteRecord_1.VoteState.INIT);
        record.voteState = VoteRecord_1.VoteState.UP;
        yield voteRecordRepository.save(record);
        try {
            record = yield voteRecordRepository.findOneOrFail({
                userId: votingUser.id,
                promotionId: promotion.id,
            });
            expect(record).toBeDefined();
            expect(record.userId).toEqual(votingUser.id);
            expect(record.promotionId).toEqual(promotion.id);
            expect(record.voteState).toEqual(VoteRecord_1.VoteState.UP);
        }
        catch (e) {
            fail(e);
        }
        record.voteState = VoteRecord_1.VoteState.DOWN;
        yield voteRecordRepository.save(record);
        try {
            record = yield voteRecordRepository.findOneOrFail({
                userId: votingUser.id,
                promotionId: promotion.id,
            });
            expect(record).toBeDefined();
            expect(record.userId).toEqual(votingUser.id);
            expect(record.promotionId).toEqual(promotion.id);
            expect(record.voteState).toEqual(VoteRecord_1.VoteState.DOWN);
        }
        catch (e) {
            fail(e);
        }
    }));
    test('Vote record should be removed when respective promotion is deleted', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        const votingUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(votingUser);
        const voteRecord = voteRecordRepository.create({
            userId: votingUser.id,
            promotionId: promotion.id,
        });
        yield voteRecordRepository.save(voteRecord);
        yield promotionRepository.delete(promotion.id);
        try {
            yield voteRecordRepository.findOneOrFail({
                userId: votingUser.id,
                promotionId: promotion.id,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.message).toEqual(`Could not find any entity of type "VoteRecord" matching: {
    "userId": "${votingUser.id}",
    "promotionId": "${promotion.id}"\n}`);
        }
    }));
    test('Vote record should be removed when respective user is deleted', () => __awaiter(this, void 0, void 0, function* () {
        const user = new UserFactory_1.UserFactory().generate();
        const promotion = new PromotionFactory_1.PromotionFactory().generateWithRelatedEntities(user);
        yield userRepository.save(user);
        yield promotionRepository.save(promotion);
        const votingUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(votingUser);
        const voteRecord = voteRecordRepository.create({
            userId: votingUser.id,
            promotionId: promotion.id,
        });
        yield voteRecordRepository.save(voteRecord);
        yield userRepository.delete(votingUser.id);
        try {
            yield voteRecordRepository.findOneOrFail({
                userId: votingUser.id,
                promotionId: promotion.id,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.message).toEqual(`Could not find any entity of type "VoteRecord" matching: {
    "userId": "${votingUser.id}",
    "promotionId": "${promotion.id}"\n}`);
        }
    }));
});
//# sourceMappingURL=VoteRecordRepository.test.js.map