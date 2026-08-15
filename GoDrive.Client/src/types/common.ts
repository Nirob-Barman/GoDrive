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

export type TPaginatedList<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};
