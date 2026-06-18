// core/models/api-response.model.ts
// Generic wrapper for all API responses
export interface ApiResponse<T> {
  data:    T;
  message: string;
  success: boolean;
}

export interface PaginatedResult<T> {
  data:        T[];
  totalCount:  number;
  page:        number;
  pageSize:    number;
  totalPages:  number;
}