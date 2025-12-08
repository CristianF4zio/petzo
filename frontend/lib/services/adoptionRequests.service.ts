/**
 * Servicio para gestionar solicitudes de adopción
 * Conecta con el backend API
 */

import api from "../api";

export interface AdoptionRequest {
  id: string;
  petId: string;
  requesterId: string;
  ownerId: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  message?: string;
  createdAt: number;
  updatedAt: number;
  respondedAt?: number;
}

export interface CreateAdoptionRequestDto {
  petId: string;
  message?: string;
}

/**
 * Obtener todas las solicitudes del usuario autenticado
 */
export const getAdoptionRequests = async (): Promise<AdoptionRequest[]> => {
  try {
    const response = await api.get<{ success: boolean; data: AdoptionRequest[] }>(
      "/adoption-requests"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    throw error;
  }
};

/**
 * Obtener una solicitud por ID
 */
export const getAdoptionRequestById = async (
  id: string
): Promise<AdoptionRequest> => {
  try {
    const response = await api.get<{ success: boolean; data: AdoptionRequest }>(
      `/adoption-requests/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener solicitud:", error);
    throw error;
  }
};

/**
 * Crear una nueva solicitud de adopción
 */
export const createAdoptionRequest = async (
  requestData: CreateAdoptionRequestDto
): Promise<AdoptionRequest> => {
  try {
    const response = await api.post<{ success: boolean; data: AdoptionRequest }>(
      "/adoption-requests",
      requestData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al crear solicitud:", error);
    throw error;
  }
};

/**
 * Obtener solicitudes recibidas (como propietario)
 */
export const getReceivedAdoptionRequests = async (
  status?: "pending" | "approved" | "rejected" | "cancelled"
): Promise<AdoptionRequest[]> => {
  try {
    const params = status ? { status } : {};
    const response = await api.get<{ success: boolean; data: AdoptionRequest[]; count: number }>(
      "/adoption-requests/received",
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener solicitudes recibidas:", error);
    throw error;
  }
};

/**
 * Obtener mis solicitudes (como solicitante)
 */
export const getMyAdoptionRequests = async (): Promise<AdoptionRequest[]> => {
  try {
    const response = await api.get<{ success: boolean; data: AdoptionRequest[]; count: number }>(
      "/adoption-requests/my-requests"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener mis solicitudes:", error);
    throw error;
  }
};

/**
 * Actualizar el estado de una solicitud de adopción
 */
export const updateAdoptionRequestStatus = async (
  id: string,
  status: "approved" | "rejected" | "cancelled"
): Promise<AdoptionRequest> => {
  try {
    const response = await api.put<{ success: boolean; data: AdoptionRequest; message: string }>(
      `/adoption-requests/${id}/status`,
      { status }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error al actualizar solicitud:", error);
    throw error;
  }
};

