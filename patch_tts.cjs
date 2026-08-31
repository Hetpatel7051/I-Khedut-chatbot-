const fs = require('fs');
let code = fs.readFileSync('src/hooks/useChat.ts', 'utf8');

// Replace speakWithBrowserSpeech entirely
const newSpeakWithBrowserSpeech = `
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
      .replace(/\\n+/g, '. ')
      .replace(/[*#_~\\\[\\\]]/g, ' ')
      .replace(/[🙏🚜🍎🐄💧🐟🌱📝🔍💡•→✓✅❌📊📋🌾🥕🌻🍞🧵🌿🥦🌶️₹]/g, ' ')
      .replace(/\\s+/g, ' ')
      .trim();

    if (language === 'gu') {
      // Remove English name translations inside parentheses
      cleanText = cleanText.replace(/\\([A-Za-z0-9\\s.,\\/-]+\\)/g, ' ');
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
`;

code = code.replace(
  /const speakWithBrowserSpeech = useCallback\(\(text: string, messageId: string\) => \{[\s\S]*?\}, \[language\]\);/,
  newSpeakWithBrowserSpeech.trim()
);

fs.writeFileSync('src/hooks/useChat.ts', code);
