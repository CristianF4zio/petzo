/**
 * Cliente API para comunicarse con el backend
 * Maneja las peticiones HTTP y el token de autenticación
 */

import axios, { AxiosInstance, AxiosError } from "axios";
import { auth } from "./firebaseClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Crear instancia de axios
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token de autenticación a cada request
api.interceptors.request.use(
  async (config) => {
    // Obtener el usuario actual
    const user = auth.currentUser;

    if (user) {
      try {
        // Obtener el ID Token de Firebase
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error al obtener token:", error);
      }
    }

    // Si es FormData, eliminar Content-Type para que axios lo establezca automáticamente
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      console.error("Error de autenticación");
      // Opcional: redirigir al login
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

