/**
 * Middleware centralizado para manejo de errores
 * Captura todos los errores y los formatea de manera consistente
 */

import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log del error para debugging
  logger.error("Error capturado:", {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    code: err.code,
    path: req.path,
    method: req.method,
  });

  // Determinar el código de estado
  const statusCode = err.statusCode || 500;

  // Respuesta de error formateada
  res.status(statusCode).json({
    error: {
      message: err.message || "Error interno del servidor",
      code: err.code || "INTERNAL_ERROR",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

/**
 * Wrapper para manejar errores asíncronos en los controladores
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

