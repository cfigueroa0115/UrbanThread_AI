'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function DateFilter({ startDate, endDate, onStartDateChange, onEndDateChange }: DateFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Calendar className="h-5 w-5 text-ut-text-muted flex-shrink-0" aria-hidden="true" />
      <div className="flex items-center gap-2">
        <label htmlFor="start-date" className="text-small text-ut-text-muted">Desde:</label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="px-3 py-1.5 rounded-md border border-ut-surface-dark text-small text-ut-text focus:outline-none focus:ring-2 focus:ring-ut-accent focus:ring-offset-2"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="end-date" className="text-small text-ut-text-muted">Hasta:</label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="px-3 py-1.5 rounded-md border border-ut-surface-dark text-small text-ut-text focus:outline-none focus:ring-2 focus:ring-ut-accent focus:ring-offset-2"
        />
      </div>
    </div>
  );
}

export default DateFilter;
