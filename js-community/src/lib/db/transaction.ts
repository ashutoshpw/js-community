/**
 * Transaction utilities for database operations
 *
 * NOTE: This module provides transaction state management and helper functions.
 * The actual BEGIN, COMMIT, and ROLLBACK SQL statements must be executed by
 * your database client implementation. This abstraction provides:
 * - Transaction context tracking
 * - Automatic commit/rollback patterns
 * - Error handling wrappers
 *
 * Example integration with a database client:
 * ```typescript
 * async function withDatabaseTransaction<T>(callback: (tx: TransactionContext) => Promise<T>) {
 *   const tx = await transactionManager.begin();
 *   await db.query('BEGIN');
 *
 *   try {
 *     const result = await callback(tx);
 *     await db.query('COMMIT');
 *     await transactionManager.commit(tx.id);
 *     return result;
 *   } catch (error) {
 *     await db.query('ROLLBACK');
 *     await transactionManager.rollback(tx.id);
 *     throw error;
 *   }
 * }
 * ```
 */

import { safeQuery, TransactionError } from "./errors";
import type { TransactionCallback, TransactionContext } from "./types";

/**
 * Transaction manager for handling database transactions
 *
 * This class manages transaction state and provides a consistent API for
 * transaction operations. It does NOT execute SQL statements - that must
 * be done by your database client implementation.
 */
export class TransactionManager {
  private activeTransactions = new Map<string, TransactionContext>();

  /**
   * Generate a unique transaction ID
   */
  private generateTransactionId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Begin a new transaction
   *
   * NOTE: This only creates a transaction context. You must execute
   * the actual BEGIN statement using your database client.
   */
  async begin(): Promise<TransactionContext> {
    const id = this.generateTransactionId();
    const context: TransactionContext = {
      id,
      isActive: true,
    };

    this.activeTransactions.set(id, context);
    return context;
  }

  /**
   * Commit a transaction
   *
   * NOTE: This only updates transaction state. You must execute
   * the actual COMMIT statement using your database client.
   */
  async commit(txId: string): Promise<void> {
    const tx = this.activeTransactions.get(txId);
    if (!tx) {
      throw new TransactionError(`Transaction ${txId} not found`);
    }

    if (!tx.isActive) {
      throw new TransactionError(`Transaction ${txId} is not active`);
    }

    tx.isActive = false;
    this.activeTransactions.delete(txId);
  }

  /**
   * Rollback a transaction
   *
   * NOTE: This only updates transaction state. You must execute
   * the actual ROLLBACK statement using your database client.
   */
  async rollback(txId: string): Promise<void> {
    const tx = this.activeTransactions.get(txId);
    if (!tx) {
      throw new TransactionError(`Transaction ${txId} not found`);
    }

    tx.isActive = false;
    this.activeTransactions.delete(txId);
  }

  /**
   * Check if a transaction is active
   */
  isActive(txId: string): boolean {
    const tx = this.activeTransactions.get(txId);
    return tx?.isActive ?? false;
  }

  /**
   * Get active transaction count
   */
  getActiveCount(): number {
    return this.activeTransactions.size;
  }

  /**
   * Get all active transaction IDs
   */
  getActiveTransactionIds(): string[] {
    return Array.from(this.activeTransactions.keys());
  }
}

/**
 * Global transaction manager instance
 */
export const transactionManager = new TransactionManager();

/**
 * Execute a function within a transaction
 * Automatically handles commit/rollback
 *
 * NOTE: This is a state management helper. For actual database transactions,
 * you need to wrap this with your database client's BEGIN/COMMIT/ROLLBACK
 * statements. See the module documentation for integration examples.
 *
 * This function is useful for:
 * - Tracking transaction state
 * - Automatic rollback on error
 * - Consistent error handling
 */
export async function withTransaction<T>(
  callback: TransactionCallback<T>,
): Promise<T> {
  const tx = await transactionManager.begin();

  try {
    const result = await safeQuery(() => callback(tx));
    await transactionManager.commit(tx.id);
    return result;
  } catch (error) {
    await transactionManager.rollback(tx.id);
    throw error;
  }
}

/**
 * Execute multiple operations in a transaction
 */
export async function transactionBatch<T>(
  operations: Array<(tx: TransactionContext) => Promise<T>>,
): Promise<T[]> {
  return withTransaction(async (tx) => {
    const results: T[] = [];
    for (const operation of operations) {
      const result = await operation(tx);
      results.push(result);
    }
    return results;
  });
}

/**
 * Savepoint for nested transaction control
 *
 * NOTE: This is a state management helper. The actual SAVEPOINT, ROLLBACK TO SAVEPOINT,
 * and RELEASE SAVEPOINT SQL statements must be executed by your database client.
 *
 * Example integration:
 * ```typescript
 * const savepoint = new Savepoint('sp1', tx.id);
 * await db.query(`SAVEPOINT ${savepoint.name}`);
 * try {
 *   // ... operations
 *   await db.query(`RELEASE SAVEPOINT ${savepoint.name}`);
 * } catch (error) {
 *   await db.query(`ROLLBACK TO SAVEPOINT ${savepoint.name}`);
 *   throw error;
 * }
 * ```
 */
export class Savepoint {
  constructor(
    public readonly name: string,
    public readonly txId: string,
  ) {}

  /**
   * Rollback to this savepoint
   *
   * NOTE: This validates transaction state but does NOT execute SQL.
   * You must execute `ROLLBACK TO SAVEPOINT ${name}` using your database client.
   */
  async rollback(): Promise<void> {
    if (!transactionManager.isActive(this.txId)) {
      throw new TransactionError(`Transaction ${this.txId} is not active`);
    }
    // Actual SQL execution must be done by the caller:
    // await db.query(`ROLLBACK TO SAVEPOINT ${this.name}`);
  }

  /**
   * Release this savepoint
   *
   * NOTE: This validates transaction state but does NOT execute SQL.
   * You must execute `RELEASE SAVEPOINT ${name}` using your database client.
   */
  async release(): Promise<void> {
    if (!transactionManager.isActive(this.txId)) {
      throw new TransactionError(`Transaction ${this.txId} is not active`);
    }
    // Actual SQL execution must be done by the caller:
    // await db.query(`RELEASE SAVEPOINT ${this.name}`);
  }
}

/**
 * Create a savepoint within a transaction
 */
export async function createSavepoint(
  tx: TransactionContext,
  name: string,
): Promise<Savepoint> {
  if (!transactionManager.isActive(tx.id)) {
    throw new TransactionError(`Transaction ${tx.id} is not active`);
  }

  return new Savepoint(name, tx.id);
}

/**
 * Execute a callback with automatic savepoint handling
 */
export async function withSavepoint<T>(
  tx: TransactionContext,
  name: string,
  callback: (savepoint: Savepoint) => Promise<T>,
): Promise<T> {
  const savepoint = await createSavepoint(tx, name);

  try {
    const result = await callback(savepoint);
    await savepoint.release();
    return result;
  } catch (error) {
    await savepoint.rollback();
    throw error;
  }
}
