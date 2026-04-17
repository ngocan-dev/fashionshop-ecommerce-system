export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ApiListResponse<T> = {
  items: T[];
  total: number;
  page?: number;
  size?: number;
};

export type PaginationParams = {
  page?: number;
  size?: number;
};
