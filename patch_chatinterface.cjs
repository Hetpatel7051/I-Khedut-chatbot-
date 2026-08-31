const fs = require('fs');
let code = fs.readFileSync('src/components/ChatInterface.tsx', 'utf8');

// The onSendMessage type in ChatInterface needs to support the new arguments
code = code.replace(
  /onSendMessage: \(text: string, isVoice\?: boolean, imageDataUrl\?: string \| null, imageMimeType\?: string \| null\) => void;/,
  `onSendMessage: (text: string, isVoice?: boolean, imageDataUrl?: string | null, imageMimeType?: string | null, audioBase64?: string | null, audioMimeType?: string | null) => void;`
);

code = code.replace(
  /const handleStopVoice = async \(\) => {[\s\S]*?};/,
  `const handleStopVoice = async () => {
    const result = await stopRecording();
    if (result.text && result.text.trim()) {
      onSendMessage(result.text.trim(), true, null, null, result.base64, "audio/webm");
    } else if (transcription && transcription.trim()) {
      onSendMessage(transcription.trim(), true, null, null, result.base64, "audio/webm");
    } else if (result.base64) {
      // Send audio even if STT failed so the backend can process it!
      onSendMessage("", true, null, null, result.base64, "audio/webm");
    }
  };`
);
fs.writeFileSync('src/components/ChatInterface.tsx', code);
