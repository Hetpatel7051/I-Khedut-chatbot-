import React, { useState } from 'react';
import { PreFilledFormData, Language } from '../types';
import { FileDown, Printer, CheckCircle2, ShieldAlert, User, Landmark, MapPin, Layers, Check, ExternalLink } from 'lucide-react';

interface PreFilledFormCardProps {
  formData: PreFilledFormData;
  language: Language;
}

export const PreFilledFormCard: React.FC<PreFilledFormCardProps> = ({
  formData,
  language
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPDF = () => {
    // Generate an HTML print window formatted as official Gujarat iKhedut Application Form
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>iKhedut Application Form - ${formData.application_ref}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #222; max-width: 800px; margin: auto; }
          .header { text-align: center; border-bottom: 2px solid #065f46; padding-bottom: 12px; }
          .title { font-size: 20px; font-weight: bold; color: #065f46; margin: 0; }
          .subtitle { font-size: 13px; color: #555; margin-top: 4px; }
          .ref-box { background: #f0fdf4; border: 1px dashed #059669; padding: 8px 12px; margin: 15px 0; border-radius: 6px; font-size: 13px; }
          .section-title { font-size: 14px; font-weight: bold; background: #e2e8f0; padding: 6px 10px; margin-top: 15px; border-left: 4px solid #059669; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
          th { background: #f8fafc; width: 35%; font-weight: 600; }
          .footer { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 12px; font-size: 11px; text-align: center; color: #666; }
          .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding: 0 20px; font-size: 12px; }
          .signature-box { text-align: center; }
          .signature-line { width: 180px; border-top: 1px solid #000; margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">ગુજરાત સરકાર - કૃષિ અને સહકાર વિભાગ</div>
          <div class="title" style="font-size: 16px; margin-top: 4px;">આઈ-ખેડૂત પોર્ટલ ઓનલાઈન સહાય અરજી ફોર્મ (Pre-Filled)</div>
          <div class="subtitle">Official iKhedut Portal Application Draft Form • ikhedut.gujarat.gov.in</div>
        </div>

        <div class="ref-box">
          <strong>અરજી સંદર્ભ નંબર (Ref No):</strong> ${formData.application_ref} &nbsp;&nbsp;|&nbsp;&nbsp;
          <strong>તારીખ:</strong> ${formData.created_at} &nbsp;&nbsp;|&nbsp;&nbsp;
          <strong>યોજના:</strong> ${formData.scheme_name_gu}
        </div>

        <div class="section-title">૧. ખેડૂત અને વ્યક્તિગત વિગત (Farmer Personal Details)</div>
        <table>
          <tr><th>અરજદારનું પૂરું નામ</th><td>${formData.farmer_name}</td></tr>
          <tr><th>આધાર કાર્ડ નંબર</th><td>${formData.aadhaar_number}</td></tr>
          <tr><th>સામાજિક કેટેગરી (જ્ઞાતિ)</th><td>${formData.caste_category}</td></tr>
          <tr><th>મોબાઈલ નંબર</th><td>${formData.mobile_number || '૭૫૭૫XXXXXX'}</td></tr>
        </table>

        <div class="section-title">૨. જમીન અને રહેઠાણ વિગત (Land & Location Details)</div>
        <table>
          <tr><th>જિલ્લો (District)</th><td>${formData.district}</td></tr>
          <tr><th>તાલુકો / ગામ</th><td>${formData.taluka || 'ગ્રામ્ય વિસ્તાર'}, ${formData.village || '-'}</td></tr>
          <tr><th>ધારણ કરેલ જમીન</th><td>${formData.land_size_acres} એકર</td></tr>
        </table>

        <div class="section-title">૩. બેંક ખાતાની વિગત (Direct Benefit Transfer - DBT Bank Details)</div>
        <table>
          <tr><th>બેંકનું નામ</th><td>${formData.bank_name}</td></tr>
          <tr><th>ખાતા નંબર</th><td>${formData.account_number}</td></tr>
          <tr><th>IFSC કોડ</th><td>${formData.ifsc_code}</td></tr>
        </table>

        <div class="signatures">
          <div class="signature-box">
            <div class="signature-line"></div>
            <div>અરજદાર ખેડૂતની સહી / અંગૂઠો</div>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div>ગ્રામ સેવક / વિસ્તરણ અધિકારી સહી-સિક્કો</div>
          </div>
        </div>

        <div class="footer">
          આ ફોર્મ આઈ-ખેડૂત AI સહાયક દ્વારા ડ્રાફ્ટ કરેલ છે. જરૂરી ૭/૧૨, ૮-અ અને બેંક પાસબુક નકલ સાથે ગ્રામ પંચાયત અથવા ikhedut.gujarat.gov.in પર સબમિટ કરવું.
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }, 350);
    }
  };

  return (
    <div className="mt-3 p-4 rounded-xl bg-linear-to-br from-amber-50/70 via-stone-50 to-emerald-50/50 dark:from-stone-900 dark:via-stone-900 dark:to-emerald-950/30 border border-emerald-300 dark:border-emerald-700 shadow-sm text-xs sm:text-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
            <FileDown className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              {language === 'gu' ? 'તૈયાર કરેલ આઈ-ખેડૂત અરજી ફોર્મ' : 'Pre-Filled iKhedut Application Form'}
            </div>
            <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
              Ref: <span className="font-bold text-emerald-700 dark:text-emerald-400">{formData.application_ref}</span>
            </div>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-[11px] font-bold border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {language === 'gu' ? '૧૦૦% ડ્રાફ્ટ તૈયાર' : 'Ready to Download'}
        </span>
      </div>

      {/* Structured Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 text-xs">
        <div className="p-2.5 rounded-lg bg-white/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/60 flex items-center gap-2.5">
          <User className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-stone-500 dark:text-stone-400 text-[10px] block">{language === 'gu' ? 'ખેડૂતનું નામ' : 'Farmer Name'}</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">{formData.farmer_name}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-white/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/60 flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-stone-500 dark:text-stone-400 text-[10px] block">{language === 'gu' ? 'યોજના' : 'Applied Scheme'}</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200 truncate block max-w-[200px]">
              {language === 'gu' ? formData.scheme_name_gu : formData.scheme_name}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-white/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/60 flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-stone-500 dark:text-stone-400 text-[10px] block">{language === 'gu' ? 'જિલ્લો અને જમીન' : 'District & Land'}</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              {formData.district} • {formData.land_size_acres} એકર
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-white/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/60 flex items-center gap-2.5">
          <Landmark className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-stone-500 dark:text-stone-400 text-[10px] block">{language === 'gu' ? 'DBT બેંક & આધાર' : 'Bank & Aadhaar'}</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              {formData.bank_name} ({formData.aadhaar_number})
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-amber-300" />
              {language === 'gu' ? 'પ્રિન્ટ / PDF ડાઉનલોડ શરૂ...' : 'Opening PDF...'}
            </>
          ) : (
            <>
              <Printer className="w-4 h-4" />
              {language === 'gu' ? 'ડાઉનલોડ પ્રિ-ફિલ્ડ PDF ફોર્મ' : 'Download Pre-filled PDF'}
            </>
          )}
        </button>

        <a
          href="https://ikhedut.gujarat.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 rounded-lg bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-emerald-800 dark:text-emerald-300 border border-stone-300 dark:border-stone-700 font-medium text-xs flex items-center gap-1.5 transition-colors"
        >
          <span>ikhedut.gujarat.gov.in</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
