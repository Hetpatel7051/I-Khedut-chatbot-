import React from 'react';
import { X, Bell, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Calendar, ExternalLink } from 'lucide-react';
import { Language } from '../types';

interface NewSchemesNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAskAboutScheme: (schemeName: string) => void;
}

export const NewSchemesNotificationModal: React.FC<NewSchemesNotificationModalProps> = ({
  isOpen,
  onClose,
  language,
  onAskAboutScheme
}) => {
  if (!isOpen) return null;

  const newNotifications = [
    {
      id: 'notif-1',
      title_gu: 'નવી જાહેરાત: ટ્રેક્ટર સહાય યોજના ૨૦૨૫-૨૬ (₹૬૦,૦૦૦ સુધી)',
      title_en: 'New Launch: Tractor Subsidy Yojana 2025-26 (Up to ₹60,000)',
      date: '૧ સપ્ટેમ્બર ૨૦૨૬',
      desc_gu: 'ગુજરાત સરકાર દ્વારા તમામ વર્ગના ખેડૂતો માટે આઈ-ખેડૂત પોર્ટલ પર ટ્રેક્ટર ખરીદી પર ૨૫% થી ૫૦% સુધીની સબસિડી જાહેર કરવામાં આવી છે. SC/ST અને મહિલા ખેડૂતોને મહત્તમ ₹૬૦,૦૦૦ સહાય.',
      desc_en: 'Gujarat Govt announces 25% to 50% subsidy on tractor purchases through iKhedut portal for 2025-26. Max ₹60,000 for SC/ST/Women farmers.',
      tag: 'ટ્રેક્ટર સહાય',
      urgent: true
    },
    {
      id: 'notif-2',
      title_gu: 'જીઓઆરસી (GGRC) ટપક સિંચાઈ યોજના - ૭૦% સબસિડી',
      title_en: 'GGRC Micro Irrigation Drip Subsidy - 70% Assistance',
      date: '૨૮ ઓગસ્ટ ૨૦૨૬',
      desc_gu: 'નાના અને સીમાંત ખેડૂતો માટે ટપક પિયત પદ્ધતિ (Drip Irrigation) પર ૭૦% સુધીની સબસિડી મંજૂર કરવામાં આવી છે. કુવો કે બોરવેલ ધરાવતા ખેડૂતો અરજી કરી શકે છે.',
      desc_en: 'Small and marginal farmers can avail up to 70% subsidy on micro drip irrigation through GGRC. Borewell/well source required.',
      tag: 'ટપક સિંચાઈ',
      urgent: false
    },
    {
      id: 'notif-3',
      title_gu: 'દેશી ગાય નિભાવ ખર્ચ સહાય યોજના (દર મહિને ₹૯૦૦)',
      title_en: 'Desi Cow Maintenance Assistance Scheme (₹900/Month)',
      date: '૨૫ ઓગસ્ટ ૨૦૨૬',
      desc_gu: 'પ્રાકૃતિક ખેતી કરતા અને ગીર કે કાંકરેજ દેશી ગાય ધરાવતા ખેડૂતોના ખાતામાં દર મહિને ₹૯૦૦ (વાર્ષિક ₹૧૦,૮૦૦) સીધા જમા કરવામાં આવશે.',
      desc_en: '₹900 per month (₹10,800/year) direct DB transfer for farmers maintaining indigenous Gir or Kankrej cows for natural farming.',
      tag: 'પશુપાલન સહાય',
      urgent: false
    },
    {
      id: 'notif-4',
      title_gu: 'ખેતરની ફરતે કાંટાળી તારની વાડ (Barbed Wire Fencing)',
      title_en: 'Farm Barbed Wire Fencing Subsidy Scheme',
      date: '૨૨ ઓગસ્ટ ૨૦૨૬',
      desc_gu: 'રોજ અને જંગલી પ્રાણીઓથી પાકનું રક્ષણ કરવા માટે ખેતરની ફરતે તારની વાડ બનાવવા માટે ૫૦% સુધીની આર્થિક સહાય આઈ-ખેડૂત પોર્ટલ પર ખુલ્લી છે.',
      desc_en: '50% financial assistance for installing barbed wire fencing around agricultural fields to protect crops from wild animals and stray cattle.',
      tag: 'તાર વાડ',
      urgent: false
    },
    {
      id: 'notif-5',
      title_gu: 'પ્રાકૃતિક ખેતી જીવામૃત કિટ અને ડ્રમ સહાય (₹૧,૨૪૮)',
      title_en: 'Zero-Budget Natural Farming Jeevamrut Kit & Drum Subsidy',
      date: '૨૦ ઓગસ્ટ ૨૦૨૬',
      desc_gu: 'પ્રાકૃતિક ખેતી અપનાવતા ખેડૂતોને પ્લાસ્ટિક ડ્રમ અને જીવામૃત બનાવવાની કિટ ખરીદવા માટે સહાય.',
      desc_en: 'Assistance for purchasing plastic drums and organic inputs kit for zero-budget natural farming practitioners in Gujarat.',
      tag: 'પ્રાકૃતિક ખેતી',
      urgent: false
    }
  ];

  return (
    <div 
      id="schemes-notification-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 px-5 py-4 text-white flex items-center justify-between gap-3 border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-md relative">
              <Bell className="w-5 h-5 animate-bounce" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                ૫
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>{language === 'gu' ? 'નવી સબસિડી યોજનાઓ અને સૂચનાઓ' : 'New Subsidy Schemes & Notifications'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Live Updates
                </span>
              </h3>
              <p className="text-xs text-emerald-200">
                {language === 'gu' 
                  ? 'ગુજરાત સરકાર અને આઈ-ખેડૂત પોર્ટલ પર તાજેતરમાં જાહેર થયેલ સહાય યોજનાઓ'
                  : 'Latest agricultural scheme announcements and subsidy notifications from Gujarat Govt'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="બંધ કરો"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5">
          {newNotifications.map((notif) => (
            <div
              key={notif.id}
              className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 hover:border-emerald-500/50 transition-all space-y-2 relative overflow-hidden"
            >
              {notif.urgent && (
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wider">
                  🔥 તાજેતરની જાહેરાત
                </div>
              )}

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {notif.tag}
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    {notif.date}
                  </span>
                </div>
              </div>

              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                {language === 'gu' ? notif.title_gu : notif.title_en}
              </h4>

              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {language === 'gu' ? notif.desc_gu : notif.desc_en}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-stone-200/80 dark:border-stone-700/60">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {language === 'gu' ? 'આઈ-ખેડૂત પોર્ટલ પર અરજી ચાલુ' : 'Application Active on iKhedut'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    onAskAboutScheme(notif.tag);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{language === 'gu' ? 'AI સહાયકને પૂછો' : 'Ask AI'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500">
          <span>Official Gujarat Government iKhedut Portal Notifications 2026-27</span>
        </div>
      </div>
    </div>
  );
};
