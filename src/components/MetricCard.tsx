/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  colorClass: string; // e.g. 'emerald', 'rose', 'amber'
  description: string;
  onClick?: () => void;
  isActive?: boolean;
}

export function MetricCard({
  title,
  count,
  icon: Icon,
  colorClass,
  description,
  onClick,
  isActive = false
}: MetricCardProps) {
  // Determine color theme based on classes
  const theme = {
    slate: {
      bg: 'bg-slate-50 border-slate-200 hover:bg-slate-100/70 dark:bg-slate-900/40 dark:border-slate-800',
      text: 'text-slate-800 dark:text-slate-200',
      labelText: 'text-slate-500 dark:text-slate-400',
      glow: 'ring-2 ring-slate-500/20 border-slate-600 shadow-xs dark:border-slate-400',
    },
    emerald: {
      bg: 'bg-emerald-50/80 border-emerald-200 hover:bg-emerald-50/100 dark:bg-emerald-950/20 dark:border-emerald-900',
      text: 'text-emerald-700 dark:text-emerald-400',
      labelText: 'text-emerald-800 dark:text-emerald-500',
      glow: 'ring-2 ring-emerald-500/20 border-emerald-600 shadow-xs dark:border-emerald-500',
    },
    rose: {
      bg: 'bg-rose-50/80 border-rose-200 hover:bg-rose-50/100 dark:bg-rose-950/20 dark:border-rose-900',
      text: 'text-rose-700 dark:text-rose-400',
      labelText: 'text-rose-800 dark:text-rose-500',
      glow: 'ring-2 ring-rose-500/20 border-rose-600 shadow-xs dark:border-rose-500',
    },
    amber: {
      bg: 'bg-amber-50/80 border-amber-200 hover:bg-amber-50/100 dark:bg-amber-950/20 dark:border-amber-900',
      text: 'text-amber-700 dark:text-amber-400',
      labelText: 'text-amber-800 dark:text-amber-500',
      glow: 'ring-2 ring-amber-500/20 border-amber-600 shadow-xs dark:border-amber-500',
    }
  }[colorClass as 'slate' | 'emerald' | 'rose' | 'amber'] || {
    bg: 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800',
    text: 'text-slate-800 dark:text-slate-200',
    labelText: 'text-slate-500 dark:text-slate-400',
    glow: 'ring-2 ring-slate-500/20 border-slate-500',
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded border transition-all duration-150 cursor-pointer ${
        isActive ? theme.glow : theme.bg
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.labelText}`}>
            {title}
          </p>
          <h3 className={`text-2xl font-mono font-bold tracking-tight ${theme.text}`}>
            {count.toString().padStart(2, '0')}
          </h3>
        </div>
        <div className="p-1 rounded text-slate-400 dark:text-slate-500">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-1.5 text-[11px] leading-tight text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </motion.button>
  );
}
