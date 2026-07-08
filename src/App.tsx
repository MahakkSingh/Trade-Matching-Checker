/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  FileQuestion, 
  Layers, 
  Coins, 
  HelpCircle, 
  RefreshCw,
  Sparkles,
  ExternalLink,
  BookOpen
} from 'lucide-react';

import { Trade } from './types';
import { 
  generateOurRecords, 
  generateClientRecords, 
  reconcileTrades 
} from './utils/reconciliation';

import { MetricCard } from './components/MetricCard';
import { ReconciliationTables } from './components/ReconciliationTables';
import { LedgerTables } from './components/LedgerTables';
import { ExplanationCard } from './components/ExplanationCard';

export default function App() {
  // Generate the initial dataset once on component mount
  const defaultOurRecords = useMemo(() => generateOurRecords(), []);
  const defaultClientRecords = useMemo(() => generateClientRecords(defaultOurRecords), [defaultOurRecords]);

  // Main state for the application ledgers
  const [ourRecords, setOurRecords] = useState<Trade[]>(defaultOurRecords);
  const [clientRecords, setClientRecords] = useState<Trade[]>(defaultClientRecords);

  // Active view tab: 'report' is the primary comparison output, 'ledgers' is the raw data inputs
  const [activeView, setActiveView] = useState<'report' | 'ledgers'>('report');

  // Filter state for the reconciliation results
  const [reportFilter, setReportFilter] = useState<'all' | 'match' | 'mismatch' | 'missing'>('all');

  // Calculate reconciliation on state changes
  const reconciliationResults = useMemo(() => {
    return reconcileTrades(ourRecords, clientRecords);
  }, [ourRecords, clientRecords]);

  // Statistics summaries
  const stats = useMemo(() => {
    const matched = reconciliationResults.filter(r => r.status === 'match').length;
    const mismatched = reconciliationResults.filter(r => r.status === 'mismatch').length;
    const missing = reconciliationResults.filter(r => r.status === 'missing').length;
    return { matched, mismatched, missing };
  }, [reconciliationResults]);

  // Utility actions
  const resetToDefaultDemo = () => {
    setOurRecords(defaultOurRecords);
    setClientRecords(defaultClientRecords);
    setReportFilter('all');
  };

  const makeAllMatch = () => {
    // Clone our records exactly to client side to simulate a perfectly clean reconciliation
    const perfectClientRecords = ourRecords.map(t => ({ ...t }));
    setClientRecords(perfectClientRecords);
    setReportFilter('match');
  };

  const scrambleRecords = () => {
    // Randomly change a few items for fun interactive testing
    const scrambled = clientRecords.map(t => {
      const rand = Math.random();
      if (rand < 0.15) {
        // Change quantity
        return { ...t, quantity: Math.max(10, t.quantity + (Math.random() < 0.5 ? 50 : -50)) };
      } else if (rand < 0.3) {
        // Change price
        return { ...t, price: Math.max(1, Math.round((t.price + (Math.random() * 20 - 10)) * 100) / 100) };
      }
      return t;
    });
    setClientRecords(scrambled);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] dark:bg-[#020617] dark:text-[#f8fafc] font-sans selection:bg-indigo-500/10 selection:text-indigo-900">
      <div className="max-w-7xl mx-auto px-4 py-5 space-y-5">
        
        {/* TOP HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="p-0.5 bg-indigo-600 rounded text-white">
                <Coins className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                Bilateral Reconciliation Engine
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              Trade Matching Checker
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl font-sans">
              Compare and audit trade records between Internal Books and Client Statements. Detect discrepant quantities, rates, and booking gaps.
            </p>
          </div>

          {/* QUICK DEMO CONTROLS */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
            <button
              onClick={resetToDefaultDemo}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded font-bold uppercase tracking-wider transition-all cursor-pointer"
              title="Restores the exact 40 trades, with 8 mismatches and 3 missing trades"
            >
              <RefreshCw className="h-3 w-3" />
              Reset Demo
            </button>
            <button
              onClick={makeAllMatch}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs shadow-emerald-500/15"
              title="Overwrites client statement to match internal records perfectly"
            >
              <Sparkles className="h-3 w-3" />
              100% Match
            </button>
            <button
              onClick={scrambleRecords}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/50 rounded font-bold uppercase tracking-wider transition-all cursor-pointer"
              title="Adds random noise values to client ledger"
            >
              <ExternalLink className="h-3 w-3" />
              Scramble
            </button>
          </div>
        </header>

        {/* METRICS & SUMMARY CARDS (ONLY SHOW WHEN IN REPORT VIEW OR GENERAL STATUS) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            title="Total Matched"
            count={stats.matched}
            icon={CheckCircle2}
            colorClass="emerald"
            description="Perfect match on Trade ID, Stock, Quantity, and Price."
            isActive={reportFilter === 'match' && activeView === 'report'}
            onClick={() => {
              setActiveView('report');
              setReportFilter('match');
            }}
          />
          <MetricCard
            title="Total Mismatched"
            count={stats.mismatched}
            icon={AlertTriangle}
            colorClass="rose"
            description="Same trade ID exists but with discrepant booking details."
            isActive={reportFilter === 'mismatch' && activeView === 'report'}
            onClick={() => {
              setActiveView('report');
              setReportFilter('mismatch');
            }}
          />
          <MetricCard
            title="Total Missing"
            count={stats.missing}
            icon={FileQuestion}
            colorClass="amber"
            description="Not registered on the Counterparty statement."
            isActive={reportFilter === 'missing' && activeView === 'report'}
            onClick={() => {
              setActiveView('report');
              setReportFilter('missing');
            }}
          />
        </section>

        {/* TAB NAVIGATION AND FILTERS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded">
            <button
              onClick={() => {
                setActiveView('report');
                setReportFilter('all');
              }}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded transition-all cursor-pointer uppercase tracking-wider ${
                activeView === 'report'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Reconciliation Report
            </button>
            <button
              onClick={() => setActiveView('ledgers')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded transition-all cursor-pointer uppercase tracking-wider ${
                activeView === 'ledgers'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Manage Ledgers ({ourRecords.length} vs {clientRecords.length})
            </button>
          </div>

          {/* Sub-filters for report view */}
          {activeView === 'report' && (
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <span className="text-slate-500 uppercase font-bold text-[10px] mr-1">Filter:</span>
              {(['all', 'match', 'mismatch', 'missing'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setReportFilter(filter)}
                  className={`px-2 py-0.5 text-xs font-bold rounded border transition-all cursor-pointer ${
                    reportFilter === filter
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-slate-900 dark:border-white'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {filter.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* MAIN VIEW CONTENTS */}
        <main className="space-y-5">
          {activeView === 'report' ? (
            <div className="space-y-5">
              <ReconciliationTables 
                reconciliation={reconciliationResults} 
                activeFilter={reportFilter}
                onReset={resetToDefaultDemo}
              />
              <ExplanationCard />
            </div>
          ) : (
            <LedgerTables
              ourRecords={ourRecords}
              clientRecords={clientRecords}
              onUpdateOurRecords={setOurRecords}
              onUpdateClientRecords={setClientRecords}
              onResetAll={resetToDefaultDemo}
            />
          )}
        </main>
      </div>
    </div>
  );
}
