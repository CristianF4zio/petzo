/**
 * Tipos para filtros de búsqueda
 */

export interface PetFilters {
  type?: "dog" | "cat";
  city?: string;
  ownerId?: string;
  status?: "available" | "adopted" | "pending";
  sex?: "male" | "female";
  size?: "small" | "medium" | "large";
  minAge?: number;
  maxAge?: number;
  search?: string; // Búsqueda por texto en name y description
  minDate?: number; // Timestamp mínimo
  maxDate?: number; // Timestamp máximo
}

