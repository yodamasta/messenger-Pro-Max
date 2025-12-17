import React from "react";

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({ children, htmlFor, required }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  suggestions?: string[];
  onSuggestionClick?: (value: string) => void;
}

export const TextInput: React.FC<InputProps> = ({ label, className, required, suggestions, onSuggestionClick, ...props }) => {
  return (
    <div className="mb-4">
      <Label htmlFor={props.id} required={required}>{label}</Label>
      <input
        className={`w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-slate-900 ${className}`}
        {...props}
      />
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSuggestionClick && onSuggestionClick(suggestion)}
              className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors border border-transparent hover:border-indigo-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className, required, ...props }) => {
  return (
    <div className="mb-4">
      <Label htmlFor={props.id} required={required}>{label}</Label>
      <textarea
        className={`w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-h-[100px] bg-white text-slate-900 ${className}`}
        {...props}
      />
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className, required, ...props }) => {
  return (
    <div className="mb-4">
      <Label htmlFor={props.id} required={required}>{label}</Label>
      <div className="relative">
        <select
          className={`w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white text-slate-900 transition-colors ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
