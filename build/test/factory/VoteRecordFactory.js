"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteRecordFactory = void 0;
const VoteRecord_1 = require("../../main/entity/VoteRecord");
class VoteRecordFactory {
    generate(user, promotion) {
        return new VoteRecord_1.VoteRecord(user, promotion);
    }
}
exports.VoteRecordFactory = VoteRecordFactory;
//# sourceMappingURL=VoteRecordFactory.js.map