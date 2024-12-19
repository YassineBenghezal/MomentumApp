"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const habits_controller_1 = require("../controllers/habits.controller");
const auth_middleware_1 = require("../../auth/middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authenticateUser, habits_controller_1.getHabits);
router.post('/', auth_middleware_1.authenticateUser, habits_controller_1.createHabit);
exports.default = router;
