/**
 * Servidor principal de Express para PETZO
 * Configuración del servidor, middlewares de seguridad y rutas
 */

import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Importar configuraciones (esto inicializa Firebase y Cloudinary)
import "./config/firebaseAdmin";
import "./config/cloudinary";

// Importar rutas
import authRoutes from "./routes/auth.routes";
import petsRoutes from "./routes/pets.routes";
import uploadsRoutes from "./routes/uploads.routes";

// Importar middleware de manejo de errores
import { errorHandler } from "./middleware/errorHandler";

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ==================== MIDDLEWARES DE SEGURIDAD ====================

// Helmet: Protección de headers HTTP
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS: Configurar origen permitido
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate Limiting: Limitar número de requests por IP
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutos por defecto
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"), // 100 requests por ventana
  message: {
    error: "Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

// Body Parser: Parsear JSON y URL encoded
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ==================== RUTAS ====================

// Ruta de salud/health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "PETZO API está funcionando",
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/pets", petsRoutes);
app.use("/api/uploads", uploadsRoutes);

// Ruta 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Ruta no encontrada",
    path: req.path,
  });
});

// ==================== MANEJO DE ERRORES ====================

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
  console.log(`
  🚀 Servidor PETZO Backend iniciado
  📍 Puerto: ${PORT}
  🌐 Frontend URL: ${FRONTEND_URL}
  🔥 Firebase: Configurado
  ☁️  Cloudinary: Configurado
  `);
});

// Manejo de errores no capturados
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

