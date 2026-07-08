/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, CheckCircle, AlertTriangle, FileX, ShieldCheck } from 'lucide-react';

export function ExplanationCard() {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs">
      <h3 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
        <HelpCircle className="h-5 w-5 text-indigo-500" />
        Plain English Comparison & Reconciliation Logic
      </h3>
      
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        Reconciliation is the heartbeat of middle-office operations. This system automates the process of aligning internally recorded bookings with external client statements. Below is a breakdown of the comparison logic used to compute results.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Rule 1: Match */}
        <div className="space-y-2 border-l-2 border-emerald-400 pl-4 py-1">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Rule 1: Perfect Alignment
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The trade exists in both <strong>Our Records</strong> and the <strong>Client Statement</strong>. Both lists agree exactly on <strong>Quantity</strong> and <strong>Price</strong>. 
          </p>
          <span className="inline-block text-[10px] font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-sm">
            Status: Matched (Green)
          </span>
        </div>

        {/* Rule 2: Mismatch */}
        <div className="space-y-2 border-l-2 border-rose-400 pl-4 py-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Rule 2: Value Discrepancy
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The trade shares the same <strong>Trade ID</strong>, but the files differ on either the <strong>Quantity</strong> of shares, the trade <strong>Price</strong>, or both.
          </p>
          <span className="inline-block text-[10px] font-semibold text-rose-800 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-sm">
            Status: Mismatched (Red)
          </span>
        </div>

        {/* Rule 3: Missing */}
        <div className="space-y-2 border-l-2 border-amber-400 pl-4 py-1">
          <div className="flex items-center gap-2">
            <FileX className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Rule 3: Omission Search
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            A trade exists on our internal ledger, but the <strong>Trade ID</strong> is completely absent from the statement provided by the counterparty client.
          </p>
          <span className="inline-block text-[10px] font-semibold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-sm">
            Status: Missing (Amber)
          </span>
        </div>

      </div>

      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-indigo-500" />
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Real-time Calculation Engine Active
          </span>
        </div>
        <span>
          Precision: Absolute Match (Margin &lt; 0.001)
        </span>
      </div>
    </div>
  );
}
