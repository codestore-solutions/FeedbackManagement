"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = require("../controller/user_controller");
router.post("/signup", user_controller_1.userSignup);
router.post("/login", user_controller_1.user_login);
router.get("/:id", user_controller_1.getUser);
exports.default = router;
