import React, { useState } from 'react';
import { Scheme, Language } from '../types';
import { 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  Coins, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  BookmarkCheck,
  Percent
} from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
  language: Language;
  onOpenChecklist?: (scheme: Scheme) => void;
  compact?: boolean;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  language,
  onOpenChecklist,
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(!compact);

  const title = language === 'gu' ? scheme.name_gu : language === 'hi' ? (scheme.name_hi || scheme.name_en) : scheme.name_en;
  const category = language === 'gu' ? scheme.category_gu : scheme.category;
  const documents = language === 'gu' ? scheme.required_documents_gu : scheme.required_documents_en;
  const eligibility = language === 'gu' ? scheme.eligibility_criteria_gu : scheme.eligibility_criteria_en;

  return (
    <div 
      id={`scheme-card-${scheme.id}`}
      className="bg-white dark:bg-stone-900 rounded-xl border border-emerald-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      {/* Top Scheme Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 dark:from-emerald-950/40 dark:to-teal-950/20 px-4 py-3 border-b border-emerald-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[11px] font-bold">
            {category}
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
            {scheme.id}
          </span>
        </div>

        {/* Subsidy Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/50 text-xs font-bold">
          <Percent className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>સબસિડી: {scheme.subsidy_percentage}</span>
        </div>
      </div>

      <div className="p-4">
        {/* Title */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-base text-stone-900 dark:text-white leading-snug">
            {title}
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded transition-colors"
            title={isExpanded ? "ઓછું બતાવો" : "વિગતવાર જુઓ"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Maximum Amount Highlight Banner */}
        <div className="mb-3 p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs text-stone-700 dark:text-stone-300">
              {language === 'gu' ? 'મહત્તમ સહાય મર્યાદા:' : 'Max Financial Assistance:'}
            </span>
          </div>
          <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
            ₹{scheme.max_subsidy_amount.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-3.5 text-xs text-stone-700 dark:text-stone-300 animate-in fade-in duration-200">
            {/* Subsidy Breakdown per Caste/Category */}
            {scheme.subsidy_breakdown && (
              <div className="bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700">
                <div className="font-semibold text-stone-900 dark:text-stone-100 mb-1.5 flex items-center gap-1.5">
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'gu' ? 'કેટેગરી મુજબ સબસિડી વિગત:' : 'Subsidy Allocation by Category:'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                  {Object.entries(scheme.subsidy_breakdown).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-1">
                      <span className="font-medium text-emerald-700 dark:text-emerald-400 shrink-0">
                        {key === 'general' ? 'સામાન્ય (General):' : key === 'sc_st' ? 'SC/ST ખેડૂત:' : key === 'women' ? 'મહિલા ખેડૂત:' : key === 'small_marginal' ? 'નાના/સીમાંત:' : `${key}:`}
                      </span>
                      <span className="text-stone-600 dark:text-stone-300">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility Highlights */}
            <div>
              <div className="font-semibold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>{language === 'gu' ? 'મુખ્ય પાત્રતા શરતો:' : 'Key Eligibility Criteria:'}</span>
              </div>
              <ul className="space-y-1 pl-1 text-[11px]">
                {eligibility.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents List */}
            <div>
              <div className="font-semibold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>{language === 'gu' ? 'જરૂરી કાગળો (Documents Checklist):' : 'Required Documents:'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-stone-100/70 dark:bg-stone-800 px-2 py-1 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                    <span className="truncate">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Period */}
            {scheme.application_period && (
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>અરજી સમયગાળો: {scheme.application_period}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Footer Buttons */}
        <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
          {onOpenChecklist && (
            <button
              onClick={() => onOpenChecklist(scheme)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'gu' ? 'કાગળોની ચેકલીસ્ટ પ્રિન્ટ કરો' : 'Print Checklist'}</span>
            </button>
          )}

          <a
            href={scheme.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-transform active:scale-95 ml-auto"
          >
            <span>{language === 'gu' ? 'આઈ-ખેડૂત પર અરજી કરો' : 'Apply on iKhedut'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
