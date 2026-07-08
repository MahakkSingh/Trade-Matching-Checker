/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Trade, ReconciliationResult } from '../types';

// A pre-defined list of stable stock tickers and company names to generate realistic trades.
const STOCKS = [
  { ticker: 'AAPL', name: 'Apple Inc.' },
  { ticker: 'MSFT', name: 'Microsoft Corp.' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.' },
  { ticker: 'TSLA', name: 'Tesla Inc.' },
  { ticker: 'META', name: 'Meta Platforms Inc.' },
  { ticker: 'NFLX', name: 'Netflix Inc.' },
  { ticker: 'AMD', name: 'Advanced Micro Devices' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
  { ticker: 'V', name: 'Visa Inc.' },
  { ticker: 'DIS', name: 'The Walt Disney Co.' },
  { ticker: 'NKE', name: 'Nike Inc.' },
  { ticker: 'WMT', name: 'Walmart Inc.' },
  { ticker: 'COIN', name: 'Coinbase Global' }
];

/**
 * Generates 40 standard, realistic trades for "Our Records" (Internal Ledger).
 * Trades are numbered sequentially with ID T1001 to T1040.
 */
export function generateOurRecords(): Trade[] {
  const records: Trade[] = [];
  
  for (let i = 1; i <= 40; i++) {
    const id = `T${1000 + i}`;
    // Select stock deterministically using index to avoid chaotic re-renders
    const stockInfo = STOCKS[(i - 1) % STOCKS.length];
    
    // Generate simple quantities (multiples of 50 or 100)
    const quantity = ((i * 3) % 8 + 1) * 50; 
    
    // Generate realistic prices with decimal parts
    const basePrice = 45 + (i * 12.5) % 350;
    const price = Math.round(basePrice * 100) / 100;

    records.push({
      tradeId: id,
      stockName: stockInfo.ticker,
      quantity,
      price
    });
  }
  
  return records;
}

/**
 * Generates "Client Records" by cloning Our Records, but:
 * 1. Completely removing exactly 3 trades (T1005, T1018, T1032).
 * 2. Changing Quantity or Price for about 8 trades to simulate matching mismatches.
 */
export function generateClientRecords(ourRecords: Trade[]): Trade[] {
  // Deep copy the original ledger records so we do not mutate them directly
  const records: Trade[] = ourRecords.map(t => ({ ...t }));
  
  // 1. Remove 3 specific trades completely
  const idsToRemove = ['T1005', 'T1018', 'T1032'];
  const filtered = records.filter(t => !idsToRemove.includes(t.tradeId));
  
  // 2. Introduce exactly 8 mismatches in quantities, prices, or both
  return filtered.map(trade => {
    switch (trade.tradeId) {
      // 3 Quantity mismatches
      case 'T1002':
        return { ...trade, quantity: trade.quantity + 50 }; // Qty mismatch
      case 'T1015':
        return { ...trade, quantity: trade.quantity - 100 }; // Qty mismatch
      case 'T1027':
        return { ...trade, quantity: trade.quantity + 200 }; // Qty mismatch
        
      // 3 Price mismatches
      case 'T1008':
        return { ...trade, price: Math.round((trade.price + 5.75) * 100) / 100 }; // Price mismatch
      case 'T1022':
        return { ...trade, price: Math.round((trade.price - 12.50) * 100) / 100 }; // Price mismatch
      case 'T1035':
        return { ...trade, price: Math.round((trade.price + 1.20) * 100) / 100 }; // Price mismatch
        
      // 2 Quantity & Price double mismatches
      case 'T1012':
        return { 
          ...trade, 
          quantity: trade.quantity + 10, 
          price: Math.round((trade.price - 3.40) * 100) / 100 
        };
      case 'T1039':
        return { 
          ...trade, 
          quantity: trade.quantity * 2, 
          price: Math.round((trade.price + 15.00) * 100) / 100 
        };
        
      default:
        // No modifications for all other 27 trades
        return trade;
    }
  });
}

/**
 * RECONCILIATION LOGIC EXPLAINED IN PLAIN ENGLISH:
 * 
 * 1. We start by looking at every trade recorded on "Our" side.
 * 2. For each trade, we search the "Client" records for a trade with the matching Trade ID.
 * 3. Case A (MISSING): If no trade with that ID is found in the Client records, we mark it
 *    as "Missing from Client Records".
 * 4. Case B (MATCH): If the trade exists on both sides, we check if the quantities and 
 *    prices are identical. If both match, we mark it as a "Perfect Match".
 * 5. Case C (MISMATCH): If the trade exists on both sides, but either the quantity or 
 *    the price (or both) do not match, we flag it as a "Mismatch" and construct a detailed 
 *    description of exactly what is wrong (e.g., "Quantity Mismatch: 150 vs 200").
 */
export function reconcileTrades(ourRecords: Trade[], clientRecords: Trade[]): ReconciliationResult[] {
  const results: ReconciliationResult[] = [];
  
  // Create a map of Client Records indexed by Trade ID for O(1) fast lookup.
  const clientMap = new Map<string, Trade>();
  clientRecords.forEach(t => clientMap.set(t.tradeId, t));
  
  ourRecords.forEach(ourTrade => {
    const clientTrade = clientMap.get(ourTrade.tradeId);
    
    // Case A: Missing trade
    if (!clientTrade) {
      results.push({
        tradeId: ourTrade.tradeId,
        stockName: ourTrade.stockName,
        ourQty: ourTrade.quantity,
        ourPrice: ourTrade.price,
        status: 'missing',
        reason: 'Trade ID is absent in client ledger'
      });
      return;
    }
    
    const qtyMatches = ourTrade.quantity === clientTrade.quantity;
    const priceMatches = Math.abs(ourTrade.price - clientTrade.price) < 0.001;
    
    // Case B: Perfect Match
    if (qtyMatches && priceMatches) {
      results.push({
        tradeId: ourTrade.tradeId,
        stockName: ourTrade.stockName,
        ourQty: ourTrade.quantity,
        clientQty: clientTrade.quantity,
        ourPrice: ourTrade.price,
        clientPrice: clientTrade.price,
        status: 'match',
        reason: 'Perfect Match'
      });
    } else {
      // Case C: Mismatch
      let reason = '';
      if (!qtyMatches && !priceMatches) {
        reason = `Both Mismatch: Qty ${ourTrade.quantity} vs ${clientTrade.quantity}, Price $${ourTrade.price.toFixed(2)} vs $${clientTrade.price.toFixed(2)}`;
      } else if (!qtyMatches) {
        reason = `Quantity Mismatch: ${ourTrade.quantity} vs ${clientTrade.quantity}`;
      } else {
        reason = `Price Mismatch: $${ourTrade.price.toFixed(2)} vs $${clientTrade.price.toFixed(2)}`;
      }
      
      results.push({
        tradeId: ourTrade.tradeId,
        stockName: ourTrade.stockName,
        ourQty: ourTrade.quantity,
        clientQty: clientTrade.quantity,
        ourPrice: ourTrade.price,
        clientPrice: clientTrade.price,
        status: 'mismatch',
        reason: reason
      });
    }
  });
  
  return results;
}
