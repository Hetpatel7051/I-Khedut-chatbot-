import React from 'react';
import { ApplicationStatusData, Language } from '../types';
import { CheckCircle, Clock, ShieldCheck, FileText, ArrowRight, User, Building2, MapPin } from 'lucide-react';

interface ApplicationStatusCardProps {
  statusData: ApplicationStatusData;
  language: Language;
}

export const ApplicationStatusCard: React.FC<ApplicationStatusCardProps> = ({
  statusData,
  language
}) => {
  const stages = [
    { id: 1, title_gu: 'અરજી સબમિટ થઈ', title_en: 'Application Submitted' },
    { id: 2, title_gu: 'ગ્રામ સેવક દ્વારા કાગળ ચકાસણી', title_en: 'Verified by Gram Sevak' },
    { id: 3, title_gu: 'તાલુકા અધિકારી દ્વારા મંજૂરી', title_en: 'Approved by Taluka Officer' },
    { id: 4, title_gu: 'ડીબીટી બેંક ટ્રાન્સફર પૂર્ણ', title_en: 'DBT Bank Transfer Completed' }
  ];

  return (
    <div className="mt-3 p-4 rounded-xl bg-linear-to-br from-emerald-950/5 via-emerald-50/50 to-stone-50 dark:from-emerald-950/30 dark:via-stone-900 dark:to-stone-900 border border-emerald-300 dark:border-emerald-700 shadow-sm text-xs sm:text-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-200 dark:border-emerald-800/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-emerald-950 dark:text-emerald-300 text-sm">
              {language === 'gu' ? 'આઈ-ખેડૂત અરજી સ્ટેટસ' : 'iKhedut Application Status'}
            </div>
            <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
              ID: <span className="font-bold text-emerald-700 dark:text-emerald-400">{statusData.application_id}</span>
            </div>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[11px] font-bold border border-amber-300 dark:border-amber-700 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {language === 'gu' ? statusData.status_gu : statusData.status}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 text-xs">
        <div className="p-2 rounded-lg bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-stone-500 dark:text-stone-400 text-[10px] block">{language === 'gu' ? 'અરજદારનું નામ' : 'Applicant'}</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">{statusData.farmer_name}</span>
          </div>
        </div>
        <div className="p-2 rounded-lg bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-stone-500 dark:text-stone-400 text-[10px] block">{language === 'gu' ? 'યોજનાનું નામ' : 'Scheme'}</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200 truncate block max-w-[200px]">
              {language === 'gu' ? statusData.scheme_name_gu : statusData.scheme_name}
            </span>
          </div>
        </div>
        <div className="p-2 rounded-lg bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-stone-500 dark:text-stone-400 text-[10px] block">{language === 'gu' ? 'જિલ્લો' : 'District'}</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">{statusData.district}</span>
          </div>
        </div>
        {statusData.disbursement_amount && (
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-emerald-700 dark:text-emerald-400 text-[10px] block">{language === 'gu' ? 'સબસિડી રકમ' : 'Subsidy Amount'}</span>
              <span className="font-bold text-emerald-900 dark:text-emerald-300">₹{statusData.disbursement_amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Visual Timeline Progress */}
      <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800">
        <div className="text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-2">
          {language === 'gu' ? 'અરજી પ્રગતિ સ્થિતિ (Tracking Timeline):' : 'Application Progress Timeline:'}
        </div>
        <div className="space-y-2.5">
          {stages.map((stage) => {
            const isCompleted = stage.id <= statusData.stage;
            const isCurrent = stage.id === statusData.stage;
            return (
              <div key={stage.id} className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isCompleted 
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 dark:ring-emerald-800' 
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-500'
                }`}>
                  {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : stage.id}
                </div>
                <div className="flex-1">
                  <span className={`text-xs ${isCompleted ? 'font-bold text-stone-900 dark:text-stone-100' : 'text-stone-400'} ${isCurrent ? 'text-emerald-700 dark:text-emerald-400 underline underline-offset-2' : ''}`}>
                    {language === 'gu' ? stage.title_gu : stage.title_en}
                  </span>
                </div>
                {isCurrent && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium">
                    {language === 'gu' ? 'હાલનું સ્ટેપ' : 'Current'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
