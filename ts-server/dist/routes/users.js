"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Mock database
const users = [
    {
        last_name: 'Doe',
        email: 'johndoe@example.com',
    },
    {
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'alicesmith@example.com',
    },
];
// Getting the list of users from the mock database
router.get('/', (req, res) => {
    res.send(users);
});
exports.default = router;
