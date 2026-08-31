const fs = require('fs');
let code = fs.readFileSync('backend/app/llm/gemini_client.py', 'utf8');

code = code.replace(
  /async def process_chat\(message: str, profile: Dict\[str, Any\], language: str = "gu"\) -> str:/,
  `import base64
async def process_chat(message: str, profile: Dict[str, Any], language: str = "gu", audio_base64: str = None, audio_mime_type: str = None) -> str:`
);

code = code.replace(
  /response = chat\.send_message\(message\)/,
  `contents = []
        if audio_base64:
            audio_bytes = base64.b64decode(audio_base64)
            contents.append(
                types.Part.from_bytes(
                    data=audio_bytes,
                    mime_type=audio_mime_type or "audio/webm"
                )
            )
        
        if message:
            contents.append(message)
        
        if not contents:
            contents.append("Hello")
            
        response = chat.send_message(contents)`
);

fs.writeFileSync('backend/app/llm/gemini_client.py', code);
