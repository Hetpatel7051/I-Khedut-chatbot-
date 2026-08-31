const fs = require('fs');
let code = fs.readFileSync('src/hooks/useChat.ts', 'utf8');

code = code.replace(
  /window.speechSynthesis.cancel\(\);/,
  `window.speechSynthesis.cancel();
      (window as any)._speechUtterances = [];`
);

fs.writeFileSync('src/hooks/useChat.ts', code);
