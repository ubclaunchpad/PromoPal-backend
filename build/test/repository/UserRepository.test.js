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
const UserRepository_1 = require("../../main/repository/UserRepository");
const BaseRepositoryTest_1 = __importDefault(require("./BaseRepositoryTest"));
const UserFactory_1 = require("../factory/UserFactory");
describe('Unit tests for UserRepository', function () {
    let userRepository;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.create();
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.close();
    }));
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        yield BaseRepositoryTest_1.default.clear();
        userRepository = typeorm_1.getCustomRepository(UserRepository_1.UserRepository);
    }));
    test('Should be able to store a user and successfully retrieve the same user', () => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(expectedUser);
        const user = yield userRepository.findOne(expectedUser.id);
        expect(user).toBeDefined();
        expect(user.id).toEqual(expectedUser.id);
    }));
    test('Should be able to store a user and successfully retrieve by id firebase', () => __awaiter(this, void 0, void 0, function* () {
        const expectedUser = new UserFactory_1.UserFactory().generate();
        yield userRepository.save(expectedUser);
        const user = yield userRepository.findByFirebaseId(expectedUser.firebaseId, { cache: true });
        expect(user).toBeDefined();
        expect(user.id).toEqual(expectedUser.id);
    }));
    test('Should not be able to add two users with the same username', () => __awaiter(this, void 0, void 0, function* () {
        const userName = 'userName';
        const user1 = new UserFactory_1.UserFactory().generate();
        const user2 = new UserFactory_1.UserFactory().generate();
        user1.username = userName;
        user2.username = userName;
        yield userRepository.save(user1);
        try {
            yield userRepository.save(user2);
            fail('Should  have failed');
        }
        catch (e) {
            expect(e.detail).toEqual(`Key (username)=(${userName}) already exists.`);
        }
    }));
    test('Should not be able to add two users with the same id firebase', () => __awaiter(this, void 0, void 0, function* () {
        const firebaseId = 'testidfirebase';
        const user1 = new UserFactory_1.UserFactory().generate();
        const user2 = new UserFactory_1.UserFactory().generate();
        user1.firebaseId = firebaseId;
        user2.firebaseId = firebaseId;
        yield userRepository.save(user1);
        try {
            yield userRepository.save(user2);
            fail('Should  have failed');
        }
        catch (e) {
            expect(e.detail).toEqual(`Key (uid_firebase)=(${firebaseId}) already exists.`);
        }
    }));
    test('Should not be able to add two users with the same email', () => __awaiter(this, void 0, void 0, function* () {
        const email = 'test@gmail.com';
        const user1 = new UserFactory_1.UserFactory().generate();
        const user2 = new UserFactory_1.UserFactory().generate();
        user1.email = email;
        user2.email = email;
        yield userRepository.save(user1);
        try {
            yield userRepository.save(user2);
            fail('Should  have failed');
        }
        catch (e) {
            expect(e.detail).toEqual(`Key (email)=(${email}) already exists.`);
        }
    }));
});
//# sourceMappingURL=UserRepository.test.js.map