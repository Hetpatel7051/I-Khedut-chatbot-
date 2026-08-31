const fs = require('fs');
let code = fs.readFileSync('src/hooks/useChat.ts', 'utf8');
code = code.replace(
  /const sendMessage = useCallback\(async \(\s*userText: string,\s*isVoice: boolean = false,\s*imageDataUrl\?: string,\s*imageMimeType\?: string\s*\) => {/,
  `const sendMessage = useCallback(async (
    userText: string,
    isVoice: boolean = false,
    imageDataUrl?: string,
    imageMimeType?: string,
    audioBase64?: string,
    audioMimeType?: string
  ) => {`
);
code = code.replace(
  /if \(!userText\.trim\(\) && !imageDataUrl\) return;/,
  `if (!userText.trim() && !imageDataUrl && !audioBase64) return;`
);
code = code.replace(
  /image_mime_type: imageMimeType,/,
  `image_mime_type: imageMimeType,
        audio_base64: audioBase64,
        audio_mime_type: audioMimeType,`
);
fs.writeFileSync('src/hooks/useChat.ts', code);
