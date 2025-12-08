/**
 * Configuración de Swagger/OpenAPI
 */

import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerDefinition } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "PETZO API",
    version: "1.0.0",
    description: "API REST para PETZO - Plataforma de adopción de mascotas",
    contact: {
      name: "PETZO Support",
    },
  },
  servers: [
    {
      url: process.env.API_URL || "http://localhost:3001",
      description: "Servidor de desarrollo",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Pet: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          type: { type: "string", enum: ["dog", "cat"] },
          age: { type: "number" },
          sex: { type: "string", enum: ["male", "female"] },
          size: { type: "string", enum: ["small", "medium", "large"] },
          city: { type: "string" },
          description: { type: "string" },
          photoUrl: { type: "string" },
          photos: { type: "array", items: { type: "string" } },
          ownerId: { type: "string" },
          createdAt: { type: "number" },
          updatedAt: { type: "number" },
          status: { type: "string", enum: ["available", "adopted", "pending"] },
          views: { type: "number" },
          likes: { type: "number" },
        },
      },
      CreatePetDto: {
        type: "object",
        required: ["name", "type", "city", "photoUrl"],
        properties: {
          name: { type: "string" },
          type: { type: "string", enum: ["dog", "cat"] },
          age: { type: "number" },
          sex: { type: "string", enum: ["male", "female"] },
          size: { type: "string", enum: ["small", "medium", "large"] },
          city: { type: "string" },
          description: { type: "string" },
          photoUrl: { type: "string" },
          photos: { type: "array", items: { type: "string" } },
        },
      },
      UpdatePetDto: {
        type: "object",
        properties: {
          name: { type: "string" },
          type: { type: "string", enum: ["dog", "cat"] },
          age: { type: "number" },
          sex: { type: "string", enum: ["male", "female"] },
          size: { type: "string", enum: ["small", "medium", "large"] },
          city: { type: "string" },
          description: { type: "string" },
          photoUrl: { type: "string" },
          photos: { type: "array", items: { type: "string" } },
        },
      },
      Pagination: {
        type: "object",
        properties: {
          page: { type: "number" },
          limit: { type: "number" },
          total: { type: "number" },
          totalPages: { type: "number" },
          hasNext: { type: "boolean" },
          hasPrev: { type: "boolean" },
        },
      },
    },
  },
  tags: [
    { name: "Auth", description: "Endpoints de autenticación" },
    { name: "Pets", description: "Endpoints de mascotas" },
    { name: "Favorites", description: "Endpoints de favoritos" },
    { name: "Adoption Requests", description: "Endpoints de solicitudes de adopción" },
    { name: "Messages", description: "Endpoints de mensajes" },
    { name: "Conversations", description: "Endpoints de conversaciones" },
    { name: "Notifications", description: "Endpoints de notificaciones" },
    { name: "Reports", description: "Endpoints de reportes" },
    { name: "Stats", description: "Endpoints de estadísticas" },
    { name: "Admin", description: "Endpoints de administración" },
    { name: "Uploads", description: "Endpoints de carga de archivos" },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/index.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

