/**
 * Configuración de logging estructurado con Winston
 */

import winston from "winston";

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Crear directorio de logs si no existe
import fs from "fs";
import path from "path";

const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  defaultMeta: { service: "petzo-backend" },
  transports: [
    // Escribir todos los logs a console
    new winston.transports.Console({
      format: consoleFormat,
    }),
    // Escribir errores a archivo
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
    }),
    // Escribir todos los logs a archivo
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
    }),
  ],
});

// Si estamos en desarrollo, también mostrar logs en consola con formato simple
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;

