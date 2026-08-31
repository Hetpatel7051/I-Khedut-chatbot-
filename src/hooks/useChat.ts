import { useState, useCallback, useEffect, useRef } from 'react';
import { ChatMessage, FarmerProfile, Language, Scheme } from '../types';
import { sendMessageToAI, fetchTTSAudio } from '../services/api';
import { IKHEDUT_SCHEMES } from '../data/schemes';

const INITIAL_PROFILE: FarmerProfile = {
  name: 'રાજુભાઈ પટેલ (Rajubhai Patel)',
  district: 'Rajkot (રાજકોટ)',
  land_size_acres: 4.0,
  land_unit: 'acres',
  caste_category: 'General',
  farmer_type: 'small',
  primary_crops: ['Cotton (કપાસ)', 'Groundnut (મગફળી)'],
  has_water_source: true,
  has_tractor: false,
  has_desi_cow: true
};

export function useChat() {
  const [language, setLanguage] = useState<Language>('gu');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(INITIAL_PROFILE);
  const [currentlyPlayingAudioId, setCurrentlyPlayingAudioId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize farmer profile from storage
  useEffect(() => {
    const saved = localStorage.getItem('ikhedut_farmer_profile');
    if (saved) {
      try {
        setFarmerProfile(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Initial welcome greeting based on language and farmer name
  useEffect(() => {
    if (messages.length === 0) {
      const farmerFirstName = farmerProfile.name ? farmerProfile.name.split(' ')[0] : 'ખેડૂત મિત્ર';
      const welcomeMessage: ChatMessage = {
        id: 'welcome-1',
        sender: 'assistant',
        content: language === 'gu'
          ? `🙏 **નમસ્તે ${farmerProfile.name || 'ખેડૂત મિત્ર'}! હું આઈ-ખેડૂત પોર્ટલ AI સહાયક છું.**\n\nહું તમને ગુજરાત સરકારની વિવિધ સહાય યોજનાઓ, સબસિડીના ટકાવારી, પાત્રતા (૭/૧૨, ૮-અ જમીન રેકોર્ડ્સ) અને જરૂરી કાગળો વિશે સંપૂર્ણ માર્ગદર્શન આપી શકું છું.\n\nતમારી પ્રોફાઈલ મુજબ: **${farmerProfile.district}**, **${farmerProfile.land_size_acres} એકર જમીન**, **${farmerProfile.caste_category} કેટેગરી** માટે યોજનાઓ ચકાસી શકાય છે.\n\nતમે **માઇક બટન દબાવીને બોલીને** અથવા નીચે આપેલા પ્રશ્નો પર ક્લિક કરીને પૂછી શકો છો:\n• *ટ્રેક્ટર સહાય ૨૦૨૫*\n• *ટપક સિંચાઈ ૭૦% સબસિડી*\n• *દેશી ગાય નિભાવ ખર્ચ (₹૯૦૦/માસ)*\n• *કાંટાળી તાર વાડ યોજના*`
          : language === 'hi'
          ? `🙏 **नमस्ते ${farmerProfile.name || 'किसान मित्र'}! मैं आई-खेड़ूत पोर्टल AI सहायक हूँ।**\n\nमैं आपको गुजरात सरकार की विभिन्न कृषि योजनाओं, सब्सिडी, पात्रता और आवश्यक दस्तावेजों के बारे में जानकारी देने के लिए यहाँ हूँ। आप बोलकर या लिखकर प्रश्न पूछ सकते हैं।`
          : `🙏 **Welcome ${farmerProfile.name || 'Farmer'}! I am your iKhedut Portal AI Assistant.**\n\nI can help you explore Gujarat Government agricultural subsidies, calculate eligibility, and generate document checklists. You can use voice recording in Gujarati/Hindi/English or type your question below!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: language,
        matchedSchemes: [IKHEDUT_SCHEMES[0], IKHEDUT_SCHEMES[1]]
      };
      setMessages([welcomeMessage]);
    }
  }, [language, farmerProfile.name]);

  const stopAudioPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      (window as any)._speechUtterances = [];
    }
    setCurrentlyPlayingAudioId(null);
  }, []);

  // Keep utterances in memory globally to prevent Chrome garbage collection bug
  (window as any)._speechUtterances = [];

  const speakWithBrowserSpeech = useCallback((text: string, messageId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setCurrentlyPlayingAudioId(null);
      return;
    }

    // Cancel any previous utterance
    window.speechSynthesis.cancel();
    (window as any)._speechUtterances = [];

    // Replace line breaks with periods to ensure natural pauses in speech
    let cleanText = text
      .replace(/\n+/g, '. ')
      .replace(/[*#_~\[\]]/g, ' ')
      .replace(/[🙏🚜🍎🐄💧🐟🌱📝🔍💡•→✓✅❌📊📋🌾🥕🌻🍞🧵🌿🥦🌶️₹]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (language === 'gu') {
      // Remove English name translations inside parentheses
      cleanText = cleanText.replace(/\([A-Za-z0-9\s.,\/-]+\)/g, ' ');
    }

    // Advanced sentence boundary detection for Gujarati/Hindi/English
    const chunks = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    
    let currentIndex = 0;

    const playNextChunk = () => {
      if (currentIndex >= chunks.length) {
        setCurrentlyPlayingAudioId(null);
        (window as any)._speechUtterances = [];
        return;
      }

      const chunkText = chunks[currentIndex].trim();
      if (!chunkText) {
        currentIndex++;
        playNextChunk();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunkText);
      (window as any)._speechUtterances.push(utterance); // Prevent GC

      const voices = window.speechSynthesis.getVoices();
      if (language === 'gu') {
        const guVoice = voices.find(v => v.lang.includes('gu') || v.name.toLowerCase().includes('gujarati'));
        const hiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.lang.includes('IN'));
        if (guVoice) {
          utterance.voice = guVoice;
          utterance.lang = 'gu-IN';
        } else if (hiVoice) {
          utterance.voice = hiVoice;
          utterance.lang = 'hi-IN';
        } else {
          utterance.lang = 'gu-IN';
        }
      } else if (language === 'hi') {
        const hiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'));
        if (hiVoice) utterance.voice = hiVoice;
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-IN';
      }

      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        currentIndex++;
        playNextChunk();
      };
      
      utterance.onerror = (e) => {
        console.warn('Speech synthesis error on chunk:', e);
        // Sometimes "interrupted" happens if we cancel, just abort cleanly
        if (e.error !== 'interrupted') {
          currentIndex++;
          playNextChunk();
        } else {
          setCurrentlyPlayingAudioId(null);
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    // Start playing
    playNextChunk();
  }, [language]);

  const playAudio = useCallback(async (messageId: string, text: string, base64Audio?: string) => {
    if (currentlyPlayingAudioId === messageId) {
      stopAudioPlayback();
      return;
    }

    stopAudioPlayback();
    setCurrentlyPlayingAudioId(messageId);

    // 1. If message already has Base64 Audio attached
    if (base64Audio && base64Audio.length > 50) {
      try {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        audioRef.current = audio;
        audio.onended = () => setCurrentlyPlayingAudioId(null);
        audio.onerror = () => {
          speakWithBrowserSpeech(text, messageId);
        };
        await audio.play();
        return;
      } catch (e) {
        console.warn('Audio playback error, falling back:', e);
      }
    }

    // 2. Fetch server-side natural Gujarati TTS audio stream
    try {
      const fetchedBase64 = await fetchTTSAudio(text, language);
      if (fetchedBase64 && fetchedBase64.length > 50) {
        const audio = new Audio(`data:audio/mp3;base64,${fetchedBase64}`);
        audioRef.current = audio;
        audio.onended = () => setCurrentlyPlayingAudioId(null);
        audio.onerror = () => {
          speakWithBrowserSpeech(text, messageId);
        };
        await audio.play();
        return;
      }
    } catch (e) {
      console.warn('Server TTS fetch failed, using browser synthesis:', e);
    }

    // 3. Fallback to Web Speech API
    speakWithBrowserSpeech(text, messageId);
  }, [currentlyPlayingAudioId, stopAudioPlayback, language, speakWithBrowserSpeech]);

  const sendMessage = useCallback(async (
    userText: string,
    isVoice: boolean = false,
    imageDataUrl?: string,
    imageMimeType?: string,
    audioBase64?: string,
    audioMimeType?: string
  ) => {
    if (!userText.trim() && !imageDataUrl && !audioBase64) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: language,
      isVoiceInput: isVoice,
      imageDataUrl: imageDataUrl,
      imageMimeType: imageMimeType
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map(m => ({
        sender: m.sender as 'user' | 'assistant',
        content: m.content
      }));

      const res = await sendMessageToAI({
        message: userText,
        language: language,
        farmer_profile: farmerProfile,
        image_base64: imageDataUrl,
        image_mime_type: imageMimeType,
        audio_base64: audioBase64,
        audio_mime_type: audioMimeType,
        history: historyPayload
      });

      // Match full schemes from our database if IDs are returned
      let matchedSchemes: Scheme[] = [];
      if (res.matched_schemes && res.matched_schemes.length > 0) {
        matchedSchemes = res.matched_schemes;
      } else {
        // Semantic keyword association
        const q = userText.toLowerCase();
        matchedSchemes = IKHEDUT_SCHEMES.filter(s => 
          q.includes(s.name_gu) || 
          q.includes(s.name_en.toLowerCase()) || 
          s.tags.some(t => q.includes(t.toLowerCase()))
        );
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: res.response_text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: language,
        matchedSchemes: matchedSchemes.length > 0 ? matchedSchemes : undefined,
        audioBase64: res.audio_base64,
        citations: res.citations,
        intent: res.intent,
        showCategoryChips: res.show_category_chips,
        showCategoryPicker: res.show_category_picker || res.show_category_chips || res.intent === 'category_list',
        categoriesList: res.categories_list,
        selectedCategoryId: res.selected_category_id,
        applicationStatus: res.application_status,
        marketPrices: res.market_prices,
        weatherData: res.weather_data,
        prefilledForm: res.prefilled_form,
        verificationResult: res.verification_result,
        subsidyEstimate: res.subsidy_estimate
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If user queried with voice, automatically trigger voice playback for seamless accessible experience
      if (isVoice && res.response_text) {
        setTimeout(() => {
          playAudio(assistantMessage.id, assistantMessage.content, assistantMessage.audioBase64);
        }, 300);
      }
    } catch (err) {
      console.error('Failed to get AI response:', err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        content: language === 'gu'
          ? 'ક્ષમા કરશો, માહિતી મેળવવામાં ક્ષતિ આવી છે. કૃપા કરીને ફરી પ્રયાસ કરો.'
          : 'Sorry, there was an issue retrieving the scheme data. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: language
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [language, messages, farmerProfile, playAudio]);

  const updateProfile = useCallback((newProfile: FarmerProfile) => {
    setFarmerProfile(newProfile);
    localStorage.setItem('ikhedut_farmer_profile', JSON.stringify(newProfile));

    // Post an immediate profile confirmation notification in the chat
    const profileUpdateMsg: ChatMessage = {
      id: `profile-update-${Date.now()}`,
      sender: 'assistant',
      content: language === 'gu'
        ? `✅ **ખેડૂત પ્રોફાઈલ સફળતાપૂર્વક અપડેટ થઈ ગઈ છે:**\n\n• ખેડૂતનું નામ: **${newProfile.name}**\n• જિલ્લો: **${newProfile.district}**\n• જમીન: **${newProfile.land_size_acres} ${newProfile.land_unit === 'acres' ? 'એકર' : 'વીઘા'}**\n• જ્ઞાતિ/કેટેગરી: **${newProfile.caste_category}**\n• વાવેતર પાક: **${newProfile.primary_crops.join(', ')}**\n\nહવે આઈ-ખેડૂત સહાયક તમને **${newProfile.name}** તરીકે સંબોધશે અને તમારી વિગતો મુજબ સચોટ સબસિડી ગણતરી કરશે.`
        : language === 'hi'
        ? `✅ **किसान प्रोफाइल सफलतापूर्वक अपडेट हो गई है:**\n\n• नाम: **${newProfile.name}**\n• जिला: **${newProfile.district}**\n• भूमि: **${newProfile.land_size_acres} ${newProfile.land_unit === 'acres' ? 'एकड़' : 'बीघा'}**\n• श्रेणी: **${newProfile.caste_category}**`
        : `✅ **Farmer profile successfully updated:**\n\n• Name: **${newProfile.name}**\n• District: **${newProfile.district}**\n• Land: **${newProfile.land_size_acres} ${newProfile.land_unit}**\n• Category: **${newProfile.caste_category}**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: language
    };
    setMessages(prev => [...prev, profileUpdateMsg]);
  }, [language]);

  const clearChat = useCallback(() => {
    stopAudioPlayback();
    setMessages([]);
  }, [stopAudioPlayback]);

  return {
    language,
    setLanguage,
    messages,
    isLoading,
    farmerProfile,
    updateProfile,
    sendMessage,
    clearChat,
    currentlyPlayingAudioId,
    playAudio,
    stopAudioPlayback
  };
}
