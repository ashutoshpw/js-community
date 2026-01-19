/**
 * Query builder helpers for database operations
 * Inspired by mini_sql from Discourse
 */

import type {
  FilterOptions,
  OrderOptions,
  PaginationOptions,
  PaginationResult,
  QueryOptions,
  SearchOptions,
} from "./types";

/**
 * Build WHERE clause from filter options
 */
export function buildWhereClause(
  filters: FilterOptions[],
  paramOffset = 0,
): { clause: string; params: unknown[] } {
  if (!filters || filters.length === 0) {
    return { clause: "", params: [] };
  }

  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = paramOffset;

  for (const filter of filters) {
    paramIndex++;
    const placeholder = `$${paramIndex}`;

    switch (filter.operator) {
      case "eq":
        conditions.push(`${filter.field} = ${placeholder}`);
        params.push(filter.value);
        break;
      case "neq":
        conditions.push(`${filter.field} != ${placeholder}`);
        params.push(filter.value);
        break;
      case "gt":
        conditions.push(`${filter.field} > ${placeholder}`);
        params.push(filter.value);
        break;
      case "gte":
        conditions.push(`${filter.field} >= ${placeholder}`);
        params.push(filter.value);
        break;
      case "lt":
        conditions.push(`${filter.field} < ${placeholder}`);
        params.push(filter.value);
        break;
      case "lte":
        conditions.push(`${filter.field} <= ${placeholder}`);
        params.push(filter.value);
        break;
      case "like":
        conditions.push(`${filter.field} LIKE ${placeholder}`);
        params.push(filter.value);
        break;
      case "in":
        if (Array.isArray(filter.value) && filter.value.length > 0) {
          const placeholders = filter.value
            .map((_, i) => `$${paramIndex + i}`)
            .join(", ");
          conditions.push(`${filter.field} IN (${placeholders})`);
          params.push(...filter.value);
          paramIndex += filter.value.length - 1; // Adjust for additional placeholders
        }
        break;
      case "nin":
        if (Array.isArray(filter.value) && filter.value.length > 0) {
          const placeholders = filter.value
            .map((_, i) => `$${paramIndex + i}`)
            .join(", ");
          conditions.push(`${filter.field} NOT IN (${placeholders})`);
          params.push(...filter.value);
          paramIndex += filter.value.length - 1; // Adjust for additional placeholders
        }
        break;
    }
  }

  return {
    clause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
}

/**
 * Build ORDER BY clause from order options
 */
export function buildOrderClause(orders: OrderOptions[]): string {
  if (!orders || orders.length === 0) {
    return "";
  }

  const orderClauses = orders.map(
    (order) => `${order.field} ${order.direction.toUpperCase()}`,
  );

  return `ORDER BY ${orderClauses.join(", ")}`;
}

/**
 * Build search WHERE clause
 */
export function buildSearchClause(
  search: SearchOptions,
  paramOffset = 0,
): { clause: string; params: unknown[] } {
  if (!search || !search.fields || search.fields.length === 0) {
    return { clause: "", params: [] };
  }

  const searchPattern = `%${search.query}%`;
  const conditions = search.fields.map(
    (field) => `${field} LIKE $${paramOffset + 1}`,
  );

  return {
    clause: `(${conditions.join(" OR ")})`,
    params: [searchPattern],
  };
}

/**
 * Build LIMIT and OFFSET clause from pagination options
 */
export function buildPaginationClause(
  pagination: PaginationOptions,
  paramOffset = 0,
): { clause: string; params: unknown[] } {
  const offset = (pagination.page - 1) * pagination.perPage;
  const limit = pagination.perPage;

  return {
    clause: `LIMIT $${paramOffset + 1} OFFSET $${paramOffset + 2}`,
    params: [limit, offset],
  };
}

/**
 * Build complete query from options
 */
export function buildQuery(
  baseQuery: string,
  options: QueryOptions = {},
): { query: string; params: unknown[] } {
  let query = baseQuery;
  const params: unknown[] = [];
  let paramOffset = 0;

  // Add search clause
  if (options.search) {
    const { clause, params: searchParams } = buildSearchClause(
      options.search,
      paramOffset,
    );
    if (clause) {
      query += ` WHERE ${clause}`;
      params.push(...searchParams);
      paramOffset += searchParams.length;
    }
  }

  // Add filter clause
  if (options.filters) {
    const { clause, params: filterParams } = buildWhereClause(
      options.filters,
      paramOffset,
    );
    if (clause) {
      query += options.search
        ? ` AND ${clause.replace("WHERE ", "")}`
        : ` ${clause}`;
      params.push(...filterParams);
      paramOffset += filterParams.length;
    }
  }

  // Add order clause
  if (options.order) {
    const orderClause = buildOrderClause(options.order);
    if (orderClause) {
      query += ` ${orderClause}`;
    }
  }

  // Add pagination clause
  if (options.pagination) {
    const { clause, params: paginationParams } = buildPaginationClause(
      options.pagination,
      paramOffset,
    );
    query += ` ${clause}`;
    params.push(...paginationParams);
  }

  return { query, params };
}

/**
 * Create a paginated result
 */
export function createPaginatedResult<T>(
  data: T[],
  total: number,
  pagination: PaginationOptions,
): PaginationResult<T> {
  const totalPages = Math.ceil(total / pagination.perPage);

  return {
    data,
    pagination: {
      page: pagination.page,
      perPage: pagination.perPage,
      total,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    },
  };
}

/**
 * Helper to build INSERT query
 */
export function buildInsertQuery(
  table: string,
  data: Record<string, unknown>,
): { query: string; params: unknown[] } {
  const fields = Object.keys(data);
  const values = Object.values(data);
  const placeholders = fields.map((_, i) => `$${i + 1}`).join(", ");

  return {
    query: `INSERT INTO ${table} (${fields.join(", ")}) VALUES (${placeholders}) RETURNING *`,
    params: values,
  };
}

/**
 * Helper to build UPDATE query
 */
export function buildUpdateQuery(
  table: string,
  data: Record<string, unknown>,
  filters: FilterOptions[],
): { query: string; params: unknown[] } {
  const fields = Object.keys(data);
  const values = Object.values(data);
  const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(", ");

  const { clause: whereClause, params: whereParams } = buildWhereClause(
    filters,
    fields.length,
  );

  return {
    query: `UPDATE ${table} SET ${setClause} ${whereClause} RETURNING *`,
    params: [...values, ...whereParams],
  };
}

/**
 * Helper to build DELETE query
 */
export function buildDeleteQuery(
  table: string,
  filters: FilterOptions[],
): { query: string; params: unknown[] } {
  const { clause: whereClause, params } = buildWhereClause(filters);

  return {
    query: `DELETE FROM ${table} ${whereClause}`,
    params,
  };
}

/**
 * Helper to build SELECT query with common patterns
 */
export function buildSelectQuery(
  table: string,
  options: QueryOptions & { fields?: string[] } = {},
): { query: string; params: unknown[] } {
  const fields = options.fields?.join(", ") || "*";
  const baseQuery = `SELECT ${fields} FROM ${table}`;

  return buildQuery(baseQuery, options);
}

/**
 * Helper to count total records
 */
export function buildCountQuery(
  table: string,
  options: Omit<QueryOptions, "pagination" | "order"> = {},
): { query: string; params: unknown[] } {
  const baseQuery = `SELECT COUNT(*) as count FROM ${table}`;
  const { filters, search } = options;

  return buildQuery(baseQuery, { filters, search });
}
