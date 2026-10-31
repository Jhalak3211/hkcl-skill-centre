import React from 'react';

/**
 * Standardized Institutional Stat Card
 */
export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-[#10284B]',
  iconBg = 'bg-[#10284B]/10',
  onClick,
  active = false,
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border transition-all duration-200 ${
        active
          ? 'border-[#10284B] ring-2 ring-[#10284B]/10 shadow-xs'
          : 'border-[#E5EAF1] hover:border-slate-300 shadow-xs'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#718096] uppercase tracking-wider truncate">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-[#172033] tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value ?? 0}
          </p>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg shrink-0 ${iconBg} ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {subtitle && (
        <p className="mt-3 text-xs text-[#718096] truncate border-t border-slate-100 pt-2.5">
          {subtitle}
        </p>
      )}
    </div>
  );
}
