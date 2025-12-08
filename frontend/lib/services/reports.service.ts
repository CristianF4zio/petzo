/**
 * Servicio para gestionar reportes
 */

import api from "../api";

export interface Report {
  id: string;
  reporterId: string;
  type: "pet" | "user" | "message";
  reportedPetId?: string;
  reportedUserId?: string;
  reportedMessageId?: string;
  reason: "spam" | "inappropriate" | "false_information" | "harassment" | "other";
  description: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: number;
  updatedAt: number;
}

export interface CreateReportDto {
  type: "pet" | "user" | "message";
  reportedPetId?: string;
  reportedUserId?: string;
  reportedMessageId?: string;
  reason: "spam" | "inappropriate" | "false_information" | "harassment" | "other";
  description: string;
}

/**
 * Crear un reporte
 */
export const createReport = async (reportData: CreateReportDto): Promise<Report> => {
  try {
    const response = await api.post<{ success: boolean; data: Report }>(
      "/reports",
      reportData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al crear reporte:", error);
    throw error;
  }
};

/**
 * Obtener reportes (solo administradores)
 */
export const getReports = async (
  page: number = 1,
  limit: number = 20,
  status?: "pending" | "reviewed" | "resolved" | "dismissed"
): Promise<{ data: Report[]; pagination: any }> => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (status) params.append("status", status);

    const response = await api.get<{ success: boolean; data: Report[]; pagination: any }>(
      `/reports?${params.toString()}`
    );
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    throw error;
  }
};

/**
 * Actualizar estado de un reporte (solo administradores)
 */
export const updateReportStatus = async (
  id: string,
  status: "reviewed" | "resolved" | "dismissed"
): Promise<Report> => {
  try {
    const response = await api.put<{ success: boolean; data: Report }>(
      `/reports/${id}/status`,
      { status }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al actualizar estado del reporte:", error);
    throw error;
  }
};

