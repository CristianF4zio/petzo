/**
 * Servicio para manejar reportes de contenido
 */

import { db } from "../config/firebaseAdmin";
import { COLLECTIONS } from "../types/database";
import { ReportDocument } from "../types/database";
import { PaginationParams, PaginationResult, normalizePagination } from "../types/pagination";

const REPORTS_COLLECTION = COLLECTIONS.REPORTS;

/**
 * Crear un reporte
 */
export const createReport = async (
  report: Omit<ReportDocument, "id" | "createdAt" | "status" | "reviewedAt" | "reviewedBy">
): Promise<ReportDocument> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const newReport: Omit<ReportDocument, "id"> = {
      ...report,
      status: "pending",
      createdAt: Date.now(),
    };

    const docRef = await db.collection(REPORTS_COLLECTION).add(newReport);

    return {
      id: docRef.id,
      ...newReport,
    };
  } catch (error) {
    console.error("Error al crear reporte:", error);
    throw new Error("Error al crear el reporte");
  }
};

/**
 * Obtener reportes (solo para administradores)
 */
export const getReports = async (
  pagination?: PaginationParams,
  status?: "pending" | "reviewed" | "resolved" | "dismissed"
): Promise<PaginationResult<ReportDocument>> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const { page, limit, offset } = normalizePagination(pagination || {});

    let query: FirebaseFirestore.Query = db.collection(REPORTS_COLLECTION);

    if (status) {
      query = query.where("status", "==", status);
    }

    query = query.orderBy("createdAt", "desc");

    // Obtener total
    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;

    // Aplicar paginación
    const snapshot = await query.offset(offset).limit(limit).get();

    const reports: ReportDocument[] = [];
    snapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data(),
      } as ReportDocument);
    });

    return {
      data: reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: offset + limit < total,
        hasPrev: offset > 0,
      },
    };
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    throw new Error("Error al obtener los reportes");
  }
};

/**
 * Actualizar estado de un reporte (solo administradores)
 */
export const updateReportStatus = async (
  reportId: string,
  status: "reviewed" | "resolved" | "dismissed",
  reviewedBy: string
): Promise<ReportDocument> => {
  try {
    if (!db) {
      throw new Error("Firestore no está inicializado");
    }

    const report = await db.collection(REPORTS_COLLECTION).doc(reportId).get();

    if (!report.exists) {
      throw new Error("Reporte no encontrado");
    }

    await db.collection(REPORTS_COLLECTION).doc(reportId).update({
      status,
      reviewedAt: Date.now(),
      reviewedBy,
    });

    const updatedReport = await db.collection(REPORTS_COLLECTION).doc(reportId).get();

    return {
      id: updatedReport.id,
      ...updatedReport.data(),
    } as ReportDocument;
  } catch (error: any) {
    console.error("Error al actualizar reporte:", error);
    throw error;
  }
};

