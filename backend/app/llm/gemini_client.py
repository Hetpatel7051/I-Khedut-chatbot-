from typing import Dict, Any, List
import json
from google import genai
from google.genai import types
import os

def get_mandi_prices_tool() -> types.Tool:
    return types.Tool(
        function_declarations=[
            types.FunctionDeclaration(
                name="get_mandi_prices",
                description="Fetches current agricultural commodity prices (Mandi/APMC rates) for a given crop and market location in Gujarat.",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "commodity": types.Schema(
                            type=types.Type.STRING,
                            description="The name of the crop/commodity (e.g., 'Cotton', 'Wheat', 'Cumin')"
                        ),
                        "market_name": types.Schema(
                            type=types.Type.STRING,
                            description="The name of the APMC market or location (e.g., 'Gondal', 'Rajkot', 'Unjha')"
                        )
                    },
                    required=["commodity"]
                )
            )
        ]
    )

import base64
async def process_chat(message: str, profile: Dict[str, Any], language: str = "gu", audio_base64: str = None, audio_mime_type: str = None) -> str:
    # Use environment variable or inject
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return "⚠️ Gemini API key is missing. Please configure it in the environment."
        
    client = genai.Client(api_key=api_key)
    
    # Import locally to avoid circular dependencies
    from backend.app.core.config import settings
    from backend.app.services.mandi_service import fetch_mandi_prices
    from backend.app.llm.prompts import get_system_prompt
    
    system_prompt = get_system_prompt(profile, language)
    
    try:
        chat = client.chats.create(
            model=settings.GEMINI_MODEL,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.3,
                tools=[get_mandi_prices_tool()]
            )
        )
        
        contents = []
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
            
        response = chat.send_message(contents)
        
        # Handle function calling
        if response.function_calls:
            for function_call in response.function_calls:
                if function_call.name == "get_mandi_prices":
                    args = function_call.args
                    market_name = args.get("market_name")
                    commodity = args.get("commodity")
                    
                    prices = await fetch_mandi_prices(market=market_name, commodity=commodity)
                    
                    # Return tool execution result to the model
                    response = chat.send_message(
                        types.Part.from_function_response(
                            name="get_mandi_prices",
                            response={"prices": prices}
                        )
                    )
                    
        return response.text
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        # Fallback logic mirroring the Node.js implementation
        farmer_name = profile.get("name", "ખેડૂત મિત્ર")
        farmer_district = profile.get("district", "ગુજરાત")
        farmer_land = profile.get("land_size", "2")
        farmer_caste = profile.get("category", "General")
        
        if "hello" in message.lower() or "નમસ્તે" in message.lower():
            if language == "gu":
                return f"🙏 **નમસ્તે {farmer_name}! આઈ-ખેડૂત પોર્ટલ AI સહાયકમાં તમારું સ્વાગત છે.**\n\nતમે કયા વિભાગની યોજનાઓ જોવા માંગો છો? નીચે આપેલા સત્તાવાર કેટેગરી બટન પર ક્લિક કરીને માહિતી મેળવી શકો છો:"
            return f"🙏 **Hello {farmer_name}! Welcome to the iKhedut Portal Assistant.**\n\nWhich department schemes would you like to explore? Please select a category below:"
        
        if "market" in message.lower() or "mandi" in message.lower() or "ભાવ" in message.lower():
            if language == "gu":
                return f"📊 **તાજા ગુજરાત APMC બજાર ભાવ (આજના તાજા ભાવ):**\n\n• **જીરું:** ₹4800 થી ₹5950 / ૨૦ કિગ્રા - *ઊંઝા માર્કેટ યાર્ડ*\n• **કપાસ (શંકર-6):** ₹1400 થી ₹1685 / ૨૦ કિગ્રા - *ગોંડલ માર્કેટ યાર્ડ*\n\n💡 **બજાર સલાહ:** સૂકા અને ગ્રેડિંગ કરેલા માલના ઊંચા ભાવ મળે છે. સંપૂર્ણ યાદી નીચે આપેલા કાર્ડમાં જોઈ શકો છો."
            return f"📊 **Latest Gujarat APMC Mandi Rates Today:**\n\n• **Cumin Seeds (Jeera):** ₹4800 to ₹5950 / 20kg - *Unjha APMC*\n• **Cotton (Shankar-6):** ₹1400 to ₹1685 / 20kg - *Gondal APMC*\n\n💡 **Market Advisory:** Graded and low-moisture produce commands premium bids. You can view all crop rates in the card below."
            
        if language == "gu":
            return f"નમસ્તે **{farmer_name}**! ગુજરાત સરકારના આઈ-ખેડૂત પોર્ટલ પર ખેતીવાડી (ટ્રેક્ટર), ટપક સિંચાઈ (૭૦% સહાય), કાંટાળી તાર વાડ, દેશી ગાય નિભાવ ખર્ચ (માસિક ₹૯૦૦) અને એગ્રીકલ્ચર ડ્રોન જેવી વિવિધ યોજનાઓ ઉપલબ્ધ છે. તમને કઈ યોજના વિશે વિગતવાર માહિતી જોઈએ છે?"
        return f"Hello **{farmer_name}**! The iKhedut portal offers subsidies for Tractors, Drip Irrigation (up to 70%), Barbed Wire Fencing, Desi Cow maintenance (₹900/month), and Agricultural Drones. Which scheme would you like information on?"
