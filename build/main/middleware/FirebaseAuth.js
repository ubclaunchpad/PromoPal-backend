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
exports.FirebaseAuth = void 0;
class FirebaseAuth {
    constructor(firebaseAdmin) {
        this.isAuthorizedForProtection = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const idToken = req.headers.authorization;
            try {
                const decodedToken = yield this.admin.verifyIdToken(idToken);
                if (decodedToken) {
                    return next();
                }
                else {
                    return res.status(401).send('You are not authorized');
                }
            }
            catch (e) {
                return res.status(401).send('You are not authorized!');
            }
        });
        this.admin = firebaseAdmin;
    }
}
exports.FirebaseAuth = FirebaseAuth;
//# sourceMappingURL=FirebaseAuth.js.map