/**
 * Rutas de mascotas
 * Endpoints CRUD para gestionar mascotas
 * @swagger
 * tags:
 *   - name: Pets
 *     description: Endpoints para gestionar mascotas
 */

import { Router } from "express";
import { verifyFirebaseToken, AuthenticatedRequest } from "../middleware/auth";
import {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  incrementPetLikes,
  addPetPhoto,
  removePetPhoto,
} from "../services/pets.service";
import { asyncHandler } from "../middleware/errorHandler";
import { validatePetData, validateId } from "../middleware/validation";
import { CreatePetDto, UpdatePetDto } from "../types/Pet";
import { PetFilters } from "../types/filters";
import { PaginationParams } from "../types/pagination";

const router = Router();

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtiene todas las mascotas con filtros, búsqueda y paginación
 *     tags: [Pets]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [dog, cat]
 *         description: Filtrar por tipo de mascota
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filtrar por ciudad
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, adopted, pending]
 *         description: Filtrar por estado
 *       - in: query
 *         name: sex
 *         schema:
 *           type: string
 *           enum: [male, female]
 *         description: Filtrar por sexo
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *           enum: [small, medium, large]
 *         description: Filtrar por tamaño
 *       - in: query
 *         name: minAge
 *         schema:
 *           type: integer
 *         description: Edad mínima
 *       - in: query
 *         name: maxAge
 *         schema:
 *           type: integer
 *         description: Edad máxima
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por texto en nombre y descripción
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Límite de resultados por página
 *     responses:
 *       200:
 *         description: Lista de mascotas con paginación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const {
      type,
      city,
      ownerId,
      status,
      sex,
      size,
      minAge,
      maxAge,
      search,
      minDate,
      maxDate,
      page,
      limit,
    } = req.query;

    const filters: PetFilters = {};
    const pagination: PaginationParams = {};

    // Filtros
    if (type === "dog" || type === "cat") {
      filters.type = type;
    }
    if (typeof city === "string") {
      filters.city = city;
    }
    if (typeof ownerId === "string") {
      filters.ownerId = ownerId;
    }
    if (
      status === "available" ||
      status === "adopted" ||
      status === "pending"
    ) {
      filters.status = status;
    }
    if (sex === "male" || sex === "female") {
      filters.sex = sex;
    }
    if (size === "small" || size === "medium" || size === "large") {
      filters.size = size;
    }
    if (minAge !== undefined) {
      filters.minAge = parseInt(minAge as string, 10);
    }
    if (maxAge !== undefined) {
      filters.maxAge = parseInt(maxAge as string, 10);
    }
    if (typeof search === "string" && search.trim().length > 0) {
      filters.search = search.trim();
    }
    if (minDate !== undefined) {
      filters.minDate = parseInt(minDate as string, 10);
    }
    if (maxDate !== undefined) {
      filters.maxDate = parseInt(maxDate as string, 10);
    }

    // Paginación
    if (page !== undefined) {
      pagination.page = parseInt(page as string, 10);
    }
    if (limit !== undefined) {
      pagination.limit = parseInt(limit as string, 10);
    }

    const result = await getAllPets(filters, pagination);

    res.json({
      success: true,
      ...result,
    });
  })
);

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Obtiene una mascota por ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *       - in: query
 *         name: incrementViews
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Si se debe incrementar el contador de vistas
 *     responses:
 *       200:
 *         description: Mascota encontrada
 *       404:
 *         description: Mascota no encontrada
 */
router.get(
  "/:id",
  validateId,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const incrementViews = req.query.incrementViews !== "false"; // Por defecto true

    const pet = await getPetById(id, incrementViews);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: "Mascota no encontrada",
      });
    }

    res.json({
      success: true,
      data: pet,
    });
  })
);

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Crea una nueva mascota
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePetDto'
 *     responses:
 *       201:
 *         description: Mascota creada exitosamente
 *       401:
 *         description: No autenticado
 */
router.post(
  "/",
  verifyFirebaseToken,
  validatePetData,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const petData: CreatePetDto = req.body;

    // Validación de campos requeridos
    if (!petData.name || !petData.type || !petData.city) {
      return res.status(400).json({
        success: false,
        error: "Faltan campos requeridos: name, type, city",
      });
    }

    // Validar que haya al menos una foto
    if (!petData.photoUrl && (!petData.photos || petData.photos.length === 0)) {
      return res.status(400).json({
        success: false,
        error: "Al menos una foto es requerida",
      });
    }

    const newPet = await createPet(petData, req.user.uid);

    res.status(201).json({
      success: true,
      data: newPet,
    });
  })
);

/**
 * @swagger
 * /api/pets/{id}:
 *   put:
 *     summary: Actualiza una mascota existente
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePetDto'
 *     responses:
 *       200:
 *         description: Mascota actualizada
 *       403:
 *         description: No tienes permiso
 *       404:
 *         description: Mascota no encontrada
 */
router.put(
  "/:id",
  verifyFirebaseToken,
  validateId,
  validatePetData,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { id } = req.params;
    const petData: UpdatePetDto = req.body;

    try {
      const updatedPet = await updatePet(id, petData, req.user.uid);

      res.json({
        success: true,
        data: updatedPet,
      });
    } catch (error: any) {
      if (error.message === "Mascota no encontrada") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      if (error.message.includes("permiso")) {
        return res.status(403).json({
          success: false,
          error: error.message,
        });
      }
      throw error;
    }
  })
);

/**
 * @swagger
 * /api/pets/{id}/photos:
 *   post:
 *     summary: Agrega una foto a una mascota
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - photoUrl
 *             properties:
 *               photoUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Foto agregada exitosamente
 */
router.post(
  "/:id/photos",
  verifyFirebaseToken,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { id } = req.params;
    const { photoUrl } = req.body;

    if (!photoUrl || typeof photoUrl !== "string") {
      return res.status(400).json({
        success: false,
        error: "photoUrl es requerido",
      });
    }

    try {
      const updatedPet = await addPetPhoto(id, photoUrl, req.user.uid);

      res.json({
        success: true,
        data: updatedPet,
      });
    } catch (error: any) {
      if (error.message === "Mascota no encontrada") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      if (error.message.includes("permiso")) {
        return res.status(403).json({
          success: false,
          error: error.message,
        });
      }
      throw error;
    }
  })
);

/**
 * @swagger
 * /api/pets/{id}/photos:
 *   delete:
 *     summary: Elimina una foto de una mascota
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - photoUrl
 *             properties:
 *               photoUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Foto eliminada exitosamente
 */
router.delete(
  "/:id/photos",
  verifyFirebaseToken,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { id } = req.params;
    const { photoUrl } = req.body;

    if (!photoUrl || typeof photoUrl !== "string") {
      return res.status(400).json({
        success: false,
        error: "photoUrl es requerido",
      });
    }

    try {
      const updatedPet = await removePetPhoto(id, photoUrl, req.user.uid);

      res.json({
        success: true,
        data: updatedPet,
      });
    } catch (error: any) {
      if (error.message === "Mascota no encontrada") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      if (error.message.includes("permiso") || error.message.includes("última foto")) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }
      throw error;
    }
  })
);

/**
 * @swagger
 * /api/pets/{id}/like:
 *   post:
 *     summary: Incrementa los likes de una mascota
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               increment:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Likes incrementados
 */
router.post(
  "/:id/like",
  validateId,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { increment } = req.body;
    const incrementValue = increment !== undefined ? parseInt(increment, 10) : 1;

    try {
      const updatedPet = await incrementPetLikes(id, incrementValue);

      res.json({
        success: true,
        data: updatedPet,
      });
    } catch (error: any) {
      if (error.message === "Mascota no encontrada") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      throw error;
    }
  })
);

/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     summary: Elimina una mascota
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota eliminada
 *       403:
 *         description: No tienes permiso
 */
router.delete(
  "/:id",
  verifyFirebaseToken,
  validateId,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const { id } = req.params;

    try {
      await deletePet(id, req.user.uid);

      res.json({
        success: true,
        message: "Mascota eliminada correctamente",
      });
    } catch (error: any) {
      if (error.message === "Mascota no encontrada") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      if (error.message.includes("permiso")) {
        return res.status(403).json({
          success: false,
          error: error.message,
        });
      }
      throw error;
    }
  })
);

export default router;
