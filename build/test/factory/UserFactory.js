"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFactory = void 0;
const User_1 = require("../../main/entity/User");
const Utility_1 = require("../utility/Utility");
class UserFactory {
    generate(firstName, lastName, email, username, firebaseId) {
        return new User_1.User(firstName !== null && firstName !== void 0 ? firstName : Utility_1.randomString(10), lastName !== null && lastName !== void 0 ? lastName : Utility_1.randomString(10), email !== null && email !== void 0 ? email : Utility_1.randomString(10) + '@gmail.com', username !== null && username !== void 0 ? username : Utility_1.randomString(10), firebaseId !== null && firebaseId !== void 0 ? firebaseId : Utility_1.randomString(20));
    }
}
exports.UserFactory = UserFactory;
//# sourceMappingURL=UserFactory.js.map