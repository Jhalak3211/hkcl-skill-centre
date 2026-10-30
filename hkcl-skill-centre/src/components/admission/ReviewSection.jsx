import { Link } from 'react-router-dom';

export default function ReviewSection({
  title,
  editPath,
  items = [],
  children,
  isLocked = false,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        {editPath && !isLocked && (
          <Link
            to={editPath}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
          >
            Edit
          </Link>
        )}
      </div>

      {items.length > 0 && (
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 text-xs">
          {items.map((item, index) => (
            <div
              key={index}
              className={item.fullWidth ? 'sm:col-span-2 lg:col-span-3' : ''}
            >
              <dt className="text-slate-400">{item.label}</dt>
              <dd className="font-medium text-slate-800 mt-0.5 break-words">
                {item.value || <span className="text-slate-400 italic">Not provided</span>}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {children && <div className={items.length > 0 ? 'mt-4 border-t border-slate-100 pt-3' : ''}>{children}</div>}
    </div>
  );
}
