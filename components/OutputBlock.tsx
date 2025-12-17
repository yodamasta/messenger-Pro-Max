import React, { useState } from "react";

interface OutputBlockProps {
  title: string;
  content: string;
  colorClass: string;
  onCopy?: () => void;
}

export const OutputBlock: React.FC<OutputBlockProps> = ({ title, content, colorClass }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={`mb-6 rounded-xl border-l-4 ${colorClass} bg-white shadow-sm overflow-hidden`}>
      <div className="flex justify-between items-center px-4 py-3 bg-slate-50 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800 text-sm tracking-wide uppercase">{title}</h3>
        <button
          onClick={handleCopy}
          className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
            copied
              ? "bg-green-100 text-green-700"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copié !
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copier
            </>
          )}
        </button>
      </div>
      <div className="p-4 bg-slate-50/50">
        <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed break-words bg-white p-4 rounded-lg border border-slate-200">
          {content}
        </pre>
      </div>
    </div>
  );
};
