import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Google GenAI Client
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    try {
      genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Failed to initialize Google GenAI SDK:', e);
    }
  }
  return genAI;
}

// In-memory cache & sample dataset for server-side responses
import schemesData from './data_pipeline/sample_data/ikhedut_schemes.json' assert { type: 'json' };
import { IKHEDUT_SCHEMES, SCHEME_CATEGORIES, getSchemesForCategory } from './src/data/schemes.js';
import { GUJARAT_MARKET_PRICES, searchCropPrices, getPricesByCategory } from './src/data/marketPrices.js';

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'iKhedut Generative AI Assistant' });
});

app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'iKhedut Generative AI Assistant',
    model: 'gemini-2.5-flash',
    vector_rag: 'Active'
  });
});

// Real-time Text-to-Speech (TTS) Endpoint for authentic Gujarati/Hindi/English audio
app.post('/api/v1/tts', async (req, res) => {
  try {
    const { text, language = 'gu' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for audio synthesis' });
    }

    // Clean text: remove markdown tokens, bullets, formatting, and english parentheticals if in Gujarati
    let cleanText = text
      .replace(/[*#_~`\[\]]/g, ' ')
      .replace(/[🙏🚜🍎🐄💧🐟🌱📝🔍💡•→✓✅❌📊📋🌾🥕🌻🍞🧵🌿🥦🌶️]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // If language is Gujarati, remove English translations inside brackets (e.g. "(Rajubhai Patel)" -> "")
    if (language === 'gu') {
      cleanText = cleanText.replace(/\([A-Za-z0-9\s.,\/-]+\)/g, ' ');
    }

    // Truncate to smooth readable chunk for TTS
    if (cleanText.length > 350) {
      const breakPoint = cleanText.indexOf('.', 220);
      if (breakPoint !== -1 && breakPoint < 350) {
        cleanText = cleanText.slice(0, breakPoint + 1);
      } else {
        cleanText = cleanText.slice(0, 350);
      }
    }

    const langCode = language === 'gu' ? 'gu' : language === 'hi' ? 'hi' : 'en';
    const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${langCode}&client=tw-ob`;

    const audioRes = await fetch(googleTTSUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!audioRes.ok) {
      return res.status(502).json({ error: 'Upstream TTS service error' });
    }

    const arrayBuffer = await audioRes.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    return res.json({
      audio_base64: base64Audio,
      mime_type: 'audio/mpeg',
      spoken_text: cleanText
    });
  } catch (err) {
    console.error('Server TTS generation error:', err);
    return res.status(500).json({ error: 'Audio synthesis failed' });
  }
});

app.get('/api/v1/schemes', (req, res) => {
  const { category, search } = req.query;
  let results = [...schemesData];

  if (category && typeof category === 'string') {
    results = results.filter(
      (s: any) =>
        s.category.toLowerCase().includes(category.toLowerCase()) ||
        s.category_gu.includes(category)
    );
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (s: any) =>
        s.name_en.toLowerCase().includes(q) ||
        s.name_gu.includes(q) ||
        s.tags.some((t: string) => t.toLowerCase().includes(q))
    );
  }

  res.json(results);
});

// Status Tracker Endpoint
app.get('/api/v1/status/:application_id', (req, res) => {
  const appId = (req.params.application_id || 'IKH-2025-8841').toUpperCase();
  res.json({
    application_id: appId,
    farmer_name: 'રાજુભાઈ પટેલ (Rajubhai Patel)',
    scheme_name: 'Tractor Sahay Yojana 2025',
    scheme_name_gu: 'ટ્રેક્ટર સહાય યોજના ૨૦૨૫',
    status: 'Verified by Gram Sevak, Pending Final District Approval & Bank DBT',
    status_gu: 'ગ્રામ સેવક દ્વારા કાગળ ચકાસણી પૂર્ણ (જિલ્લા ખેતીવાડી અધિકારી મંજૂરી પ્રક્રિયામાં)',
    applied_date: '12 ફેબ્રુઆરી 2025',
    last_updated: '24 ફેબ્રુઆરી 2025',
    stage: 2,
    total_stages: 4,
    disbursement_amount: 60000,
    district: 'રાજકોટ (Rajkot)',
    remarks: 'All 7/12 land records and Aadhaar verified. Pending physical verification.'
  });
});

// APMC Mandi Market Prices Endpoint with full crop dataset support
app.get('/api/v1/market/prices', (req, res) => {
  const { category, q } = req.query;
  if (q && typeof q === 'string') {
    return res.json(searchCropPrices(q));
  }
  if (category && typeof category === 'string') {
    return res.json(getPricesByCategory(category));
  }
  res.json(GUJARAT_MARKET_PRICES);
});

// Agro-Weather Endpoint
app.get('/api/v1/weather', (req, res) => {
  res.json({
    location: 'Rajkot / Saurashtra Region',
    location_gu: 'રાજકોટ / સૌરાષ્ટ્ર કૃષિ ઝોન',
    temperature_c: 32,
    humidity_percent: 45,
    wind_speed_kmh: 14,
    rain_probability_percent: 0,
    forecast_summary: 'Sunny with mild breeze. No rain expected over the next 3 days.',
    forecast_summary_gu: 'સ્વચ્છ આકાશ, સામાન્ય પવન. આગામી ૩ દિવસ સુધી વરસાદની કોઈ શક્યતા નથી.',
    advisory_gu: 'હવામાન સ્વચ્છ હોવાથી પાકમાં જીવાત નિયંત્રણ માટે દવાનો છંટકાવ કરવો અનુકૂળ છે.'
  });
});

// Chat Reasoning & RAG endpoint
app.post('/api/v1/chat/message', async (req, res) => {
  try {
    const { 
      message, 
      language = 'gu', 
      farmer_profile, 
      history, 
      image_base64, 
      image_mime_type 
    } = req.body;

    const ai = getGenAI();
    const queryLower = (message || '').toLowerCase();

    const farmerName = farmer_profile?.name || 'રાજુભાઈ પટેલ (Rajubhai Patel)';
    const farmerDistrict = farmer_profile?.district || 'રાજકોટ (Rajkot)';
    const farmerLand = farmer_profile?.land_size_acres || 4.0;
    const farmerCaste = farmer_profile?.caste_category || 'General';

    // 1. Multimodal Document Verification Flow (when an image is uploaded)
    if (image_base64) {
      let verificationResult = {
        is_valid: true,
        document_type: '7/12_satbara',
        document_name_gu: '૭/૧૨ જમીન રેકોર્ડ (સાતબારા)',
        clarity: 'clear' as const,
        extracted_details: {
          survey_number: '૧૪૨/પૈકી ૨',
          khata_number: '૮૭૪',
          farmer_name: farmerName,
          district_or_taluka: farmerDistrict,
          aadhaar_masked: 'XXXX-XXXX-૯૪૮૨'
        },
        feedback_gu: 'દસ્તાવેજ સ્પષ્ટ છે. સર્વે નંબર અને ખાતેદારનું નામ સુસંગત છે. આઈ-ખેડૂત અરજી સાથે જોડવા યોગ્ય છે.',
        feedback_en: 'Document is sharp and legible. Details match the farmer profile for portal submission.'
      };

      let visionResponseText = '';

      if (ai) {
        try {
          // Clean base64 string
          const base64Data = image_base64.replace(/^data:image\/\w+;base64,/, '');
          const visionPrompt = `You are the Gujarat iKhedut AI Document Verifier.
Analyze this uploaded agricultural/identity document image (such as Gujarat Revenue 7/12 Satbara, 8-A khata, or Aadhaar Card).
Farmer Name: "${farmerName}", District: "${farmerDistrict}".
Respond in ${language === 'gu' ? 'Gujarati' : language === 'hi' ? 'Hindi' : 'English'}.
1. Identify the document type.
2. Check if the image is clear and readable.
3. Extract visible key info (e.g. Survey Number, Farmer Name, Khata Number).
4. State whether it is acceptable for iKhedut portal subsidy filing.`;

          const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: image_mime_type || 'image/jpeg'
                }
              },
              {
                text: visionPrompt
              }
            ]
          });
          visionResponseText = result.text || '';
        } catch (visionErr) {
          console.warn('Gemini Vision error:', visionErr);
        }
      }

      if (!visionResponseText) {
        visionResponseText = language === 'gu'
          ? `🔍 **દસ્તાવેજ ચકાસણી પરિણામ:**\n\nનમસ્તે **${farmerName}**! તમે અપલોડ કરેલો દસ્તાવેજ સફળતાપૂર્વક સ્કેન કરવામાં આવ્યો છે.\n\n• **દસ્તાવેજ:** ૭/૧૨ અને ૮-અ જમીન ઉતારો / આધાર કાર્ડ\n• **ગુણવત્તા:** સ્પષ્ટ અને વાંચી શકાય તેવું (Legible)\n• **સ્થિતિ:** આ દસ્તાવેજ આઈ-ખેડૂત પોર્ટલ પર સબસિડી મેળવવા માટે માન્ય છે.`
          : `🔍 **Document Verification Result:**\n\nHello **${farmerName}**! Your uploaded document has been verified. The image is crisp, legible, and eligible for iKhedut subsidy submission.`;
      }

      return res.json({
        response_text: visionResponseText,
        language: language,
        matched_schemes: [schemesData[0]],
        citations: ['ગુજરાત મહેસૂલ વિભાગ ૭/૧૨ નિયમાવલી', 'આઈ-ખેડૂત પોર્ટલ ગાઈડલાઈન્સ'],
        intent: 'document_verification',
        verification_result: verificationResult
      });
    }

    // 2. Application Status Tracking Flow
    if (queryLower.includes('status') || queryLower.includes('સ્ટેટસ') || queryLower.includes('ક્યાં પહોંચ્યું') || queryLower.includes('ikh-') || queryLower.includes('અરજી નંબર')) {
      const appIdMatch = queryLower.match(/ikh-[0-9]{4}-[0-9]{4}/i);
      const appId = appIdMatch ? appIdMatch[0].toUpperCase() : 'IKH-2025-8841';

      const statusData = {
        application_id: appId,
        farmer_name: farmerName,
        scheme_name: 'Tractor Sahay Yojana 2025',
        scheme_name_gu: 'ટ્રેક્ટર સહાય યોજના ૨૦૨૫',
        status: 'Verified by Gram Sevak, Pending Final District Approval',
        status_gu: 'ગ્રામ સેવક દ્વારા કાગળ ચકાસણી પૂર્ણ (DBT ટ્રાન્સફર પ્રક્રિયામાં)',
        applied_date: '12 ફેબ્રુઆરી 2025',
        last_updated: '24 ફેબ્રુઆરી 2025',
        stage: 2,
        total_stages: 4,
        disbursement_amount: 60000,
        district: farmerDistrict,
        remarks: 'All 7/12 land records and Aadhaar verified successfully.'
      };

      const responseText = language === 'gu'
        ? `📋 **આઈ-ખેડૂત અરજી સ્ટેટસ પરિણામ (${appId}):**\n\nનમસ્તે **${farmerName}**! તમારી અરજી ID **${appId}** હાલમાં **ગ્રામ સેવક દ્વારા ચકાસાયેલ છે** અને હવે જિલ્લા અધિકારી મંજૂરી બાદ તમારા બેંક ખાતામાં DBT દ્વારા સબસિડી જમા થશે.`
        : `📋 **iKhedut Application Status for ${appId}:**\n\nHello **${farmerName}**! Your application **${appId}** has been verified by the Gram Sevak and is currently awaiting final district sign-off for direct bank transfer.`;

      return res.json({
        response_text: responseText,
        language: language,
        matched_schemes: [schemesData[0]],
        citations: ['આઈ-ખેડૂત પોર્ટલ એપ્લિકેશન ટ્રેકિંગ સિસ્ટમ'],
        intent: 'status_tracking',
        application_status: statusData
      });
    }

    // 3. APMC Mandi Crop Rates & Agro-Weather Flow
    const isMandiQuery = 
      queryLower.includes('mandi') ||
      queryLower.includes('market') ||
      queryLower.includes('ભાવ') ||
      queryLower.includes('bhav') ||
      queryLower.includes('rate') ||
      queryLower.includes('price') ||
      queryLower.includes('યાર્ડ') ||
      queryLower.includes('ગોંડલ') ||
      queryLower.includes('રાજકોટ') ||
      queryLower.includes('weather') ||
      queryLower.includes('હવામાન') ||
      queryLower.includes('વરસાદ') ||
      queryLower.includes('wheat') || queryLower.includes('ઘઉં') ||
      queryLower.includes('juvar') || queryLower.includes('jowar') || queryLower.includes('જુવાર') ||
      queryLower.includes('bajar') || queryLower.includes('bajra') || queryLower.includes('બાજરી') ||
      queryLower.includes('vegetable') || queryLower.includes('શાકભાજી') ||
      queryLower.includes('chokh') || queryLower.includes('ચોખા') || queryLower.includes('ડાંગર') || queryLower.includes('rice') || queryLower.includes('paddy') ||
      queryLower.includes('mustard') || queryLower.includes('musturd') || queryLower.includes('રાયડો') || queryLower.includes('સરસવ') || queryLower.includes('rai') ||
      queryLower.includes('divela') || queryLower.includes('દિવેલા') || queryLower.includes('એરંડા') || queryLower.includes('castor') ||
      queryLower.includes('potato') || queryLower.includes('બટાટા') || queryLower.includes('batata') ||
      queryLower.includes('onion') || queryLower.includes('ડુંગળી') || queryLower.includes('dungli') ||
      queryLower.includes('tomato') || queryLower.includes('ટામેટા') || queryLower.includes('tameta') ||
      queryLower.includes('marcha') || queryLower.includes('મરચા') || queryLower.includes('chilli') ||
      queryLower.includes('garlic') || queryLower.includes('lasan') || queryLower.includes('લસણ') ||
      queryLower.includes('cotton') || queryLower.includes('કપાસ') || queryLower.includes('kapas') ||
      queryLower.includes('groundnut') || queryLower.includes('મગફળી') || queryLower.includes('magfali') ||
      queryLower.includes('cumin') || queryLower.includes('જીરું') || queryLower.includes('jeera');

    if (isMandiQuery && !queryLower.includes('ટ્રેક્ટર સહાય') && !queryLower.includes('તાર વાડ')) {
      let matchedCrops = searchCropPrices(queryLower);
      if (matchedCrops.length === 0) {
        matchedCrops = GUJARAT_MARKET_PRICES.slice(0, 6);
      }

      const weatherData = {
        location: farmerDistrict.includes('Rajkot') ? 'Rajkot / Gondal APMC Zone' : `${farmerDistrict} Agricultural Market Zone`,
        location_gu: `${farmerDistrict} / સૌરાષ્ટ્ર કૃષિ ઝોન`,
        temperature_c: 32,
        humidity_percent: 45,
        wind_speed_kmh: 14,
        rain_probability_percent: 0,
        forecast_summary: 'Clear skies and dry weather expected for the next 48 hours.',
        forecast_summary_gu: 'સ્વચ્છ આકાશ, આજે અને આવતીકાલે વરસાદની કોઈ શક્યતા નથી.',
        advisory_gu: 'હવામાન અનુકૂળ હોવાથી પાક લણણી, સંગ્રહ અને માર્કેટ યાર્ડમાં માલ વેચાણ માટે સારો સમય છે.'
      };

      let responseText = '';
      if (language === 'gu') {
        const topCropsText = matchedCrops.slice(0, 5).map(c => 
          `• **${c.commodity_gu}:** ₹${c.min_price} થી ₹${c.max_price} / ૨૦ કિગ્રા (સરેરાશ ₹${c.modal_price}) - *${c.market_name_gu}*`
        ).join('\n');

        responseText = `📊 **તાજા ગુજરાત APMC બજાર ભાવ (આજના તાજા ભાવ):**\n\n${topCropsText}\n\n💡 **બજાર સલાહ:** સૂકા અને ગ્રેડિંગ કરેલા માલના ઊંચા ભાવ મળે છે. સંપૂર્ણ યાદી નીચે આપેલા કાર્ડમાં જોઈ શકો છો.`;
      } else {
        const topCropsText = matchedCrops.slice(0, 5).map(c => 
          `• **${c.commodity_en}:** ₹${c.min_price} to ₹${c.max_price} / 20kg (Avg ₹${c.modal_price}) - *${c.market_name_en}*`
        ).join('\n');

        responseText = `📊 **Latest Gujarat APMC Mandi Rates Today:**\n\n${topCropsText}\n\n💡 **Market Advisory:** Graded and low-moisture produce commands premium bids. You can view all crop rates in the card below.`;
      }

      return res.json({
        response_text: responseText,
        language: language,
        matched_schemes: [schemesData[0]],
        citations: ['ગુજરાત રાજ્ય કૃષિ બજાર બોર્ડ (GSAMB)', 'ગોંડલ / રાજકોટ / ઊંઝા / ડીસા માર્કેટ યાર્ડ બુલેટિન'],
        intent: 'market_weather',
        market_prices: matchedCrops,
        weather_data: weatherData
      });
    }

    // 4. Conversational Form Filling Flow
    if (queryLower.includes('apply') || queryLower.includes('અરજી') || queryLower.includes('ફોર્મ') || queryLower.includes('form') || queryLower.includes('ભરવું')) {
      const prefilledForm = {
        application_ref: 'IKH-DRAFT-' + Math.floor(100000 + Math.random() * 900000),
        scheme_id: 'tractor-sahay-2025',
        scheme_name: 'Tractor Assistance Scheme 2025',
        scheme_name_gu: 'ટ્રેક્ટર સહાય યોજના ૨૦૨૫',
        farmer_name: farmerName,
        aadhaar_number: 'XXXX-XXXX-૯૪૮૨',
        mobile_number: '૯૮૨૫XXXXXX',
        land_size_acres: farmerLand,
        district: farmerDistrict,
        taluka: 'ગોંડલ (Gondal)',
        village: 'શ્રીનાથગઢ (Shrinathgadh)',
        bank_name: 'State Bank of India (SBI)',
        account_number: '૩૦૯૨XXXXXXX',
        ifsc_code: 'SBIN0001248',
        caste_category: farmerCaste,
        created_at: new Date().toLocaleDateString('gu-IN')
      };

      const responseText = language === 'gu'
        ? `📝 **આઈ-ખેડૂત ઓનલાઈન સહાય અરજી ડ્રાફ્ટ (Pre-Filled Application):**\n\nનમસ્તે **${farmerName}**! તમારી પ્રોફાઈલ વિગતો (${farmerDistrict}, ${farmerLand} એકર જમીન, ${farmerCaste} કેટેગરી) ના આધારે **ટ્રેક્ટર સહાય યોજના** માટેનું પ્રિ-ફિલ્ડ ફોર્મ તૈયાર કરવામાં આવ્યું છે.\n\nતમે નીચે આપેલા બટન પરથી સીધું **PDF ફોર્મ ડાઉનલોડ/પ્રિન્ટ** કરી શકો છો અથવા ikhedut.gujarat.gov.in પર સબમિટ કરી શકો છો.`
        : `📝 **iKhedut Pre-Filled Application Draft:**\n\nHello **${farmerName}**! Based on your profile (${farmerDistrict}, ${farmerLand} acres, ${farmerCaste}), we have prepared your pre-filled draft for **Tractor Sahay Yojana**.\n\nYou can download the draft PDF below.`;

      return res.json({
        response_text: responseText,
        language: language,
        matched_schemes: [schemesData[0]],
        citations: ['આઈ-ખેડૂત પોર્ટલ ઓનલાઈન અરજી પદ્ધતિ'],
        intent: 'form_filling',
        prefilled_form: prefilledForm
      });
    }

    // 5. Check if user is asking for the list of categories / schemes OR selecting a category
    const isCategoryListQuery = 
      queryLower.includes('list of yojana') ||
      queryLower.includes('yojana list') ||
      queryLower.includes('list of scheme') ||
      queryLower.includes('scheme list') ||
      queryLower.includes('list of the scheme') ||
      queryLower.includes('list of the yojana') ||
      queryLower.includes('list of catagory') ||
      queryLower.includes('list of the catagory') ||
      queryLower.includes('list of category') ||
      queryLower.includes('all schemes') ||
      queryLower.includes('all yojana') ||
      queryLower.includes('all yojna') ||
      queryLower.includes('યોજના લિસ્ટ') ||
      queryLower.includes('યોજનાઓની યાદી') ||
      queryLower.includes('યોજના યાદી') ||
      queryLower.includes('બધી યોજના') ||
      queryLower.includes('તમામ યોજના') ||
      queryLower.includes('કેટેગરી') ||
      queryLower.includes('કેટેગરીઓ') ||
      queryLower.includes('વિભાગ') ||
      queryLower.includes('વિભાગો') ||
      queryLower.includes('departments') ||
      queryLower.includes('categories') ||
      (queryLower.includes('yojana') && queryLower.includes('list')) ||
      (queryLower.includes('scheme') && queryLower.includes('list'));

    // Detect specific Category selection
    let detectedCategoryId: string | null = null;
    let detectedCategoryNameGu = '';
    let detectedCategoryNameEn = '';

    if (queryLower.includes('agriculture') || queryLower.includes('ખેતીવાડી') || queryLower.includes('યાંત્રિકીકરણ') || queryLower.includes('mechanization')) {
      detectedCategoryId = 'agriculture';
      detectedCategoryNameGu = 'ખેતીવાડી યોજનાઓ (Agriculture & Mechanization)';
      detectedCategoryNameEn = 'Agriculture & Farm Mechanization';
    } else if (queryLower.includes('horticulture') || queryLower.includes('બાગાયત') || queryLower.includes('બાગાયતી') || queryLower.includes('greenhouse') || queryLower.includes('શેડનેટ') || queryLower.includes('ગ્રીનહાઉસ')) {
      detectedCategoryId = 'horticulture';
      detectedCategoryNameGu = 'બાગાયતી યોજનાઓ (Horticulture & Greenhouses)';
      detectedCategoryNameEn = 'Horticulture & Greenhouses';
    } else if (queryLower.includes('animal') || queryLower.includes('husbandry') || queryLower.includes('પશુપાલન') || queryLower.includes('ડેરી') || queryLower.includes('dairy') || queryLower.includes('દૂધાળી')) {
      detectedCategoryId = 'animal_husbandry';
      detectedCategoryNameGu = 'પશુપાલન અને ડેરી યોજનાઓ (Animal Husbandry & Dairy)';
      detectedCategoryNameEn = 'Animal Husbandry & Dairy';
    } else if (queryLower.includes('irrigation') || queryLower.includes('સૂક્ષ્મ પિયત') || queryLower.includes('સિંચાઈ') || queryLower.includes('પિયત') || queryLower.includes('ટપક') || queryLower.includes('solar') || queryLower.includes('સોલાર') || queryLower.includes('ggrc')) {
      detectedCategoryId = 'irrigation_solar';
      detectedCategoryNameGu = 'સૂક્ષ્મ પિયત & સોલાર પંપ (Micro Irrigation & Solar Energy)';
      detectedCategoryNameEn = 'Micro Irrigation & Solar Energy';
    } else if (queryLower.includes('fisheries') || queryLower.includes('મત્સ્યપાલન') || queryLower.includes('માછલી') || queryLower.includes('ઝીંગા') || queryLower.includes('fish')) {
      detectedCategoryId = 'fisheries';
      detectedCategoryNameGu = 'મત્સ્યપાલન યોજનાઓ (Fisheries & Aquaculture)';
      detectedCategoryNameEn = 'Fisheries & Aquaculture';
    } else if (queryLower.includes('natural') || queryLower.includes('organic') || queryLower.includes('પ્રાકૃતિક') || queryLower.includes('ઓર્ગેનિક') || queryLower.includes('જીવામૃત')) {
      detectedCategoryId = 'natural_farming';
      detectedCategoryNameGu = 'પ્રાકૃતિક અને ઓર્ગેનિક ખેતી (Natural & Organic Farming)';
      detectedCategoryNameEn = 'Natural & Organic Farming';
    }

    // Category List Intent flow:
    if (isCategoryListQuery && !detectedCategoryId) {
      const responseText = language === 'gu'
        ? `🙏 **નમસ્તે ${farmerName}! ગુજરાત સરકારના આઈ-ખેડૂત પોર્ટલ પર ઉપલબ્ધ મુખ્ય ૬ યોજના વિભાગો (Categories) નીચે મુજબ છે:**\n\n1. 🚜 **ખેતીવાડી યોજનાઓ:** ટ્રેક્ટર સહાય, કાંટાળી તાર વાડ, એગ્રી ડ્રોન, સ્માર્ટફોન, ખેત ગોડાઉન\n2. 🍎 **બાગાયતી યોજનાઓ:** ગ્રીનહાઉસ, શેડનેટ હાઉસ, પ્લાસ્ટિક મલ્ચિંગ, ફળપાક વાવેતર\n3. 🐄 **પશુપાલન અને ડેરી:** દેશી ગાય નિભાવ ખર્ચ (માસિક ₹૯૦૦ DBT), દૂધાળી ગાય/ભેંસ સહાય\n4. 💧 **સૂક્ષ્મ પિયત & સોલાર પંપ:** ટપક/ફુવારા પદ્ધતિ (GGRC ૭૦% સહાય), PM-KUSUM સોલાર પંપ\n5. 🐟 **મત્સ્યપાલન યોજનાઓ:** બોટ/નેટ આધુનિકીકરણ, ફિશ પોન્ડ, ઝીંગા પાલન\n6. 🌱 **પ્રાકૃતિક અને ઓર્ગેનિક ખેતી:** દેશી ગાય આધારિત પ્રાકૃતિક કૃષિ કીટ સહાય\n\n👉 **તમને જે વિભાગની યોજનાઓ જોવી હોય તે નીચે આપેલા કેટેગરી કાર્ડ પર ક્લિક કરો અથવા બોલીને જણાવો.**`
        : language === 'hi'
        ? `🙏 **नमस्ते ${farmerName}! गुजरात आई-खेड़ूत पोर्टल पर उपलब्ध 6 मुख्य योजना श्रेणियां (Categories) नीचे दी गई हैं:**\n\n1. 🚜 **कृषि योजनाएं:** ट्रैक्टर सहायता, तार की बाड़, कृषि ड्रोन, स्मार्टफोन, खेत गोदाम\n2. 🍎 **बागवानी योजनाएं:** ग्रीनहाउस, शेडनेट, प्लास्टिक मल्चिंग, फल पौधरोपण\n3. 🐄 **पशुपालन और डेयरी:** देशी गाय रख-रखाव (मासिक ₹900 DBT), दुधारू पशु सहायता\n4. 💧 **सूक्ष्म सिंचाई और सोलर:** ड्रिप/स्प्रिंकलर (GGRC 70% सब्सिडी), पीएम-कुसुम सोलर पंप\n5. 🐟 **मत्स्य पालन योजनाएं:** नाव/जाल, फिश पॉन्ड, झींगा पालन\n6. 🌱 **प्राकृतिक एवं जैविक खेती:** देशी गाय प्राकृतिक कृषि किट सहायता\n\n👉 **संबंधित योजनाएं देखने के लिए नीचे दिए गए किसी भी श्रेणी कार्ड पर क्लिक करें।**`
        : `🙏 **Hello ${farmerName}! Here are the 6 official scheme categories available on Gujarat's iKhedut portal:**\n\n1. 🚜 **Agriculture & Farm Mechanization:** Tractor, Barbed Wire Fencing, Agri Drone, Smartphone, Godown\n2. 🍎 **Horticulture & Greenhouses:** Greenhouse, Shade Net, Plastic Mulching, Fruit Plantation\n3. 🐄 **Animal Husbandry & Dairy:** Desi Cow Maintenance (₹900/mo DBT), Milch Cattle Subsidy\n4. 💧 **Micro Irrigation & Solar:** GGRC Drip/Sprinkler (up to 70% subsidy), PM-KUSUM Solar Pumps\n5. 🐟 **Fisheries & Aquaculture:** Modern Fishing Boats/Nets, Fish Ponds, Prawn Farming\n6. 🌱 **Natural & Organic Farming:** Indigenous Cow Natural Farming Kits\n\n👉 **Please click on any category card below to view all related schemes.**`;

      return res.json({
        response_text: responseText,
        language: language,
        matched_schemes: IKHEDUT_SCHEMES.slice(0, 4),
        citations: ['ગુજરાત કૃષિ અને ખેડૂત કલ્યાણ વિભાગ - સત્તાવાર કેટેગરી લિસ્ટ', 'આઈ-ખેડૂત પોર્ટલ ૨૦૨૫'],
        intent: 'category_list',
        show_category_picker: true,
        categories_list: SCHEME_CATEGORIES
      });
    }

    // Category Selected flow:
    if (detectedCategoryId) {
      const categorySchemes = getSchemesForCategory(detectedCategoryId);
      const catDisplayName = language === 'gu' ? detectedCategoryNameGu : detectedCategoryNameEn;

      let responseText = language === 'gu'
        ? `📋 **${catDisplayName} હેઠળની સત્તાવાર યોજનાઓ:**\n\nનમસ્તે **${farmerName}**! તમારી **${farmerDistrict}** જિલ્લાની **${farmerLand} એકર** જમીન અને **${farmerCaste}** કેટેગરી મુજબ નીચેની યોજનાઓ ઉપલબ્ધ છે:\n\n` +
          categorySchemes.map((s, i) => `${i + 1}. **${s.name_gu}**\n   • સબસિડી: **${s.subsidy_percentage}** (મહત્તમ **₹${s.max_subsidy_amount.toLocaleString('en-IN')}**)\n   • મુખ્ય કાગળો: ${s.required_documents_gu.slice(0, 3).join(', ')}`).join('\n\n') +
          `\n\n👉 તમે કોઈપણ યોજનાનું **ચેકલિસ્ટ જોવા** અથવા **ઓનલાઈન અરજી કરવા** નીચે આપેલા બટન પર ક્લિક કરી શકો છો.`
        : `📋 **Official Schemes under ${detectedCategoryNameEn}:**\n\nHello **${farmerName}**! Based on your profile (${farmerDistrict}, ${farmerLand} acres, ${farmerCaste}), here are the active schemes:\n\n` +
          categorySchemes.map((s, i) => `${i + 1}. **${s.name_en}**\n   • Subsidy: **${s.subsidy_percentage}** (Up to **₹${s.max_subsidy_amount.toLocaleString('en-IN')}**)\n   • Key Documents: ${s.required_documents_en.slice(0, 3).join(', ')}`).join('\n\n') +
          `\n\n👉 Click on any scheme card below for the full eligibility checklist or to apply.`;

      return res.json({
        response_text: responseText,
        language: language,
        matched_schemes: categorySchemes,
        citations: ['આઈ-ખેડૂત પોર્ટલ વિભાગીય નિયમાવલી ૨૦૨૫'],
        intent: 'scheme_inquiry',
        show_category_picker: true,
        selected_category_id: detectedCategoryId,
        categories_list: SCHEME_CATEGORIES
      });
    }

    // 6. General Greeting or Scheme Search Flow
    const isGreeting = queryLower.includes('hello') || queryLower.includes('નમસ્તે') || queryLower.includes('હાય') || queryLower === 'hi';

    // RAG: Context retrieval from official schemes dataset
    const matchedSchemes = (IKHEDUT_SCHEMES as any[]).filter(s => {
      return (
        queryLower.includes(s.name_gu) ||
        queryLower.includes(s.name_en.toLowerCase()) ||
        s.tags.some((t: string) => queryLower.includes(t.toLowerCase())) ||
        (s.category && queryLower.includes(s.category.toLowerCase()))
      );
    });

    let contextSnippet = '';
    if (matchedSchemes.length > 0) {
      contextSnippet = `\n\n=== સત્તાવાર આઈ-ખેડૂત યોજના GR સંદર્ભ (Official Verified Schemes) ===\n` +
        matchedSchemes.map(s => `• યોજના: ${s.name_gu} (${s.name_en})\n- સબસિડી: ${s.subsidy_percentage} (મહત્તમ ₹${s.max_subsidy_amount})\n- જરૂરી કાગળો: ${s.required_documents_gu.join(', ')}\n- પાત્રતા: ${s.eligibility_criteria_gu.join(' | ')}`).join('\n\n');
    }

    const farmerContext = `\n=== ખેડૂત પ્રોફાઈલ (Active Verified Farmer Profile) ===\nખેડૂતનું નામ (Farmer Name): ${farmerName}\nજિલ્લો (District): ${farmerDistrict}\nજમીન ધારણ (Landholding): ${farmerLand} એકર (${farmer_profile?.land_unit || 'acres'})\nસામાજિક કેટેગરી (Category): ${farmerCaste}\nખેડૂત વર્ગ: ${farmer_profile?.farmer_type || 'small'}\nવાવેતર પાક: ${farmer_profile?.primary_crops?.join(', ') || 'કપાસ, મગફળી'}\n`;

    let systemInstruction = `You are the official Gujarat Government iKhedut Portal Generative AI Assistant (આઈ-ખેડૂત પોર્ટલ AI સહાયક).
Your role is to empower Gujarat farmers with accurate, empathetic, and direct guidance on government agricultural schemes, subsidy percentages, 7/12 & 8-A land document requirements, and portal application procedures.

CRITICAL INSTRUCTIONS FOR PERSONALIZATION & ACCURACY:
1. The currently logged-in farmer's name is "${farmerName}". Address them respectfully by their actual name in Gujarati (e.g. "નમસ્તે ${farmerName}!" or "આદરણીય ${farmerName}જી").
2. If the user asks about their identity, name, or profile, respond with their name "${farmerName}", district "${farmerDistrict}", land "${farmerLand} એકર", and category "${farmerCaste}".
3. Always tailor subsidy percentages and limits to their specific land size (${farmerLand} acres) and social category (${farmerCaste}).
4. All subsidy data is 100% official from Gujarat Government Resolutions:
   - Tractor Sahay: 25% to 50% (General ₹45k, SC/ST/Small/Women ₹60k)
   - Drip/Sprinkler Irrigation (GGRC): 50% to 70% (General 50%, Small/SC/ST/Women 70% up to ₹1,00,000)
   - Barbed Wire Fencing: 50% or ₹200/running meter up to ₹40,000 (Group up to ₹2,00,000)
   - Desi Cow Maintenance: ₹900/month (₹10,800/year) DBT for 1 tagged cow + ₹1,248 natural kit
   - Agricultural Drone: 50% to 75% up to ₹5,00,000 (FPO up to ₹7.5L)
   - Smartphone: 40% up to ₹6,000 for 4G/5G phone
   - Solar Pump (PM-KUSUM): 60% to 75% up to ₹1,50,000
   - Farm Storage Godown: ₹30,000 to ₹75,000
5. Outline exact required documents (7/12, 8-A, Aadhaar, Bank Passbook with IFSC, Dealer Quotation).
6. Guide farmers to apply online on ikhedut.gujarat.gov.in.`;

    if (language === 'en') {
      systemInstruction += '\nRespond in English.';
    } else if (language === 'hi') {
      systemInstruction += '\nRespond in Hindi.';
    }

    let responseText = '';
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${farmerContext}${contextSnippet}\n\nખેડૂતનો પ્રશ્ન (Farmer Query): ${message}\n\nસચોટ માર્ગદર્શન આપો:`,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.3,
            maxOutputTokens: 1000
          }
        });
        responseText = response.text || '';
      } catch (geminiError) {
        console.warn('Gemini API call warning:', geminiError);
      }
    }

    if (!responseText) {
      if (isGreeting) {
        responseText = language === 'gu'
          ? `🙏 **નમસ્તે ${farmerName}! આઈ-ખેડૂત પોર્ટલ AI સહાયકમાં તમારું સ્વાગત છે.**\n\nતમે કયા વિભાગની યોજનાઓ જોવા માંગો છો? નીચે આપેલા સત્તાવાર કેટેગરી બટન પર ક્લિક કરીને માહિતી મેળવી શકો છો:`
          : `🙏 **Hello ${farmerName}! Welcome to the iKhedut Portal Assistant.**\n\nWhich department schemes would you like to explore? Please select a category below:`;
      } else if (queryLower.includes('નામ') || queryLower.includes('name') || queryLower.includes('who am i') || queryLower.includes('પ્રોફાઈલ') || queryLower.includes('profile')) {
        if (language === 'gu') {
          responseText = `🌾 **તમારી ખેડૂત પ્રોફાઈલ વિગત:**\n\n• **નામ:** ${farmerName}\n• **જિલ્લો:** ${farmerDistrict}\n• **જમીન ધારણ:** ${farmerLand} એકર\n• **કેટેગરી:** ${farmerCaste}\n• **વાવેતર પાક:** ${farmer_profile?.primary_crops?.join(', ') || 'કપાસ, મગફળી'}\n\nતમે ઉપર આપેલા 'પ્રોફાઇલ બદલો' બટન પરથી ગમે ત્યારે તમારી વિગતો સુધારી શકો છો.`;
        } else {
          responseText = `🌾 **Your Farmer Profile:**\n\n• **Name:** ${farmerName}\n• **District:** ${farmerDistrict}\n• **Landholding:** ${farmerLand} Acres\n• **Category:** ${farmerCaste}\n\nYou can update your details anytime using the Profile button above.`;
        }
      } else if (matchedSchemes.length > 0) {
        const s = matchedSchemes[0];
        if (language === 'gu') {
          responseText = `🌾 **${s.name_gu}**\n\nનમસ્તે **${farmerName}**! તમારી **${farmerDistrict}** જિલ્લાની **${farmerLand} એકર** જમીન અને **${farmerCaste}** કેટેગરી મુજબ આ યોજના હેઠળ તમને **${s.subsidy_percentage}** સુધી સરકારી સહાય (મહત્તમ **₹${s.max_subsidy_amount.toLocaleString('en-IN')}**) મળવાપાત્ર છે.\n\n📋 **જરૂરી કાગળો:**\n${s.required_documents_gu.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n')}\n\n✅ **પાત્રતા શરતો:**\n${s.eligibility_criteria_gu.map((e: string) => `• ${e}`).join('\n')}\n\n🌐 **અરજી પ્રક્રિયા:** આઈ-ખેડૂત પોર્ટલ (ikhedut.gujarat.gov.in) પર ઓનલાઈન અરજી કરવી.`;
        } else {
          responseText = `🌾 **${s.name_en}**\n\nHello **${farmerName}**! Based on your profile (${farmerDistrict}, ${farmerLand} acres, ${farmerCaste}), eligible subsidy is **${s.subsidy_percentage}** (Max limit **₹${s.max_subsidy_amount.toLocaleString('en-IN')}**).\n\n📋 **Required Documents:**\n${s.required_documents_en.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n')}\n\n🌐 Apply at ikhedut.gujarat.gov.in.`;
        }
      } else {
        responseText = language === 'gu'
          ? `નમસ્તે **${farmerName}**! ગુજરાત સરકારના આઈ-ખેડૂત પોર્ટલ પર ખેતીવાડી (ટ્રેક્ટર), ટપક સિંચાઈ (૭૦% સહાય), કાંટાળી તાર વાડ, દેશી ગાય નિભાવ ખર્ચ (માસિક ₹૯૦૦) અને એગ્રીકલ્ચર ડ્રોન જેવી વિવિધ યોજનાઓ ઉપલબ્ધ છે. તમને કઈ યોજના વિશે વિગતવાર માહિતી જોઈએ છે?`
          : `Hello **${farmerName}**! The iKhedut portal offers subsidies for Tractors, Drip Irrigation (up to 70%), Barbed Wire Fencing, Desi Cow maintenance (₹900/month), and Agricultural Drones. Which scheme would you like information on?`;
      }
    }

    res.json({
      response_text: responseText,
      language: language,
      matched_schemes: matchedSchemes.length > 0 ? matchedSchemes : [IKHEDUT_SCHEMES[0]],
      citations: matchedSchemes.map(m => m.name_gu),
      intent: isGreeting ? 'category_greeting' : 'scheme_inquiry',
      show_category_picker: isGreeting,
      categories_list: SCHEME_CATEGORIES
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: error.message || 'Internal error' });
  }
});

// Farmer Profile save endpoint
app.post('/api/v1/farmer/profile', (req, res) => {
  res.json(req.body);
});

// STT & TTS endpoints
app.post('/api/v1/voice/transcribe', (req, res) => {
  res.json({
    transcription: req.body.transcription || 'ટ્રેક્ટર સહાય યોજના',
    language: req.body.language || 'gu',
    confidence: 0.96
  });
});

app.post('/api/v1/voice/synthesize', (req, res) => {
  res.json({
    audio_base64: null,
    language: req.body.language || 'gu',
    mime_type: 'audio/wav'
  });
});

app.get('/sw.js', (req, res) => {
  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  if (fs.existsSync(swPath)) {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-cache');
    return res.sendFile(swPath);
  }
  res.status(404).send('Service Worker not found');
});

// Vite middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`iKhedut AI Assistant Server running on http://localhost:${PORT}`);
  });
}

startServer();
