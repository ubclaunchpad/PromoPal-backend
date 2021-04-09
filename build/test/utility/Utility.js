"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomLongitude = exports.randomLatitude = exports.randomString = void 0;
function randomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
exports.randomString = randomString;
function getRandomInRange(from, to, decimals) {
    return Number.parseFloat((Math.random() * (to - from) + from).toFixed(decimals));
}
const randomLatitude = () => getRandomInRange(-90, 90, 3);
exports.randomLatitude = randomLatitude;
const randomLongitude = () => getRandomInRange(-180, 180, 3);
exports.randomLongitude = randomLongitude;
//# sourceMappingURL=Utility.js.map