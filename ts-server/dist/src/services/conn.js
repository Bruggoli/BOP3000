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
exports.collections = void 0;
// External dependencies
const mongodb_1 = require("mongodb");
// Global variables
exports.collections = {};
// Initialize connection
function connectToDb() {
    return __awaiter(this, void 0, void 0, function* () {
        const connectionString = process.env.ATLAS_URI || "";
        const client = new mongodb_1.MongoClient(connectionString);
        yield client.connect();
        const db = client.db("StudentLink");
        const collection = db.collection("Klubber");
        exports.collections.klubber = collection;
    });
}
exports.default = connectToDb;
