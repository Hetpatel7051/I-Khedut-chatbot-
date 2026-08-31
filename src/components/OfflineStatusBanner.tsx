import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Database, 
  CheckCircle2, 
  Info, 
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Language } from '../types';

interface OfflineStatusBannerProps {
  isOnline: boolean;
  language: Language;
}

export const OfflineStatusBanner: React.FC<OfflineStatusBannerProps> = ({
  isOnline,
  language
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isOnline && isDismissed) {
    return null;
  }

  // When offline, we ALWAYS show the alert so the farmer is aware
  if (!isOnline) {
    return (
      <div 
        id="offline-cache-alert-banner"
        className="bg-amber-600 dark:bg-amber-700 text-white px-3 sm:px-4 py-2 text-xs flex items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-2 border-b border-amber-500"
      >
        <div className="flex items-center gap-2.5 max-w-5xl mx-auto flex-1">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <WifiOff className="w-3.5 h-3.5 text-white animate-pulse" />
          </div>
          <div className="flex-1">
            <span className="font-bold mr-1.5">
              {language === 'gu' 
                ? '📡 ઓફલાઇન મોડ સક્રિય (Offline Cache Active):' 
                : language === 'hi'
                ? '📡 ऑफ़लाइन मोड सक्रिय (Offline Active):'
                : '📡 Offline Mode Active:'}
            </span>
            <span className="text-amber-100">
              {language === 'gu'
                ? 'ઇન્ટરનેટ કનેક્શન ન હોવા છતાં તમામ સરકારી યોજનાઓ, ૭/૧૨ કાગળો અને સબસિડી વિગતો સર્વિસ વર્કર કેશમાંથી ઉપલબ્ધ છે.'
                : language === 'hi'
                ? 'इंटरनेट न होने पर भी सभी सरकारी योजनाएं, 7/12 दस्तावेज और सब्सिडी विवरण कैश से उपलब्ध हैं।'
                : 'All government schemes, 7/12 criteria, and subsidy limits are available offline via Service Worker cache.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/20 text-[10px] font-mono">
            <Database className="w-3 h-3 text-amber-300" />
            SW Cache v1.2
          </span>
        </div>
      </div>
    );
  }

  // When online, render subtle connectivity status badge
  return null;
};
