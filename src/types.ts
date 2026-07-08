/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Trade {
  tradeId: string;
  stockName: string;
  quantity: number;
  price: number;
}

export type ComparisonStatus = 'match' | 'mismatch' | 'missing';

export interface ReconciliationResult {
  tradeId: string;
  stockName: string;
  ourQty: number;
  clientQty?: number;
  ourPrice: number;
  clientPrice?: number;
  status: ComparisonStatus;
  reason: string;
}
