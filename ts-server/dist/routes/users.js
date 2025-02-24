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
exports.klubberRouter = void 0;
// External dependencies
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const conn_1 = require("../services/conn");
const klubber_1 = __importDefault(require("../models/klubber"));
// Global config
exports.klubberRouter = express_1.default.Router();
exports.klubberRouter.use(express_1.default.json());
// GET
exports.klubberRouter.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const klubber = (yield conn_1.collections.klubb.find({}).toArray());
        res.status(200).send(klubber);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
exports.klubberRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        // @ts-ignore
        const game = (yield conn_1.collections.klubb.findOne(query));
        if (klubber_1.default) {
            res.status(200).send(klubber_1.default);
        }
    }
    catch (error) {
        res.status(404).send(`Unable to find id: ${req.params.id}`);
    }
}));
// POST
// PUT
// DELETE
