import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        className={`w-full px-4 py-2 rounded-lg border ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-200'} focus:border-indigo-500 focus:ring-2 outline-none transition-all ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};