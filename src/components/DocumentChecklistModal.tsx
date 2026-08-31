import React, { useState } from 'react';
import { Scheme, Language } from '../types';
import { FileText, CheckSquare, Square, Printer, Download, X, ShieldCheck } from 'lucide-react';

interface DocumentChecklistModalProps {
  scheme: Scheme | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const DocumentChecklistModal: React.FC<DocumentChecklistModalProps> = ({
  scheme,
  isOpen,
  onClose,
  language
}) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});

  if (!isOpen || !scheme) return null;

  const docs = language === 'gu' ? scheme.required_documents_gu : scheme.required_documents_en;
  const title = language === 'gu' ? scheme.name_gu : scheme.name_en;

  const toggleDoc = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const totalCount = docs.length;
  const readyCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[90vh] flex flex-col print:m-0 print:max-w-none print:shadow-none">
        {/* Header */}
        <div className="bg-emerald-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base">
                {language === 'gu' ? 'જરૂરી કાગળોની ચેકલીસ્ટ (Documents Checklist)' : 'Required Documents Checklist'}
              </h2>
              <p className="text-xs text-emerald-200 truncate max-w-sm">
                {title}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 px-6 py-2.5 border-b border-emerald-100 dark:border-stone-800 flex items-center justify-between text-xs">
          <span className="font-semibold text-emerald-900 dark:text-emerald-300">
            તૈયાર દસ્તાવેજો: {readyCount} / {totalCount}
          </span>
          <div className="w-32 bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${(readyCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Checklist List */}
        <div className="p-6 overflow-y-auto space-y-3">
          <div className="text-xs text-stone-600 dark:text-stone-300 mb-2">
            આઈ-ખેડૂત પોર્ટલ પર ઓનલાઈન અરજી કરતા પહેલાં નીચેના અસલ તથા ઝેરોક્ષ દસ્તાવેજો તૈયાર રાખો:
          </div>

          <div className="space-y-2.5">
            {docs.map((doc, idx) => {
              const isChecked = !!checkedItems[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleDoc(idx)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    isChecked
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                      : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <button type="button" className="mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0">
                    {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-stone-400" />}
                  </button>
                  <div className="text-xs sm:text-sm font-medium leading-tight">
                    <span>{idx + 1}. {doc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Satbara / 7-12 Verification Note */}
          <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">મહત્વની સૂચના:</span> ૭/૧૨ અને ૮-અ ના ઉતારા ૬ મહિના કરતાં વધુ જૂના ન હોવા જોઈએ. જો સંયુક્ત ખાતેદાર હોવ તો અન્ય ખાતેદારોનું સંમતિ પત્રક જોડવું જરૂરી છે.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100"
          >
            બંધ કરો
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>પ્રિન્ટ ચેકલીસ્ટ (Print)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
