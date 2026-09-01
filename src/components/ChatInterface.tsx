import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Trash2, 
  Sparkles, 
  Volume2, 
  HelpCircle, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck,
  Paperclip,
  Image as ImageIcon,
  X,
  FileCheck
} from 'lucide-react';
import { ChatMessage, Language, Scheme, FarmerProfile } from '../types';
import { MessageBubble } from './MessageBubble';
import { AudioRecorder } from './AudioRecorder';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  language: Language;
  farmerProfile: FarmerProfile;
  currentlyPlayingAudioId: string | null;
  onSendMessage: (text: string, isVoice?: boolean, imageDataUrl?: string, imageMimeType?: string) => void;
  onClearChat: () => void;
  onPlayAudio: (id: string, text: string, audioBase64?: string) => void;
  onStopAudio: () => void;
  onOpenChecklist: (scheme: Scheme) => void;
  onOpenCalculator: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  language,
  farmerProfile,
  currentlyPlayingAudioId,
  onSendMessage,
  onClearChat,
  onPlayAudio,
  onStopAudio,
  onOpenChecklist,
  onOpenCalculator
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<{
    dataUrl: string;
    mimeType: string;
    fileName: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const latestAssistantRef = useRef<HTMLDivElement | null>(null);

  const {
    isRecording,
    audioLevel,
    transcription,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording
  } = useAudioRecorder();

  // Scroll to the top of the latest assistant response like a real AI chat
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === 'assistant') {
        latestAssistantRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages.length]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert(language === 'gu' ? 'કૃપા કરીને 8MB થી નાની સાઈઝનો ફોટો અપલોડ કરો.' : 'Please upload an image smaller than 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSelectedImage({
        dataUrl: result,
        mimeType: file.type || 'image/jpeg',
        fileName: file.name
      });
      if (!inputMessage.trim()) {
        setInputMessage(language === 'gu' ? 'આ ૭/૧૨ અથવા આધાર કાર્ડ દસ્તાવેજ ચકાસો (Verify this document)' : 'Please verify this Gujarat land/identity document');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputMessage.trim() && !selectedImage) || isLoading) return;

    const messageText = inputMessage.trim() || (language === 'gu' ? 'દસ્તાવેજ ચકાસણી વિનંતી' : 'Document verification request');
    onSendMessage(
      messageText, 
      false, 
      selectedImage?.dataUrl, 
      selectedImage?.mimeType
    );

    setInputMessage('');
    setSelectedImage(null);
  };

  const handleStartVoice = async () => {
    try {
      await startRecording(language);
    } catch (e) {
      console.warn('Voice permission or hardware issue:', e);
    }
  };

  const handleStopVoice = async () => {
    const result = await stopRecording();
    if (result.text && result.text.trim()) {
      onSendMessage(result.text.trim(), true, null, null, result.base64, "audio/webm");
    } else if (transcription && transcription.trim()) {
      onSendMessage(transcription.trim(), true, null, null, result.base64, "audio/webm");
    } else if (result.base64) {
      // Send audio even if STT failed so the backend can process it!
      onSendMessage("", true, null, null, result.base64, "audio/webm");
    }
  };

  // Quick Agricultural Query Chips in Gujarati / English
  const quickChips = language === 'gu' ? [
    { label: '📋 યોજના વિભાગો (Categories)', prompt: 'ગુજરાત સરકારના આઈ-ખેડૂત પોર્ટલ પર ઉપલબ્ધ વિવિધ યોજનાઓની કેટેગરી અને વિભાગોનું લિસ્ટ બતાવો' },
    { label: '🚜 ટ્રેક્ટર સહાય ૨૦૨૫', prompt: 'મને ટ્રેક્ટર સહાય યોજના વિશે સંપૂર્ણ માહિતી આપો: સબસિડી કેટલી મળે અને ૭/૧૨ કાગળો ક્યા જોઈએ?' },
    { label: '💧 ટપક સિંચાઈ (૭૦% સહાય)', prompt: 'ટપક પિયત પદ્ધતિ (Drip Irrigation) GGRC માં કેટલી સબસિડી મળે?' },
    { label: '🐄 દેશી ગાય સહાય (₹૯૦૦/માસ)', prompt: 'દેશી ગાય નિભાવ ખર્ચ સહાય યોજનામાં દર મહિને ₹૯૦૦ કેવી રીતે મળે?' },
    { label: '🛡️ કાંટાળી તાર વાડ યોજના', prompt: 'ખેતરની ફરતે કાંટાળી તારની વાડ બનાવવા માટે સરકાર કેટલી સહાય આપે છે?' },
    { label: '🔍 અરજી સ્ટેટસ (Status)', prompt: 'મારી આઈ-ખેડૂત અરજીનું સ્ટેટસ શું છે? Application status IKH-2025-8841' },
    { label: '📊 ગોંડલ માર્કેટ ભાવ', prompt: 'આજના ગોંડલ માર્કેટ યાર્ડમાં કપાસ અને મગફળીના બજાર ભાવ જણાવો' },
    { label: '🌤️ ખેતી હવામાન', prompt: 'આજે ગુજરાતમાં ખેતી માટે હવામાન અને વરસાદની સ્થિતિ કેવી છે?' },
    { label: '📝 ઓનલાઈન અરજી કરવી છે', prompt: 'મારે આઈ-ખેડૂત પોર્ટલ પર નવી યોજના માટે અરજી કરવી છે (Apply now)' }
  ] : [
    { label: '📋 Scheme Categories', prompt: 'Show me the list of scheme categories and yojanas available on iKhedut portal' },
    { label: '🚜 Tractor Subsidy 2025', prompt: 'Tell me about Tractor Sahay Yojana, subsidy percentages and documents required.' },
    { label: '💧 Drip Irrigation (70% Subsidy)', prompt: 'What is the subsidy percentage for micro irrigation via GGRC?' },
    { label: '🐄 Desi Cow Maintenance (₹900/mo)', prompt: 'How to apply for indigenous cow monthly assistance of ₹900?' },
    { label: '🔍 Check Status (IKH-2025-8841)', prompt: 'Check my application status for ID IKH-2025-8841' },
    { label: '📊 Mandi Rates (Gondal)', prompt: 'What are today APMC mandi prices in Gondal for groundnut and cotton?' },
    { label: '📝 Apply Now', prompt: 'I want to apply for a subsidy scheme on iKhedut portal' }
  ];

  return (
    <div id="chat-interface" className="flex-1 min-h-0 flex flex-col bg-stone-100 dark:bg-stone-950 overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 space-y-2 overscroll-contain">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, idx) => {
            const isLastAssistant = msg.sender === 'assistant' && idx === messages.length - 1;
            return (
              <div key={msg.id} ref={isLastAssistant ? latestAssistantRef : null}>
                <MessageBubble
                  message={msg}
                  language={language}
                  farmerName={farmerProfile.name}
                  isPlayingAudio={currentlyPlayingAudioId === msg.id}
                  onPlayAudio={onPlayAudio}
                  onStopAudio={onStopAudio}
                  onOpenChecklist={onOpenChecklist}
                  onSelectCategory={(catQuery) => onSendMessage(catQuery, false)}
                />
              </div>
            );
          })}

          {/* Loading Bubble */}
          {isLoading && (
            <div className="flex items-center gap-3 my-2 animate-in fade-in">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              </div>
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm text-xs text-stone-600 dark:text-stone-300 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span>{language === 'gu' ? 'આઈ-ખેડૂત નિયમો, દસ્તાવેજ અને સબસિડી ચકાસી રહ્યો છું...' : 'Analyzing iKhedut guidelines, records & subsidy...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Quick Inquiry Chips */}
      <div className="shrink-0 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm border-t border-stone-200 dark:border-stone-800 px-3 sm:px-6 py-2 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 whitespace-nowrap shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            {language === 'gu' ? 'ઝડપી સેવાઓ:' : 'Quick Services:'}
          </span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendMessage(chip.prompt, false)}
              className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 whitespace-nowrap font-medium text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Voice & Input Command Center */}
      <div className="shrink-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 px-3 sm:px-6 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] z-10">
        <div className="max-w-4xl mx-auto">
          {/* Selected Document Image Preview Bar */}
          {selectedImage && (
            <div className="mb-2.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img 
                  src={selectedImage.dataUrl} 
                  alt="Document Thumbnail" 
                  className="w-10 h-10 object-cover rounded-lg border border-emerald-400 shrink-0" 
                  referrerPolicy="no-referrer"
                />
                <div className="truncate text-xs">
                  <span className="font-bold text-emerald-950 dark:text-emerald-200 block truncate">
                    📄 {selectedImage.fileName}
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                    {language === 'gu' ? '૭/૧૨, ૮-અ અથવા આધાર કાર્ડ ચકાસણી માટે પસંદ કરેલ' : 'Selected for AI Vision Document Verification'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-1 rounded-full text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                title="ફોટો હટાવો"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Live Voice Transcription Feedback Bar when recording */}
          {isRecording && (
            <div className="mb-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-between gap-2 text-xs text-red-900 dark:text-red-200 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold shrink-0">વોઈસ શબ્દો:</span>
                <span className="italic truncate">{transcription || 'બોલવાનું ચાલુ રાખો...'}</span>
              </div>
              <span className="text-[10px] text-red-600 dark:text-red-400 font-mono shrink-0">
                Live STT
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            {/* Hidden File Input for 7/12 & Aadhaar Document Verification */}
            <input 
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={handleImageFileChange}
              className="hidden"
            />

            {/* Upload Document Image Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isRecording}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 hover:bg-emerald-100 dark:bg-stone-800 dark:hover:bg-emerald-950 text-stone-600 hover:text-emerald-700 dark:text-stone-300 dark:hover:text-emerald-400 border border-stone-300 dark:border-stone-700 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
              title={language === 'gu' ? '૭/૧૨ અથવા આધાર કાર્ડ ફોટો અપલોડ કરો (Vision Verification)' : 'Upload 7/12, 8-A or Aadhaar Image for Verification'}
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Audio Voice Button */}
            <AudioRecorder
              isRecording={isRecording}
              audioLevel={audioLevel}
              transcription={transcription}
              isTranscribing={isTranscribing}
              language={language}
              onStartRecording={handleStartVoice}
              onStopRecording={handleStopVoice}
              onCancelRecording={cancelRecording}
            />

            {/* Text Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  language === 'gu'
                    ? 'તમારો પ્રશ્ન લખો, માઇકથી બોલો અથવા ૭/૧૨-આધાર ફોટો અપલોડ કરો...'
                    : language === 'hi'
                    ? 'अपना प्रश्न लिखें, बोलें या दस्तावेज़ अपलोड करें...'
                    : 'Type query, speak via mic, or attach 7/12 document photo...'
                }
                disabled={isLoading || isRecording}
                className="w-full pl-4 pr-10 py-2.5 text-xs sm:text-sm rounded-full border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600 outline-none transition-all placeholder:text-stone-400"
              />

              {/* Clear Text / Trash Button */}
              {messages.length > 1 && (
                <button
                  type="button"
                  onClick={onClearChat}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-red-600 transition-colors p-1"
                  title="ચેટ સાફ કરો"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={(!inputMessage.trim() && !selectedImage) || isLoading || isRecording}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
              title="મોકલો (Send)"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

