export type TApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T | null;
};

// Shape returned by the backend's GlobalExceptionHandler on any error response.
export type TApiErrorEnvelope = {
  success: false;
  message: string;
  errors: string[];
};

// Mirrors CleanArchitecture.Application.Common.Models.PaginatedList<T> exactly -
// note there is no `pageSize` field on the backend type, only these four.
export type TPaginatedList<T> = {
  items: T[];
  pageNumber: number;
  totalCount: number;
  totalPages: number;
};
