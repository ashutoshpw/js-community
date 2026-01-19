/**
 * Transaction utilities for database operations
 */

import { safeQuery, TransactionError } from "./errors";
import type { TransactionCallback, TransactionContext } from "./types";

/**
 * Transaction manager for handling database transactions
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
 * Create a savepoint within a transaction
 */
export class Savepoint {
  constructor(
    public readonly name: string,
    public readonly txId: string,
  ) {}

  /**
   * Rollback to this savepoint
   */
  async rollback(): Promise<void> {
    if (!transactionManager.isActive(this.txId)) {
      throw new TransactionError(`Transaction ${this.txId} is not active`);
    }
    // Implementation would execute ROLLBACK TO SAVEPOINT in actual DB
    // This is a placeholder for the abstraction
  }

  /**
   * Release this savepoint
   */
  async release(): Promise<void> {
    if (!transactionManager.isActive(this.txId)) {
      throw new TransactionError(`Transaction ${this.txId} is not active`);
    }
    // Implementation would execute RELEASE SAVEPOINT in actual DB
    // This is a placeholder for the abstraction
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
