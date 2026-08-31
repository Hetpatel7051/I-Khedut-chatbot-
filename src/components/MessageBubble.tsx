import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  User, 
  Bot, 
  Sparkles, 
  Mic, 
  ShieldCheck, 
  BookOpen, 
  Share2, 
  Image as ImageIcon 
} from 'lucide-react';
import { ChatMessage, Language, Scheme } from '../types';
import { SchemeCard } from './SchemeCard';
import { ApplicationStatusCard } from './ApplicationStatusCard';
import { MarketWeatherCard } from './MarketWeatherCard';
import { PreFilledFormCard } from './PreFilledFormCard';
import { DocumentVerificationCard } from './DocumentVerificationCard';
import { CategoryPicker } from './CategoryPicker';

interface MessageBubbleProps {
  message: ChatMessage;
  language: Language;
  farmerName?: string;
  isPlayingAudio: boolean;
  onPlayAudio: (id: string, text: string, audioBase64?: string) => void;
  onStopAudio: () => void;
  onOpenChecklist?: (scheme: Scheme) => void;
  onSelectCategory?: (categoryName: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  language,
  farmerName,
  isPlayingAudio,
  onPlayAudio,
  onStopAudio,
  onOpenChecklist,
  onSelectCategory
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayName = farmerName || 'ખેડૂત મિત્ર (Farmer)';

  const categoryChips = [
    { id: 'khetiwadi', label_gu: '🌾 ખેતીવાડી (Agriculture)', label_en: '🌾 Agriculture (Khetiwadi)', query: 'ખેતીવાડી યોજનાઓ (Agriculture Schemes)' },
    { id: 'bagayat', label_gu: '🍎 બાગાયત (Horticulture)', label_en: '🍎 Horticulture (Bagayat)', query: 'બાગાયત યોજનાઓ (Horticulture Schemes)' },
    { id: 'pashupalan', label_gu: '🐄 પશુપાલન (Animal Husbandry)', label_en: '🐄 Animal Husbandry (Pashupalan)', query: 'પશુપાલન યોજનાઓ (Animal Husbandry Schemes)' },
    { id: 'sinchai', label_gu: '💧 જળ સિંચાઈ (Irrigation)', label_en: '💧 Irrigation (Jal Sinchai)', query: 'જળ સિંચાઈ યોજનાઓ (Irrigation Schemes)' }
  ];

  return (
    <div 
      id={`message-${message.id}`}
      className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'} my-3`}
    >
      <div className={`flex gap-2.5 max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
          isUser 
            ? 'bg-amber-500 text-emerald-950 font-bold' 
            : 'bg-emerald-800 text-amber-300 font-bold'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Card Container */}
        <div className={`rounded-2xl px-4 py-3 shadow-sm border ${
          isUser 
            ? 'bg-emerald-700 text-white border-emerald-600 rounded-tr-none' 
            : 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-800 rounded-tl-none'
        }`}>
          {/* Header indicator for voice input / citations */}
          <div className="flex items-center justify-between gap-4 mb-1.5 text-[11px] opacity-80 border-b border-black/5 dark:border-white/5 pb-1">
            <span className="font-semibold flex items-center gap-1">
              {isUser ? (
                <>
                  <span className="truncate max-w-[200px]">{displayName}</span>
                  {message.isVoiceInput && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-400 text-emerald-950 text-[10px] font-bold shrink-0">
                      <Mic className="w-2.5 h-2.5" /> વોઈસ
                    </span>
                  )}
                  {message.imageDataUrl && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-sky-300 text-sky-950 text-[10px] font-bold shrink-0">
                      <ImageIcon className="w-2.5 h-2.5" /> ફોટો
                    </span>
                  )}
                </>
              ) : (
                <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  આઈ-ખેડૂત AI સલાહકાર
                </span>
              )}
            </span>
            <span className="text-[10px]">{message.timestamp}</span>
          </div>

          {/* Uploaded Image Thumbnail (for User verification query) */}
          {message.imageDataUrl && (
            <div className="my-2 rounded-xl overflow-hidden border border-emerald-400/40 max-w-xs shadow-xs">
              <img 
                src={message.imageDataUrl} 
                alt="Uploaded Document" 
                className="w-full h-auto max-h-48 object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Main Markdown Text Body */}
          <div className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-stone-800 dark:text-stone-200'}`}>
            <div className="markdown-body space-y-2">
              <Markdown>{message.content}</Markdown>
            </div>
          </div>

          {/* Feature 1: Interactive Category Picker (6 Official iKhedut Categories) */}
          {!isUser && (message.showCategoryPicker || message.showCategoryChips || message.intent === 'category_list' || message.intent === 'category_greeting') && (
            <CategoryPicker
              language={language}
              selectedCategoryId={message.selectedCategoryId}
              onSelectCategory={(catId, catName) => {
                if (onSelectCategory) {
                  onSelectCategory(catName || catId);
                }
              }}
            />
          )}

          {/* Feature 5: Multimodal Document Verification Result Widget */}
          {message.verificationResult && (
            <DocumentVerificationCard 
              result={message.verificationResult} 
              language={language} 
            />
          )}

          {/* Feature 2: Application Status Tracker Widget */}
          {message.applicationStatus && (
            <ApplicationStatusCard 
              statusData={message.applicationStatus} 
              language={language} 
            />
          )}

          {/* Feature 3: Live Mandi APMC Prices & Weather Widget */}
          {(message.marketPrices || message.weatherData) && (
            <MarketWeatherCard 
              marketPrices={message.marketPrices} 
              weatherData={message.weatherData} 
              language={language} 
            />
          )}

          {/* Feature 4: Pre-Filled Form & PDF Download Widget */}
          {message.prefilledForm && (
            <PreFilledFormCard 
              formData={message.prefilledForm} 
              language={language} 
            />
          )}

          {/* Assistant Action Bar: Listen in Gujarati & Copy Button */}
          {!isUser && (
            <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
              {/* Dedicated "Listen in Gujarati" Audio Button */}
              <button
                id={`listen-btn-${message.id}`}
                onClick={() => isPlayingAudio ? onStopAudio() : onPlayAudio(message.id, message.content, message.audioBase64)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${
                  isPlayingAudio 
                    ? 'bg-amber-500 text-emerald-950 ring-2 ring-amber-400 animate-pulse'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}
                title="ગુજરાતી અવાજમાં સાંભળો"
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-emerald-950" />
                    <span>અવાજ બંધ કરો (Stop Voice)</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{language === 'gu' ? 'ગુજરાતીમાં સાંભળો (Listen)' : language === 'hi' ? 'हिंदी में सुनें' : 'Listen in Audio'}</span>
                  </>
                )}
              </button>

              {/* Citations & Copy */}
              <div className="flex items-center gap-2">
                {message.citations && message.citations.length > 0 && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    સત્તાવાર નિયમો પ્રમાણિત
                  </span>
                )}

                <button
                  onClick={handleCopy}
                  className="p-1 rounded text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                  title="જવાબ કોપી કરો"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Embedded Matched Scheme Cards */}
      {message.matchedSchemes && message.matchedSchemes.length > 0 && (
        <div className="w-full pl-10 pr-2 space-y-3 mt-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>સંબંધિત સત્તાવાર યોજનાઓ (Verified Schemes):</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {message.matchedSchemes.map((sch) => (
              <SchemeCard 
                key={sch.id} 
                scheme={sch} 
                language={language}
                onOpenChecklist={onOpenChecklist}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
