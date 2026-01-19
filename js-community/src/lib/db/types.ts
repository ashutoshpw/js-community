/**
 * Database utility types and interfaces
 */

export interface PaginationOptions {
  page: number;
  perPage: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FilterOptions {
  field: string;
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "like" | "in" | "nin";
  value: unknown;
}

export interface OrderOptions {
  field: string;
  direction: "asc" | "desc";
}

export interface SearchOptions {
  query: string;
  fields: string[];
}

export interface QueryOptions {
  filters?: FilterOptions[];
  order?: OrderOptions[];
  pagination?: PaginationOptions;
  search?: SearchOptions;
}

export interface TransactionContext {
  id: string;
  isActive: boolean;
}

export type QueryExecutor<T = unknown> = (
  sql: string,
  params?: unknown[],
) => Promise<T>;
export type TransactionCallback<T> = (tx: TransactionContext) => Promise<T>;
