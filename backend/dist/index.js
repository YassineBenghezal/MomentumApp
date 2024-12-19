"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./modules/auth/routes/auth.routes"));
const habits_route_1 = __importDefault(require("./modules/habits/routes/habits.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Configuration CORS
app.use((0, cors_1.default)());
// Middleware pour gérer JSON
app.use(express_1.default.json());
// Routes
app.use('/auth', auth_routes_1.default);
app.use('/api/habits', habits_route_1.default);
// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
