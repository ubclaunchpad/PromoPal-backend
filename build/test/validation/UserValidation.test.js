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
const UserValidation_1 = require("../../main/validation/UserValidation");
describe('Unit tests for UserValidation', function () {
    let userDTO;
    beforeEach(() => {
        userDTO = {
            username: 'testusername',
            firstName: 'testfirstname',
            lastName: 'testlastname',
            email: 'test@sample.com',
            firebaseId: 'testidfirebase',
        };
    });
    test('Should not return no errors for a valid userDTO', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield UserValidation_1.UserValidation.schema.validateAsync(userDTO, {
                abortEarly: false,
            });
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should fail if undefined', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield UserValidation_1.UserValidation.schema.validateAsync(undefined, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"value" is required');
        }
    }));
    test('Should fail if invalid email', () => __awaiter(this, void 0, void 0, function* () {
        try {
            userDTO.email = 'invalid-email';
            yield UserValidation_1.UserValidation.schema.validateAsync(userDTO, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"email" must be a valid email');
        }
    }));
});
//# sourceMappingURL=UserValidation.test.js.map