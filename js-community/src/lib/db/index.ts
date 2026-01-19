/**
 * Database utilities and query helpers
 * Main export file for all database-related functionality
 */

// Error handling
export {
  ConnectionError,
  DatabaseError,
  DuplicateError,
  handleDatabaseError,
  NotFoundError,
  QueryError,
  retryQuery,
  safeQuery,
  TransactionError,
  ValidationError,
} from "./errors";
// Query builders
export {
  buildCountQuery,
  buildDeleteQuery,
  buildInsertQuery,
  buildOrderClause,
  buildPaginationClause,
  buildQuery,
  buildSearchClause,
  buildSelectQuery,
  buildUpdateQuery,
  buildWhereClause,
  createPaginatedResult,
} from "./queries";
// Transaction utilities
export {
  createSavepoint,
  Savepoint,
  TransactionManager,
  transactionBatch,
  transactionManager,
  withSavepoint,
  withTransaction,
} from "./transaction";
// Types
export type {
  FilterOptions,
  OrderOptions,
  PaginationOptions,
  PaginationResult,
  QueryExecutor,
  QueryOptions,
  SearchOptions,
  TransactionCallback,
  TransactionContext,
} from "./types";
