import React from 'react';
import { DocumentVerificationResult, Language } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, FileCheck, Eye, Sparkles } from 'lucide-react';

interface DocumentVerificationCardProps {
  result: DocumentVerificationResult;
  language: Language;
}

export const DocumentVerificationCard: React.FC<DocumentVerificationCardProps> = ({
  result,
  language
}) => {
  const isClear = result.clarity === 'clear';

  return (
    <div className={`mt-3 p-4 rounded-xl border shadow-sm text-xs sm:text-sm ${
      result.is_valid && isClear
        ? 'bg-linear-to-br from-emerald-50/90 to-stone-50 dark:from-emerald-950/40 dark:to-stone-900 border-emerald-300 dark:border-emerald-700'
        : 'bg-linear-to-br from-amber-50/90 to-stone-50 dark:from-amber-950/40 dark:to-stone-900 border-amber-300 dark:border-amber-700'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
            result.is_valid && isClear ? 'bg-emerald-600' : 'bg-amber-600'
          }`}>
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-1.5">
              <span>{language === 'gu' ? 'દસ્તાવેજ ચકાસણી પરિણામ (AI Vision)' : 'Document Verification Result'}</span>
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400">
              {language === 'gu' ? result.document_name_gu : result.document_type.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>

        {/* Clarity Badge */}
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 border ${
          isClear 
            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
            : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700'
        }`}>
          {isClear ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
          {language === 'gu' 
            ? (isClear ? 'વાંચી શકાય તેવું સ્પષ્ટ (Clear)' : 'ઝાંખું / અસ્પષ્ટ (Blurry)')
            : (isClear ? 'Legible & Clear' : 'Blurry / Needs Retake')
          }
        </span>
      </div>

      {/* Extracted Details Box */}
      {result.extracted_details && Object.keys(result.extracted_details).length > 0 && (
        <div className="my-2.5 p-2.5 rounded-lg bg-white/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1.5">
            {language === 'gu' ? 'ચકાસાયેલ વિગતો (Extracted Record Data):' : 'Extracted Record Data:'}
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {result.extracted_details.farmer_name && (
              <div>
                <span className="text-stone-500 dark:text-stone-400 text-[10px] block">{language === 'gu' ? 'નામ' : 'Name'}</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{result.extracted_details.farmer_name}</span>
              </div>
            )}
            {result.extracted_details.survey_number && (
              <div>
                <span className="text-stone-500 dark:text-stone-400 text-[10px] block">{language === 'gu' ? 'સર્વે નંબર' : 'Survey No'}</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{result.extracted_details.survey_number}</span>
              </div>
            )}
            {result.extracted_details.khata_number && (
              <div>
                <span className="text-stone-500 dark:text-stone-400 text-[10px] block">{language === 'gu' ? 'ખાતા નંબર' : 'Khata No'}</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{result.extracted_details.khata_number}</span>
              </div>
            )}
            {result.extracted_details.aadhaar_masked && (
              <div>
                <span className="text-stone-500 dark:text-stone-400 text-[10px] block">{language === 'gu' ? 'આધાર' : 'Aadhaar'}</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{result.extracted_details.aadhaar_masked}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Feedback */}
      <div className="mt-2 text-xs text-stone-700 dark:text-stone-300">
        <p className="leading-relaxed">
          {language === 'gu' ? result.feedback_gu : result.feedback_en}
        </p>
      </div>
    </div>
  );
};
