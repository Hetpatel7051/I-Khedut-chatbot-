import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Trash2,
  Sparkles,
  Paperclip,
  X,
  Tractor,
  Droplets,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import { ChatMessage, Language, Scheme, FarmerProfile } from "../types";
import { MessageBubble } from "./MessageBubble";
import { AudioRecorder } from "./AudioRecorder";
import { useAudioRecorder } from "../hooks/useAudioRecorder";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  language: Language;
  farmerProfile: FarmerProfile;
  currentlyPlayingAudioId: string | null;
  onSendMessage: (
    text: string,
    isVoice?: boolean,
    imageDataUrl?: string,
    imageMimeType?: string,
    audioBase64?: string,
    audioMimeType?: string,
  ) => void;
  onClearChat: () => void;
  onPlayAudio: (id: string, text: string, audioBase64?: string) => void;
  onStopAudio: () => void;
  onOpenChecklist: (scheme: Scheme) => void;
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
}) => {
  const [inputMessage, setInputMessage] = useState("");
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
    cancelRecording,
  } = useAudioRecorder();

  // Scroll to the top of the latest assistant response like a real AI chat
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === "assistant") {
        latestAssistantRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages.length]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert(
        language === "gu"
          ? "કૃપા કરીને 8MB થી નાની સાઈઝનો ફોટો અપલોડ કરો."
          : "Please upload an image smaller than 8MB.",
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSelectedImage({
        dataUrl: result,
        mimeType: file.type || "image/jpeg",
        fileName: file.name,
      });
      if (!inputMessage.trim()) {
        setInputMessage(
          language === "gu"
            ? "આ ૭/૧૨ અથવા આધાર કાર્ડ દસ્તાવેજ ચકાસો (Verify this document)"
            : "Please verify this Gujarat land/identity document",
        );
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputMessage.trim() && !selectedImage) || isLoading) return;

    const messageText =
      inputMessage.trim() ||
      (language === "gu"
        ? "દસ્તાવેજ ચકાસણી વિનંતી"
        : "Document verification request");
    onSendMessage(
      messageText,
      false,
      selectedImage?.dataUrl,
      selectedImage?.mimeType,
    );

    setInputMessage("");
    setSelectedImage(null);
  };

  const handleStartVoice = async () => {
    try {
      await startRecording(language);
    } catch (e) {
      console.warn("Voice permission or hardware issue:", e);
    }
  };

  const handleStopVoice = async () => {
    const result = await stopRecording();
    if (result.text && result.text.trim()) {
      onSendMessage(
        result.text.trim(),
        true,
        null,
        null,
        result.base64,
        "audio/webm",
      );
    } else if (transcription && transcription.trim()) {
      onSendMessage(
        transcription.trim(),
        true,
        null,
        null,
        result.base64,
        "audio/webm",
      );
    } else if (result.base64) {
      // Send audio even if STT failed so the backend can process it!
      onSendMessage("", true, null, null, result.base64, "audio/webm");
    }
  };

  const quickActions =
    language === "gu"
      ? [
          {
            icon: Tractor,
            label: "ટ્રેક્ટર સહાય",
            detail: "સબસિડી અને જરૂરી કાગળો",
            tone: "leaf",
            prompt:
              "મને ટ્રેક્ટર સહાય યોજના વિશે માહિતી આપો: સબસિડી કેટલી મળે અને કયા દસ્તાવેજો જોઈએ?",
          },
          {
            icon: Droplets,
            label: "ટપક સિંચાઈ",
            detail: "પિયત માટેની સહાય જાણો",
            tone: "water",
            prompt: "ટપક પિયત પદ્ધતિ માટે કેટલી સબસિડી મળે?",
          },
          {
            icon: ClipboardList,
            label: "અરજીની સ્થિતિ",
            detail: "તમારી અરજી તપાસો",
            tone: "harvest",
            prompt: "મારી આઈ-ખેડૂત અરજીનું સ્ટેટસ કેવી રીતે તપાસું?",
          },
          {
            icon: TrendingUp,
            label: "બજાર ભાવ",
            detail: "નજીકના યાર્ડના ભાવ",
            tone: "leaf",
            prompt:
              "આજના ગોંડલ માર્કેટ યાર્ડમાં કપાસ અને મગફળીના બજાર ભાવ જણાવો",
          },
        ]
      : language === "hi"
        ? [
            {
              icon: Tractor,
              label: "ट्रैक्टर सहायता",
              detail: "सब्सिडी और जरूरी दस्तावेज़",
              tone: "leaf",
              prompt:
                "ट्रैक्टर सहायता योजना में कितनी सब्सिडी मिलती है और कौन से दस्तावेज़ चाहिए?",
            },
            {
              icon: Droplets,
              label: "ड्रिप सिंचाई",
              detail: "सिंचाई सहायता जानें",
              tone: "water",
              prompt: "ड्रिप सिंचाई के लिए कितनी सब्सिडी उपलब्ध है?",
            },
            {
              icon: ClipboardList,
              label: "आवेदन की स्थिति",
              detail: "अपना आवेदन जांचें",
              tone: "harvest",
              prompt: "मैं अपने आई-खेड़ूत आवेदन की स्थिति कैसे जांचूं?",
            },
            {
              icon: TrendingUp,
              label: "मंडी भाव",
              detail: "नजदीकी मंडी के भाव",
              tone: "leaf",
              prompt: "आज गोंडल मंडी में कपास और मूंगफली के भाव क्या हैं?",
            },
          ]
        : [
            {
              icon: Tractor,
              label: "Tractor assistance",
              detail: "Subsidy and required documents",
              tone: "leaf",
              prompt:
                "Tell me about tractor assistance: subsidy amount and required documents.",
            },
            {
              icon: Droplets,
              label: "Drip irrigation",
              detail: "Explore irrigation support",
              tone: "water",
              prompt: "What subsidy is available for drip irrigation?",
            },
            {
              icon: ClipboardList,
              label: "Application status",
              detail: "Track an application",
              tone: "harvest",
              prompt: "How can I check my iKhedut application status?",
            },
            {
              icon: TrendingUp,
              label: "Market prices",
              detail: "Check nearby mandi rates",
              tone: "leaf",
              prompt:
                "What are today Gondal market prices for groundnut and cotton?",
            },
          ];

  const conversationMessages = messages.filter(
    (message) => message.id !== "welcome-1",
  );
  const isNewConversation = conversationMessages.length === 0;
  const farmerFirstName = farmerProfile.name.trim().split(" ")[0];

  return (
    <div
      id="chat-interface"
      className="agri-field-surface flex-1 min-h-0 flex flex-col overflow-hidden"
    >
      {/* Messages Scroll Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 space-y-2 overscroll-contain">
        <div
          className={`w-full max-w-3xl mx-auto min-h-full flex flex-col py-6 ${isNewConversation ? "justify-center" : "justify-start"}`}
        >
          {isNewConversation ? (
            <section className="w-full max-w-2xl mx-auto">
              <div className="mb-6 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-800">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {language === "gu"
                    ? "ખેડૂત સહાય કેન્દ્ર"
                    : language === "hi"
                      ? "किसान सहायता केंद्र"
                      : "Farmer support"}
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-stone-900">
                  {language === "gu"
                    ? `નમસ્તે, ${farmerFirstName}`
                    : language === "hi"
                      ? `नमस्ते, ${farmerFirstName}`
                      : `Hello, ${farmerFirstName}`}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">
                  {language === "gu"
                    ? "યોજનાઓ, સબસિડી, અરજી અને બજાર ભાવ માટે સહાય મેળવો."
                    : language === "hi"
                      ? "योजनाओं, सब्सिडी, आवेदन और मंडी भाव की जानकारी पाएं।"
                      : "Get help with schemes, subsidies, applications, and market prices."}
                </p>
              </div>

              <div className="mb-2 flex items-center gap-3">
                <h3 className="text-xs font-semibold text-stone-700">
                  {language === "gu"
                    ? "ઝડપી સેવાઓ"
                    : language === "hi"
                      ? "त्वरित सेवाएं"
                      : "Quick services"}
                </h3>
                <span className="h-px flex-1 bg-emerald-200/70" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  const iconTone =
                    action.tone === "water"
                      ? "bg-sky-50 text-sky-800 group-hover:bg-white"
                      : action.tone === "harvest"
                        ? "bg-amber-50 text-amber-800 group-hover:bg-white"
                        : "bg-emerald-50 text-emerald-800 group-hover:bg-white";
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => onSendMessage(action.prompt, false)}
                      className="group flex min-h-20 items-center gap-3 rounded-lg border border-emerald-100/90 bg-white/95 px-3.5 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-white hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${iconTone}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-stone-900">
                          {action.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-stone-500">
                          {action.detail}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ) : (
            conversationMessages.map((msg, idx) => {
              const isLastAssistant =
                msg.sender === "assistant" &&
                idx === conversationMessages.length - 1;
              return (
                <div
                  key={msg.id}
                  ref={isLastAssistant ? latestAssistantRef : null}
                >
                  <MessageBubble
                    message={msg}
                    language={language}
                    farmerName={farmerProfile.name}
                    isPlayingAudio={currentlyPlayingAudioId === msg.id}
                    onPlayAudio={onPlayAudio}
                    onStopAudio={onStopAudio}
                    onOpenChecklist={onOpenChecklist}
                    onSelectCategory={(catQuery) =>
                      onSendMessage(catQuery, false)
                    }
                  />
                </div>
              );
            })
          )}

          {/* Loading Bubble */}
          {isLoading && (
            <div className="flex items-center gap-3 my-2 animate-in fade-in">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 animate-spin text-white" />
              </div>
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm text-xs text-stone-600 dark:text-stone-300 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span>
                  {language === "gu"
                    ? "આઈ-ખેડૂત નિયમો, દસ્તાવેજ અને સબસિડી ચકાસી રહ્યો છું..."
                    : "Analyzing iKhedut guidelines, records & subsidy..."}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky Bottom Voice & Input Command Center */}
      <div className="shrink-0 bg-white border-t border-emerald-100 px-3 sm:px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] z-10">
        <div className="max-w-3xl mx-auto">
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
                    {language === "gu"
                      ? "૭/૧૨, ૮-અ અથવા આધાર કાર્ડ ચકાસણી માટે પસંદ કરેલ"
                      : "Selected for AI Vision Document Verification"}
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
                <span className="italic truncate">
                  {transcription || "બોલવાનું ચાલુ રાખો..."}
                </span>
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
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white text-emerald-700 transition-colors hover:bg-emerald-50"
              title={
                language === "gu"
                  ? "૭/૧૨ અથવા આધાર કાર્ડ ફોટો અપલોડ કરો (Vision Verification)"
                  : "Upload 7/12, 8-A or Aadhaar Image for Verification"
              }
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
                  language === "gu"
                    ? "તમારો પ્રશ્ન લખો, માઇકથી બોલો અથવા ૭/૧૨-આધાર ફોટો અપલોડ કરો..."
                    : language === "hi"
                      ? "अपना प्रश्न लिखें, बोलें या दस्तावेज़ अपलोड करें..."
                      : "Type query, speak via mic, or attach 7/12 document photo..."
                }
                disabled={isLoading || isRecording}
                className="w-full pl-4 pr-10 py-3 text-xs sm:text-sm rounded-lg border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-emerald-600 outline-none transition-all placeholder:text-stone-400"
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
              disabled={
                (!inputMessage.trim() && !selectedImage) ||
                isLoading ||
                isRecording
              }
              className="flex items-center justify-center w-11 h-11 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white transition-colors shrink-0 cursor-pointer"
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
