const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');
code = code.replace(
  /image_mime_type\?: string;/,
  `image_mime_type?: string;
  audio_base64?: string;
  audio_mime_type?: string;`
);
fs.writeFileSync('src/types/index.ts', code);
