import { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  AlertCircle,
  Check,
} from 'lucide-react';

export default function DocumentUploader({
  id,
  label,
  description,
  required = false,
  acceptedTypes = ['image/jpeg', 'image/png'],
  acceptedExtensionsLabel = 'JPG, PNG',
  maxSizeMB = 2,
  fileData = null,
  onFileSelect,
  onFileRemove,
  previewType = 'standard',
  error = '',
  disabled = false,
}) {
  const [dragOver, setDragOver] = useState(false);
  const [internalError, setInternalError] = useState('');
  const inputRef = useRef(null);

  const displayError = error || internalError;

  const validateAndProcessFile = (file) => {
    setInternalError('');
    if (!file) return;

    const isAccepted = acceptedTypes.some((type) => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type === type;
    });

    if (!isAccepted) {
      setInternalError(`Allowed formats: ${acceptedExtensionsLabel}`);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setInternalError(`File size must be under ${maxSizeMB} MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onFileSelect({
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (inputRef.current) inputRef.current.value = '';
    setInternalError('');
    onFileRemove();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <label htmlFor={id} className="text-xs font-semibold text-slate-800 cursor-pointer">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <span className="text-[11px] text-slate-400">
          Max {maxSizeMB}MB ({acceptedExtensionsLabel})
        </span>
      </div>

      {description && (
        <p className="text-xs text-slate-500 mb-2 leading-relaxed">
          {description}
        </p>
      )}

      <input
        ref={inputRef}
        id={id}
        name={id}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        className="sr-only"
      />

      {fileData ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {previewType === 'avatar' && fileData.dataUrl ? (
                <img
                  src={fileData.dataUrl}
                  alt={fileData.name}
                  className="h-12 w-12 rounded object-cover border border-slate-200 bg-white shrink-0"
                />
              ) : previewType === 'signature' && fileData.dataUrl ? (
                <div className="h-10 w-24 rounded border border-slate-200 bg-white p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={fileData.dataUrl}
                    alt="Signature"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-slate-200 bg-white text-slate-500">
                  <FileText className="h-5 w-5" />
                </div>
              )}

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-800 truncate">
                  {fileData.name}
                </p>
                <p className="text-[11px] text-slate-400">
                  {formatFileSize(fileData.size)}
                </p>
              </div>
            </div>

            {!disabled ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded bg-white hover:bg-slate-50 transition"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-2.5 py-1 text-xs font-medium text-red-600 hover:text-red-700 border border-red-100 rounded bg-red-50 hover:bg-red-100 transition"
                >
                  Remove
                </button>
              </div>
            ) : (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Attached (Locked)
              </span>
            )}
          </div>
        </div>
      ) : disabled ? (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-3.5 px-4 text-center bg-slate-50 text-slate-400 text-xs">
          <span>No document attached (Locked)</span>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={`flex items-center justify-center gap-2 rounded-lg border border-dashed py-5 px-4 text-center cursor-pointer transition ${
            dragOver
              ? 'border-brand-600 bg-brand-50/30'
              : displayError
                ? 'border-red-300 bg-red-50/20'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/40'
          }`}
        >
          <UploadCloud className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-600">
            <span className="font-semibold text-brand-800 underline">Upload file</span> or drag and drop
          </span>
        </div>
      )}

      {displayError && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{displayError}</span>
        </p>
      )}
    </div>
  );
}
