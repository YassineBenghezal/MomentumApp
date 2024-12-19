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
exports.createHabit = exports.getHabits = void 0;
const habits_service_1 = require("../services/habits.service");
const getHabits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const habits = yield (0, habits_service_1.fetchUserHabits)(userId);
        res.status(200).json(habits);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch habits' });
    }
});
exports.getHabits = getHabits;
const createHabit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const habitData = Object.assign(Object.assign({}, req.body), { userId });
        const newHabit = yield (0, habits_service_1.addHabit)(habitData);
        res.status(201).json(newHabit);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to create habit' });
    }
});
exports.createHabit = createHabit;
