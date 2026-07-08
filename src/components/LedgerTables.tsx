/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trade } from '../types';
import { Edit2, Trash2, Plus, Check, X, Search, Landmark, User, RefreshCw } from 'lucide-react';

interface LedgerTablesProps {
  ourRecords: Trade[];
  clientRecords: Trade[];
  onUpdateOurRecords: (records: Trade[]) => void;
  onUpdateClientRecords: (records: Trade[]) => void;
  onResetAll: () => void;
}

export function LedgerTables({
  ourRecords,
  clientRecords,
  onUpdateOurRecords,
  onUpdateClientRecords,
  onResetAll
}: LedgerTablesProps) {
  // Global search filters for each side
  const [ourSearch, setOurSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');

  // Inline editing state for Our Records
  const [editingOurId, setEditingOurId] = useState<string | null>(null);
  const [editOurForm, setEditOurForm] = useState<Partial<Trade>>({});

  // Inline editing state for Client Records
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editClientForm, setEditClientForm] = useState<Partial<Trade>>({});

  // Form states for adding new trades
  const [showAddOur, setShowAddOur] = useState(false);
  const [newOurTrade, setNewOurTrade] = useState({ tradeId: '', stockName: 'AAPL', quantity: 100, price: 150.00 });
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClientTrade, setNewClientTrade] = useState({ tradeId: '', stockName: 'AAPL', quantity: 100, price: 150.00 });

  // Filtering Our Records based on search
  const filteredOur = ourRecords.filter(t => 
    t.tradeId.toLowerCase().includes(ourSearch.toLowerCase()) ||
    t.stockName.toLowerCase().includes(ourSearch.toLowerCase())
  );

  // Filtering Client Records based on search
  const filteredClient = clientRecords.filter(t => 
    t.tradeId.toLowerCase().includes(clientSearch.toLowerCase()) ||
    t.stockName.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // Edit actions for Our Records
  const startEditOur = (trade: Trade) => {
    setEditingOurId(trade.tradeId);
    setEditOurForm(trade);
  };

  const cancelEditOur = () => {
    setEditingOurId(null);
    setEditOurForm({});
  };

  const saveEditOur = () => {
    if (!editOurForm.tradeId) return;
    const updated = ourRecords.map(t => 
      t.tradeId === editOurForm.tradeId 
        ? { 
            ...t, 
            stockName: editOurForm.stockName || t.stockName,
            quantity: Number(editOurForm.quantity) || t.quantity,
            price: Number(editOurForm.price) || t.price
          }
        : t
    );
    onUpdateOurRecords(updated);
    setEditingOurId(null);
  };

  const deleteOurTrade = (id: string) => {
    onUpdateOurRecords(ourRecords.filter(t => t.tradeId !== id));
  };

  const addOurTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const tradeId = newOurTrade.tradeId.trim() || `T${1000 + ourRecords.length + 1}`;
    if (ourRecords.some(t => t.tradeId === tradeId)) {
      alert(`Trade ID ${tradeId} already exists in Our Records!`);
      return;
    }
    const newTrade: Trade = {
      tradeId,
      stockName: newOurTrade.stockName.toUpperCase(),
      quantity: Number(newOurTrade.quantity) || 100,
      price: Number(newOurTrade.price) || 150
    };
    onUpdateOurRecords([...ourRecords, newTrade]);
    setNewOurTrade({ tradeId: '', stockName: 'AAPL', quantity: 100, price: 150.00 });
    setShowAddOur(false);
  };

  // Edit actions for Client Records
  const startEditClient = (trade: Trade) => {
    setEditingClientId(trade.tradeId);
    setEditClientForm(trade);
  };

  const cancelEditClient = () => {
    setEditingClientId(null);
    setEditClientForm({});
  };

  const saveEditClient = () => {
    if (!editClientForm.tradeId) return;
    const updated = clientRecords.map(t => 
      t.tradeId === editClientForm.tradeId 
        ? { 
            ...t, 
            stockName: editClientForm.stockName || t.stockName,
            quantity: Number(editClientForm.quantity) || t.quantity,
            price: Number(editClientForm.price) || t.price
          }
        : t
    );
    onUpdateClientRecords(updated);
    setEditingClientId(null);
  };

  const deleteClientTrade = (id: string) => {
    onUpdateClientRecords(clientRecords.filter(t => t.tradeId !== id));
  };

  const addClientTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const tradeId = newClientTrade.tradeId.trim() || `T${1000 + clientRecords.length + 1}`;
    const newTrade: Trade = {
      tradeId,
      stockName: newClientTrade.stockName.toUpperCase(),
      quantity: Number(newClientTrade.quantity) || 100,
      price: Number(newClientTrade.price) || 150
    };
    onUpdateClientRecords([...clientRecords, newTrade]);
    setNewClientTrade({ tradeId: '', stockName: 'AAPL', quantity: 100, price: 150.00 });
    setShowAddClient(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      
      {/* LEFT COLUMN: OUR RECORDS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded flex flex-col h-[520px] shadow-xs">
        {/* Header bar */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-100/60 dark:bg-slate-800/20">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 rounded">
              <Landmark className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white text-xs">Internal Ledger</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Firm&apos;s Records • {ourRecords.length} trades</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddOur(!showAddOur)}
            className="flex items-center gap-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded transition-colors cursor-pointer uppercase tracking-wider"
          >
            <Plus className="h-3 w-3" />
            New Booking
          </button>
        </div>

        {/* Dynamic add trade form */}
        <AnimatePresence>
          {showAddOur && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={addOurTrade}
              className="p-3 bg-indigo-50/20 dark:bg-indigo-950/5 border-b border-slate-150 dark:border-slate-800/50 overflow-hidden text-[11px]"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-0.5 uppercase tracking-wide text-[9px]">Trade ID</label>
                  <input
                    type="text"
                    placeholder="Auto ID"
                    value={newOurTrade.tradeId}
                    onChange={(e) => setNewOurTrade({ ...newOurTrade, tradeId: e.target.value })}
                    className="w-full p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-0.5 uppercase tracking-wide text-[9px]">Ticker</label>
                  <input
                    type="text"
                    required
                    value={newOurTrade.stockName}
                    onChange={(e) => setNewOurTrade({ ...newOurTrade, stockName: e.target.value })}
                    className="w-full p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-0.5 uppercase tracking-wide text-[9px]">Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newOurTrade.quantity}
                    onChange={(e) => setNewOurTrade({ ...newOurTrade, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white font-mono text-right"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-0.5 uppercase tracking-wide text-[9px]">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0.01"
                    value={newOurTrade.price}
                    onChange={(e) => setNewOurTrade({ ...newOurTrade, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white font-mono text-right"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddOur(false)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded transition-colors cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors cursor-pointer font-bold"
                >
                  Book Trade
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Ledger search */}
        <div className="p-2 border-b border-slate-150 dark:border-slate-800 bg-slate-50/20">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400 pointer-events-none">
              <Search className="h-3 w-3" />
            </span>
            <input
              type="text"
              placeholder="Search ID / ticker..."
              value={ourSearch}
              onChange={(e) => setOurSearch(e.target.value)}
              className="w-full pl-7 pr-3 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* List of Trades */}
        <div className="flex-1 overflow-y-auto min-h-0 text-xs font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/75 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[10px] font-bold uppercase sticky top-0 z-10">
                <th className="py-1.5 px-3">Trade ID</th>
                <th className="py-1.5 px-3 font-sans">Ticker</th>
                <th className="py-1.5 px-3 text-right">Qty</th>
                <th className="py-1.5 px-3 text-right">Price</th>
                <th className="py-1.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
              {filteredOur.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 italic font-sans">No records</td>
                </tr>
              ) : (
                filteredOur.map((trade) => {
                  const isEditing = editingOurId === trade.tradeId;
                  return (
                    <tr key={trade.tradeId} className="hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="py-1 px-3 font-bold text-slate-700 dark:text-slate-300">{trade.tradeId}</td>
                      <td className="py-1 px-3 font-sans">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editOurForm.stockName || ''}
                            onChange={(e) => setEditOurForm({ ...editOurForm, stockName: e.target.value.toUpperCase() })}
                            className="w-14 px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 rounded text-slate-900 dark:text-white font-mono"
                          />
                        ) : (
                          trade.stockName
                        )}
                      </td>
                      <td className="py-1 px-3 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editOurForm.quantity || ''}
                            onChange={(e) => setEditOurForm({ ...editOurForm, quantity: parseInt(e.target.value) || 0 })}
                            className="w-16 px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 rounded text-right text-slate-900 dark:text-white font-mono"
                          />
                        ) : (
                          trade.quantity
                        )}
                      </td>
                      <td className="py-1 px-3 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editOurForm.price || ''}
                            onChange={(e) => setEditOurForm({ ...editOurForm, price: parseFloat(e.target.value) || 0 })}
                            className="w-16 px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 rounded text-right text-slate-900 dark:text-white font-mono"
                          />
                        ) : (
                          `$${trade.price.toFixed(2)}`
                        )}
                      </td>
                      <td className="py-1 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isEditing ? (
                            <>
                              <button 
                                onClick={saveEditOur} 
                                className="p-0.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded cursor-pointer"
                                title="Save changes"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                              <button 
                                onClick={cancelEditOur} 
                                className="p-0.5 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded cursor-pointer"
                                title="Cancel editing"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => startEditOur(trade)} 
                                className="p-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded cursor-pointer transition-colors"
                                title="Edit record"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button 
                                onClick={() => deleteOurTrade(trade.tradeId)} 
                                className="p-0.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded cursor-pointer transition-colors"
                                title="Delete record"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT COLUMN: CLIENT RECORDS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded flex flex-col h-[520px] shadow-xs">
        {/* Header bar */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-100/60 dark:bg-slate-800/20">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 rounded">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white text-xs">Counterparty Ledger</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Client Statement • {clientRecords.length} trades</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddClient(!showAddClient)}
            className="flex items-center gap-1 text-[11px] font-bold bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition-colors cursor-pointer uppercase tracking-wider"
          >
            <Plus className="h-3 w-3" />
            New Booking
          </button>
        </div>

        {/* Dynamic add trade form */}
        <AnimatePresence>
          {showAddClient && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={addClientTrade}
              className="p-3 bg-purple-50/20 dark:bg-purple-950/5 border-b border-slate-150 dark:border-slate-800/50 overflow-hidden text-[11px]"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-0.5 uppercase tracking-wide text-[9px]">Trade ID</label>
                  <input
                    type="text"
                    placeholder="Auto ID"
                    value={newClientTrade.tradeId}
                    onChange={(e) => setNewClientTrade({ ...newClientTrade, tradeId: e.target.value })}
                    className="w-full p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-0.5 uppercase tracking-wide text-[9px]">Ticker</label>
                  <input
                    type="text"
                    required
                    value={newClientTrade.stockName}
                    onChange={(e) => setNewClientTrade({ ...newClientTrade, stockName: e.target.value })}
                    className="w-full p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-0.5 uppercase tracking-wide text-[9px]">Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newClientTrade.quantity}
                    onChange={(e) => setNewClientTrade({ ...newClientTrade, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white font-mono text-right"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-0.5 uppercase tracking-wide text-[9px]">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0.01"
                    value={newClientTrade.price}
                    onChange={(e) => setNewClientTrade({ ...newClientTrade, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white font-mono text-right"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClient(false)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded transition-colors cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-0.5 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors cursor-pointer font-bold"
                >
                  Book Trade
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Ledger search */}
        <div className="p-2 border-b border-slate-150 dark:border-slate-800 bg-slate-50/20">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400 pointer-events-none">
              <Search className="h-3 w-3" />
            </span>
            <input
              type="text"
              placeholder="Search ID / ticker..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              className="w-full pl-7 pr-3 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded focus:outline-hidden focus:ring-1 focus:ring-purple-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* List of Trades */}
        <div className="flex-1 overflow-y-auto min-h-0 text-xs font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/75 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[10px] font-bold uppercase sticky top-0 z-10">
                <th className="py-1.5 px-3">Trade ID</th>
                <th className="py-1.5 px-3 font-sans">Ticker</th>
                <th className="py-1.5 px-3 text-right">Qty</th>
                <th className="py-1.5 px-3 text-right">Price</th>
                <th className="py-1.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
              {filteredClient.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 italic font-sans">No records</td>
                </tr>
              ) : (
                filteredClient.map((trade) => {
                  const isEditing = editingClientId === trade.tradeId;
                  return (
                    <tr key={trade.tradeId} className="hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="py-1 px-3 font-bold text-slate-700 dark:text-slate-300">{trade.tradeId}</td>
                      <td className="py-1 px-3 font-sans">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editClientForm.stockName || ''}
                            onChange={(e) => setEditClientForm({ ...editClientForm, stockName: e.target.value.toUpperCase() })}
                            className="w-14 px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 rounded text-slate-900 dark:text-white font-mono"
                          />
                        ) : (
                          trade.stockName
                        )}
                      </td>
                      <td className="py-1 px-3 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editClientForm.quantity || ''}
                            onChange={(e) => setEditClientForm({ ...editClientForm, quantity: parseInt(e.target.value) || 0 })}
                            className="w-16 px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 rounded text-right text-slate-900 dark:text-white font-mono"
                          />
                        ) : (
                          trade.quantity
                        )}
                      </td>
                      <td className="py-1 px-3 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editClientForm.price || ''}
                            onChange={(e) => setEditClientForm({ ...editClientForm, price: parseFloat(e.target.value) || 0 })}
                            className="w-16 px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 rounded text-right text-slate-900 dark:text-white font-mono"
                          />
                        ) : (
                          `$${trade.price.toFixed(2)}`
                        )}
                      </td>
                      <td className="py-1 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isEditing ? (
                            <>
                              <button 
                                onClick={saveEditClient} 
                                className="p-0.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded cursor-pointer"
                                title="Save changes"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                              <button 
                                onClick={cancelEditClient} 
                                className="p-0.5 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded cursor-pointer"
                                title="Cancel editing"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => startEditClient(trade)} 
                                className="p-0.5 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded cursor-pointer transition-colors"
                                title="Edit record"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button 
                                onClick={() => deleteClientTrade(trade.tradeId)} 
                                className="p-0.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded cursor-pointer transition-colors"
                                title="Delete record"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
