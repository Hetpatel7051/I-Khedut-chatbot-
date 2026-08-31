const fs = require('fs');
let code = fs.readFileSync('src/hooks/useChat.ts', 'utf8');
code = code.replace(
  /audio_base64: audioBase64,\n\s*audio_mime_type: audioMimeType,\n\s*audio_base64: audioBase64,\n\s*audio_mime_type: audioMimeType,/,
  `audio_base64: audioBase64,
        audio_mime_type: audioMimeType,`
);
fs.writeFileSync('src/hooks/useChat.ts', code);
