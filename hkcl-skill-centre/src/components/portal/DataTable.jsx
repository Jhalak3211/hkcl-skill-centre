import React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export default function DataTable({
  columns,
  data = [],
  loading = false,
  emptyMessage = 'No records found matching your filters.',
  emptyAction = null,
  pagination = null,
  onPageChange = null,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#E5EAF1] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E5EAF1] bg-slate-50/50">
          <div className="h-4 w-48 bg-slate-200 rounded-sm animate-pulse" />
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
              <div className="h-4 w-1/4 bg-slate-100 rounded-sm" />
              <div className="h-4 w-1/4 bg-slate-100 rounded-sm" />
              <div className="h-4 w-1/6 bg-slate-100 rounded-sm" />
              <div className="h-4 w-1/6 bg-slate-100 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E5EAF1] shadow-xs p-12 text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-400 mb-3">
          <Inbox className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-semibold text-[#172033]">No Records Found</h4>
        <p className="mt-1 text-xs text-[#718096] max-w-sm mx-auto">
          {emptyMessage}
        </p>
        {emptyAction && (
          <div className="mt-4">
            {emptyAction}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5EAF1] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E5EAF1] text-left">
          <thead className="bg-slate-50/75">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-4.5 py-3.5 text-xs font-semibold text-[#718096] uppercase tracking-wider ${
                    col.className || ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((row, rowIdx) => (
              <tr
                key={row._id || row.id || row.applicationId || rowIdx}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-4.5 py-3.5 text-xs sm:text-sm text-[#172033] ${
                      col.cellClassName || ''
                    }`}
                  >
                    {col.cell ? col.cell(row, rowIdx) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="border-t border-[#E5EAF1] bg-slate-50/50 px-4 py-3 flex items-center justify-between flex-wrap gap-2 text-xs text-[#718096]">
          <div>
            Showing{' '}
            <span className="font-semibold text-[#172033]">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-[#172033]">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-[#172033]">{pagination.total}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-[#172033] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
            <span className="px-2 font-medium">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              type="button"
              disabled={pagination.page >= (pagination.totalPages || 1)}
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-[#172033] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
