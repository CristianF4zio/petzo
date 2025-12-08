/**
 * Tipos para paginación
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

/**
 * Normalizar parámetros de paginación
 */
export const normalizePagination = (
  params: PaginationParams
): { page: number; limit: number; offset: number } => {
  const page = Math.max(1, params.page || DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, params.limit || DEFAULT_LIMIT));
  const offset = params.offset !== undefined ? params.offset : (page - 1) * limit;

  return { page, limit, offset };
};

