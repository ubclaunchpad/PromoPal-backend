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
const IdValidation_1 = require("../../main/validation/IdValidation");
describe('Unit tests for IdValidation', function () {
    let id;
    beforeEach(() => {
        id = '4aa10542-8441-427b-be51-1e5a4096aea9';
    });
    test('Should return no errors for a valid id', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield IdValidation_1.IdValidation.schema.validateAsync(id, {
                abortEarly: false,
            });
        }
        catch (e) {
            fail('Should not have failed: ' + e);
        }
    }));
    test('Should fail if undefined', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield IdValidation_1.IdValidation.schema.validateAsync(undefined, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"value" is required');
        }
    }));
    test('Should fail if given id is incorrect', () => __awaiter(this, void 0, void 0, function* () {
        try {
            id = 'Invalid Id';
            yield IdValidation_1.IdValidation.schema.validateAsync(id, {
                abortEarly: false,
            });
            fail('Should have failed');
        }
        catch (e) {
            expect(e.details.length).toEqual(1);
            expect(e.details[0].message).toEqual('"value" must be a valid GUID');
        }
    }));
});
//# sourceMappingURL=IdValidation.test.js.map