import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export default function SearchFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions = [],
  placeholder = 'Search by name, ID or details...',
  children,
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-[#E5EAF1] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full pl-9.5 pr-8 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm text-[#172033] placeholder-slate-400 focus:outline-none focus:border-[#10284B] focus:ring-1 focus:ring-[#10284B] transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
        {statusOptions.length > 0 && (
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-10 pl-3 pr-8 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm text-[#172033] font-medium focus:outline-none focus:border-[#10284B] focus:ring-1 focus:ring-[#10284B] cursor-pointer appearance-none"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <Filter className="h-3.5 w-3.5" />
            </span>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
