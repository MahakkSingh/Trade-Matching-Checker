/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ReconciliationResult } from '../types';
import { Search, CheckCircle, AlertTriangle, HelpCircle, FileX, ArrowRight, RefreshCw } from 'lucide-react';

interface ReconciliationTablesProps {
  reconciliation: ReconciliationResult[];
  activeFilter: 'all' | 'match' | 'mismatch' | 'missing';
  onReset: () => void;
}

export function ReconciliationTables({
  reconciliation,
  activeFilter,
  onReset
}: ReconciliationTablesProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter reconciliation entries based on selected tab and search query
  const filteredData = reconciliation.filter(item => {
    const matchesSearch = 
      item.tradeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.stockName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    return item.status === activeFilter && matchesSearch;
  });

  // Count each category within current results
  const matchedCount = reconciliation.filter(i => i.status === 'match').length;
  const mismatchedCount = reconciliation.filter(i => i.status === 'mismatch').length;
  const missingCount = reconciliation.filter(i => i.status === 'missing').length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
      {/* Header bar with filters and search */}
      <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            Reconciliation Report
            <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
              {filteredData.length}/{reconciliation.length}
            </span>
          </h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Internal Trade ID join comparison results
          </p>
        </div>

        {/* Search Input and action */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
              <Search className="h-3 w-3" />
            </span>
            <input
              type="text"
              placeholder="Search ID/ticker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded focus:outline-hidden focus:ring-1 focus:ring-slate-400 text-slate-900 dark:text-white font-medium"
            />
          </div>
          {reconciliation.length === 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              Reset Data
            </button>
          )}
        </div>
      </div>

      {/* Main Table view */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/75 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              <th className="py-2 px-3 font-semibold">Trade ID</th>
              <th className="py-2 px-3 font-semibold">Symbol</th>
              <th className="py-2 px-3 text-right font-semibold">Internal Ledger</th>
              <th className="py-2 px-3 text-right font-semibold">Client Ledger</th>
              <th className="py-2 px-4 font-semibold">Discrepancy / Audit Reason</th>
              <th className="py-2 px-3 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
            <AnimatePresence mode="popLayout">
              {filteredData.length === 0 ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <HelpCircle className="h-5 w-5 text-slate-300" />
                      <p className="font-semibold text-slate-600 dark:text-slate-300">No matching records found</p>
                      <p className="text-[10px] text-slate-400">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                filteredData.map((item, idx) => {
                  const isMatch = item.status === 'match';
                  const isMismatch = item.status === 'mismatch';
                  const isMissing = item.status === 'missing';

                  // Dynamic styles for status cell
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                      Matched
                    </span>
                  );
                  if (isMismatch) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                        Mismatch
                      </span>
                    );
                  } else if (isMissing) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                        Missing
                      </span>
                    );
                  }

                  // Find if individual fields mismatched
                  const qtyMismatch = isMismatch && item.ourQty !== item.clientQty;
                  const priceMismatch = isMismatch && item.ourPrice !== item.clientPrice;

                  return (
                    <motion.tr
                      key={item.tradeId}
                      initial={{ opacity: 0, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -2 }}
                      transition={{ duration: 0.15, delay: Math.min(idx * 0.01, 0.2) }}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors ${
                        isMatch ? 'bg-emerald-50/20' : isMismatch ? 'bg-rose-50/20' : 'bg-amber-50/20'
                      }`}
                    >
                      {/* Trade ID */}
                      <td className="py-1.5 px-3 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {item.tradeId}
                      </td>

                      {/* Stock Name */}
                      <td className="py-1.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {item.stockName}
                      </td>

                      {/* Our Ledger details */}
                      <td className="py-1.5 px-3 text-right">
                        <div className="font-mono text-xs text-slate-800 dark:text-slate-200">
                          {item.ourQty} <span className="text-[10px] text-slate-400">shares</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          ${item.ourPrice.toFixed(2)}
                        </div>
                      </td>

                      {/* Client Ledger details */}
                      <td className="py-1.5 px-3 text-right">
                        {isMissing ? (
                          <span className="text-[10px] text-slate-400 dark:text-slate-600 italic">
                            Null
                          </span>
                        ) : (
                          <>
                            <div className={`font-mono text-xs ${
                              qtyMismatch ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-100/50 dark:bg-rose-950/40 px-1 rounded-sm' : 'text-slate-800 dark:text-slate-200'
                            }`}>
                              {item.clientQty} <span className="text-[10px] text-slate-400">shares</span>
                            </div>
                            <div className={`text-[10px] font-mono ${
                              priceMismatch ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-100/50 dark:bg-rose-950/40 px-1 rounded-sm' : 'text-slate-500'
                            }`}>
                              ${item.clientPrice?.toFixed(2)}
                            </div>
                          </>
                        )}
                      </td>

                      {/* Explanation Reason Column */}
                      <td className="py-1.5 px-4">
                        {isMatch && (
                          <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 text-[11px] leading-tight font-medium">
                            <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                            Verified alignment: price & quantity check passed
                          </div>
                        )}
                        {isMismatch && (
                          <div className="text-rose-800 dark:text-rose-300 text-[11px] leading-tight space-y-0.5">
                            <div className="flex items-center gap-1.5 font-medium">
                              <span className="w-1 h-1 bg-rose-500 rounded-full"></span>
                              <span>{item.reason}</span>
                            </div>
                          </div>
                        )}
                        {isMissing && (
                          <div className="text-amber-800 dark:text-amber-300 text-[11px] leading-tight space-y-0.5">
                            <div className="flex items-center gap-1.5 font-medium">
                              <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                              <span>Trade omitted from statement</span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="py-1.5 px-3 text-right whitespace-nowrap">
                        {statusBadge}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mini Legend / Footer */}
      <div className="p-2 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            Matched: {matchedCount}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            Mismatched: {mismatchedCount}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            Missing: {missingCount}
          </span>
        </div>
        <div>
          precision: 100% Join
        </div>
      </div>
    </div>
  );
}
