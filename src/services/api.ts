import {
  Scheme,
  FarmerProfile,
  ChatRequestPayload,
  ChatResponsePayload,
  Language,
} from "../types";
import { IKHEDUT_SCHEMES } from "../data/schemes";
import { GUJARAT_MARKET_PRICES, searchCropPrices } from "../data/marketPrices";
import { swManager } from "./serviceWorkerRegistration";

export const API_BASE_URL = "/api/v1";

// Seed initial offline schemes cache immediately
if (typeof window !== "undefined") {
  swManager.cacheSchemesOffline(IKHEDUT_SCHEMES);
}

export async function fetchTTSAudio(
  text: string,
  language: Language = "gu",
): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audio_base64) {
        return data.audio_base64;
      }
    }
  } catch (err) {
    console.warn(
      "Backend TTS request error, falling back to browser speech synthesis:",
      err,
    );
  }
  return null;
}

export async function sendMessageToAI(
  payload: ChatRequestPayload,
): Promise<ChatResponsePayload> {
  try {
    const res = await fetch(`${API_BASE_URL}/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn(
      "API call failed, falling back to intelligent client-side RAG:",
      error,
    );
  }

  // Fallback client-side matching if server is busy or offline
  return fallbackClientChat(payload);
}

export async function fetchSchemes(
  category?: string,
  search?: string,
): Promise<Scheme[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search) params.append("search", search);

    const res = await fetch(`${API_BASE_URL}/schemes?${params.toString()}`);
    if (res.ok) {
      const data: Scheme[] = await res.json();
      swManager.cacheSchemesOffline(data);
      return data;
    }
  } catch (err) {
    console.warn(
      "Failed to fetch schemes from server, serving offline cached data:",
      err,
    );
  }

  // Local fallback with complete offline criteria
  let list = [...IKHEDUT_SCHEMES];
  if (category) {
    list = list.filter(
      (s) =>
        s.category.toLowerCase().includes(category.toLowerCase()) ||
        s.category_gu.includes(category),
    );
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (item) =>
        item.name_en.toLowerCase().includes(s) ||
        item.name_gu.includes(s) ||
        item.tags.some((t) => t.toLowerCase().includes(s)),
    );
  }
  return list;
}

export async function saveFarmerProfile(
  profile: FarmerProfile,
): Promise<FarmerProfile> {
  try {
    const res = await fetch(`${API_BASE_URL}/farmer/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Failed to persist profile to server:", e);
  }
  localStorage.setItem("ikhedut_farmer_profile", JSON.stringify(profile));
  return profile;
}

export async function fetchApplicationStatus(applicationId: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/status/${encodeURIComponent(applicationId)}`,
    );
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Failed to fetch application status from server:", e);
  }
  return null;
}

function fallbackClientChat(payload: ChatRequestPayload): ChatResponsePayload {
  const query = (payload.message || "").toLowerCase();
  const lang = payload.language || "gu";
  const farmerName = payload.farmer_profile?.name || "રાજુભાઈ પટેલ";
  const farmerDistrict = payload.farmer_profile?.district || "રાજકોટ";
  const farmerLand = payload.farmer_profile?.land_size_acres || 4.0;
  const farmerCaste = payload.farmer_profile?.caste_category || "General";
  const hasImage = Boolean(payload.image_base64);
  const unavailableResponse = (
    response_text: string,
    intent = "general",
  ): ChatResponsePayload => ({
    response_text,
    language: lang,
    matched_schemes: [],
    citations: [],
    intent,
  });

  if (hasImage) {
    return unavailableResponse(
      lang === "gu"
        ? "અપલોડ કરેલ દસ્તાવેજ આ સમયે ચકાસી શકાય તેમ નથી. કોઈ વિગતો, સ્પષ્ટતા કે સરકારી માન્યતા ચકાસવામાં આવી નથી. કૃપા કરીને અધિકૃત કચેરી અથવા iKhedut પોર્ટલથી ચકાસો."
        : lang === "hi"
          ? "अभी अपलोड किए गए दस्तावेज़ की जाँच उपलब्ध नहीं है। इसकी जानकारी, स्पष्टता या सरकारी वैधता सत्यापित नहीं हुई है। कृपया आधिकारिक कार्यालय या iKhedut पोर्टल से जाँचें।"
          : "Document verification is unavailable right now. No details, legibility, or government validity were verified. Please check with the relevant official office or iKhedut portal.",
      "document_verification_unavailable",
    );
  }

  const appId = query.match(/ikh-[0-9]{4}-[0-9]{4}/i)?.[0].toUpperCase();
  if (
    query.includes("status") ||
    query.includes("સ્ટેટસ") ||
    query.includes("ક્યાં પહોંચ્યું") ||
    query.includes("ikh-") ||
    query.includes("અરજી નંબર")
  ) {
    return unavailableResponse(
      lang === "gu"
        ? `અરજીનું લાઇવ સ્ટેટસ અહીંથી મેળવી શકાય તેમ નથી${appId ? ` (${appId})` : ""}. અરજી નંબર પરથી સ્થિતિ અનુમાનવામાં આવી નથી. કૃપા કરીને iKhedut પોર્ટલના અધિકૃત ટ્રેકિંગમાં તપાસો.`
        : lang === "hi"
          ? `आवेदन की लाइव स्थिति अभी उपलब्ध नहीं है${appId ? ` (${appId})` : ""}। आवेदन संख्या से स्थिति का अनुमान नहीं लगाया गया है। कृपया iKhedut पोर्टल पर आधिकारिक ट्रैकिंग देखें।`
          : `Live application status is unavailable${appId ? ` for ${appId}` : ""}. No status was inferred from the application number. Please use the official tracking page on the iKhedut portal.`,
      "status_unavailable",
    );
  }

  const isUnavailableWeatherQuery = /weather|હવામાન|વરસાદ|मौસમ|बारिश/i.test(
    query,
  );
  const isUnavailableMandiQuery =
    /mandi|market|ભાવ|bhav|rate|price|યાર્ડ|मंडी|भाव/i.test(query);
  if (isUnavailableWeatherQuery || isUnavailableMandiQuery) {
    return unavailableResponse(
      lang === "gu"
        ? isUnavailableWeatherQuery
          ? "હવામાનની લાઇવ માહિતી આ સમયે ઉપલબ્ધ નથી. કૃપા કરીને સ્થાનિક હવામાન વિભાગ અથવા IMDની આગાહી તપાસો."
          : "APMCના લાઇવ બજાર ભાવ આ સમયે ઉપલબ્ધ નથી. કોઈ પણ સંગ્રહિત નમૂના ભાવને આજના ભાવ તરીકે રજૂ કરવામાં આવ્યો નથી. કૃપા કરીને સંબંધિત APMC અથવા અધિકૃત બજાર બુલેટિન તપાસો."
        : lang === "hi"
          ? isUnavailableWeatherQuery
            ? "लाइव मौसम जानकारी अभी उपलब्ध नहीं है। कृपया स्थानीय मौसम विभाग या IMD का पूर्वानुमान देखें।"
            : "APMC के लाइव मंडी भाव अभी उपलब्ध नहीं हैं। कोई भी नमूना भाव आज का बताकर नहीं दिखाया गया है। कृपया संबंधित APMC या आधिकारिक बाजार बुलेटिन देखें।"
          : isUnavailableWeatherQuery
            ? "Live weather information is unavailable. Please check the local weather department or IMD forecast."
            : "Live APMC market prices are unavailable. No stored sample price is presented as today’s rate. Please check the relevant APMC or official market bulletin.",
      isUnavailableWeatherQuery
        ? "weather_unavailable"
        : "market_prices_unavailable",
    );
  }

  const isUnavailableFormQuery =
    /(^|\s)(apply|application|અરજી|ફોર્મ|form|ભરવું)(\s|$|\?|\.|,)/i.test(
      query,
    );
  if (isUnavailableFormQuery) {
    return unavailableResponse(
      lang === "gu"
        ? "અધિકૃત અરજી અહીંથી બનાવાતી કે સબમિટ થતી નથી. કૃપા કરીને iKhedut પોર્ટલ પર તમારી સાચી વિગતો દાખલ કરીને અરજી કરો; આ સહાયક કોઈ આધાર, બેંક અથવા અરજી નંબર બનાવશે નહીં."
        : lang === "hi"
          ? "यहाँ आधिकारिक आवेदन बनाया या जमा नहीं होता। कृपया iKhedut पोर्टल पर अपनी सही जानकारी भरें। यह सहायक आधार, बैंक या आवेदन संख्या नहीं बनाएगा।"
          : "An official application cannot be created or submitted here. Enter your actual details on the iKhedut portal; this assistant will not invent Aadhaar, bank, or application numbers.",
      "application_creation_unavailable",
    );
  }

  // 1. Multimodal Document Verification (Image present)
  if (hasImage) {
    const isSatbara =
      query.includes("7/12") ||
      query.includes("સાતબારા") ||
      query.includes("જમીન") ||
      !query.includes("આધાર");
    return {
      response_text:
        lang === "gu"
          ? `🔍 **દસ્તાવેજ ચકાસણી પૂર્ણ (AI Document Verification):**\n\nનમસ્તે **${farmerName}**! તમે અપલોડ કરેલ **${isSatbara ? "૭/૧૨ (Satbara) જમીન રેકોર્ડ" : "આધાર કાર્ડ"}** સફળતાપૂર્વક ચકાસવામાં આવ્યો છે.\n\n• **દસ્તાવેજ પ્રકાર:** ${isSatbara ? "૭/૧૨ અને ૮-અ જમીન ઉતારો" : "ભારતીય આધાર કાર્ડ"}\n• **સ્પષ્ટતા:** સ્પષ્ટ અને વાંચી શકાય તેવું (Clear & Legible)\n• **તારણ:** આ દસ્તાવેજ આઈ-ખેડૂત પોર્ટલ પર સહાય મેળવવા માટે માન્ય છે.`
          : `🔍 **Document Verification Result:**\n\nHello **${farmerName}**! Your uploaded **${isSatbara ? "Gujarat 7/12 Land Record" : "Aadhaar Card"}** has been scanned and verified. The image is crisp, legible, and valid for iKhedut subsidy applications.`,
      language: lang,
      matched_schemes: [IKHEDUT_SCHEMES[0]],
      citations: ["ગુજરાત મહેસૂલ વિભાગ ૭/૧૨ નિયમાવલી"],
      intent: "document_verification",
      verification_result: {
        is_valid: true,
        document_type: isSatbara ? "7/12_satbara" : "aadhaar_card",
        document_name_gu: isSatbara
          ? "૭/૧૨ જમીન રેકોર્ડ (સાતબારા)"
          : "આધાર કાર્ડ (Aadhaar Card)",
        clarity: "clear",
        extracted_details: {
          survey_number: "૧૪૨/પૈકી ૨",
          khata_number: "૮૭૪",
          farmer_name: farmerName,
          district_or_taluka: farmerDistrict,
          aadhaar_masked: "XXXX-XXXX-૯૪૮૨",
        },
        feedback_gu:
          "દસ્તાવેજ ખૂબ જ સ્પષ્ટ છે અને સર્વે નંબર તથા ખાતેદારનું નામ બરાબર વંચાય છે. આ કાગળ અરજી સાથે જોડવા યોગ્ય છે.",
        feedback_en:
          "Document is sharp and legible. The survey number and farmer name match government portal formats.",
      },
    };
  }

  // 2. Application Status Tracker
  if (
    query.includes("status") ||
    query.includes("સ્ટેટસ") ||
    query.includes("ક્યાં પહોંચ્યું") ||
    query.includes("ikh-") ||
    query.includes("અરજી નંબર")
  ) {
    const appIdMatch = query.match(/ikh-[0-9]{4}-[0-9]{4}/i);
    const appId = appIdMatch ? appIdMatch[0].toUpperCase() : "IKH-2025-8841";

    return {
      response_text:
        lang === "gu"
          ? `📋 **આઈ-ખેડૂત અરજી સ્ટેટસ પરિણામ (${appId}):**\n\nનમસ્તે **${farmerName}**! તમારી અરજી ID **${appId}** હાલમાં **ગ્રામ સેવક દ્વારા ચકાસાયેલ છે** અને હવે તાલુકા અધિકારી મંજૂરી બાદ DBT સબસિડી જમા થશે.`
          : `📋 **iKhedut Application Tracking for ${appId}:**\n\nHello **${farmerName}**! Your application **${appId}** has been successfully verified by Gram Sevak and is currently pending final approval and DBT bank disbursement.`,
      language: lang,
      matched_schemes: [IKHEDUT_SCHEMES[0]],
      citations: ["આઈ-ખેડૂત પોર્ટલ એપ્લિકેશન ટ્રેકિંગ સિસ્ટમ"],
      intent: "status_tracking",
      application_status: {
        application_id: appId,
        farmer_name: farmerName,
        scheme_name: "Tractor Sahay Yojana 2025",
        scheme_name_gu: "ટ્રેક્ટર સહાય યોજના ૨૦૨૫",
        status: "Verified by Gram Sevak, Pending Bank Transfer",
        status_gu:
          "ગ્રામ સેવક દ્વારા કાગળ ચકાસણી પૂર્ણ (DBT ટ્રાન્સફર પ્રક્રિયામાં)",
        applied_date: "12 ફેબ્રુઆરી 2025",
        last_updated: "24 ફેબ્રુઆરી 2025",
        stage: 2,
        total_stages: 4,
        disbursement_amount: 60000,
        district: farmerDistrict,
        remarks: "All 7/12 & 8-A land records verified successfully.",
      },
    };
  }

  // 3. Mandi APMC Market Prices & Weather
  const isMandiQuery =
    /(^|\s)(mandi|market|ભાવ|bhav|rate|price|યાર્ડ|weather|હવામાન|વરસાદ|wheat|ઘઉં|juvar|jowar|જુવાર|bajar|bajra|બાજરી|vegetable|શાકભાજી|chokh|ચોખા|ડાંગર|rice|paddy|mustard|musturd|રાયડો|સરસવ|rai|divela|દિવેલા|એરંડા|castor|potato|બટાટા|batata|onion|ડુંગળી|dungli|tomato|ટામેટા|tameta|marcha|મરચા|chilli|garlic|lasan|લસણ|cotton|કપાસ|kapas|groundnut|મગફળી|magfali|cumin|જીરું|jeera)(\s|$|\?|\.|,)/i.test(
      query,
    );

  if (
    isMandiQuery &&
    /mandi|market|ભાવ|bhav|rate|price|યાર્ડ|मंडी|भाव/i.test(query) &&
    !query.includes("ટ્રેક્ટર") &&
    !query.includes("તાર વાડ")
  ) {
    let matchedCrops = searchCropPrices(query);
    if (matchedCrops.length === 0) {
      matchedCrops = GUJARAT_MARKET_PRICES.slice(0, 6);
    }

    const topCropsList = matchedCrops
      .slice(0, 5)
      .map((c) =>
        lang === "gu"
          ? `• **${c.commodity_gu}:** ₹${c.min_price} થી ₹${c.max_price} / ૨૦ કિગ્રા (સરેરાશ ₹${c.modal_price}) - *${c.market_name_gu}*`
          : `• **${c.commodity_en}:** ₹${c.min_price} to ₹${c.max_price} / 20kg (Avg ₹${c.modal_price}) - *${c.market_name_en}*`,
      )
      .join("\n");

    return {
      response_text:
        lang === "gu"
          ? `📊 **તાજા ગુજરાત APMC બજાર ભાવ અને હવામાન અપડેટ:**\n\n${topCropsList}\n\n💡 **બજાર સલાહ:** સૂકા અને ગ્રેડિંગ કરેલા માલના ઊંચા ભાવ મળે છે. વિગતવાર ભાવ નીચે આપેલા કાર્ડમાં જોઈ શકો છો.`
          : `📊 **Live Gujarat APMC Mandi Rates & Weather Insights:**\n\n${topCropsList}\n\n💡 **Market Advisory:** Graded and low-moisture produce commands premium bids. You can view all crop rates in the card below.`,
      language: lang,
      matched_schemes: [IKHEDUT_SCHEMES[0]],
      citations: [
        "ગોંડલ / રાજકોટ / ઊંઝા / ડીસા માર્કેટ યાર્ડ સત્તાવાર બુલેટિન",
        "ભારતીય હવામાન વિભાગ (IMD Gujarat)",
      ],
      intent: "market_weather",
      market_prices: matchedCrops,
      weather_data: {
        location: "Rajkot / Saurashtra Region",
        location_gu: "રાજકોટ / સૌરાષ્ટ્ર કૃષિ ઝોન",
        temperature_c: 32,
        humidity_percent: 45,
        wind_speed_kmh: 14,
        rain_probability_percent: 0,
        forecast_summary:
          "Clear skies, no rain expected for the next 48 hours.",
        forecast_summary_gu:
          "આજે અને આવતીકાલે વરસાદની કોઈ શક્યતા નથી, સ્વચ્છ આકાશ રહેશે.",
        advisory_gu:
          "હવામાન અનુકૂળ હોવાથી કપાસ, મગફળી, ઘઉં, જીરું અને શાકભાજી પાક લણણી તેમજ બજાર વેચાણ માટે ઉત્તમ સમય છે.",
      },
    };
  }

  // 4. Conversational Form Filling (I want to apply / અરજી કરવી છે)
  const isFormQuery =
    /(^|\s)(apply|અરજી|ફોર્મ|form|ભરવું)(\s|$|\?|\.|,)/i.test(query) &&
    query.includes("ટ્રેક્ટર");
  if (isFormQuery) {
    return {
      response_text:
        lang === "gu"
          ? `📝 **આઈ-ખેડૂત ઓનલાઈન સહાય અરજી ડ્રાફ્ટ (Pre-Filled Application):**\n\nનમસ્તે **${farmerName}**! તમારી પ્રોફાઈલ વિગતો (${farmerDistrict}, ${farmerLand} એકર જમીન, ${farmerCaste} કેટેગરી) ના આધારે **ટ્રેક્ટર સહાય યોજના** માટેનું પ્રિ-ફિલ્ડ ફોર્મ તૈયાર કરવામાં આવ્યું છે.\n\nતમે નીચે આપેલા બટન પરથી સીધું **PDF ફોર્મ ડાઉનલોડ/પ્રિન્ટ** કરી શકો છો અથવા ikhedut.gujarat.gov.in પર અપલોડ કરી શકો છો.`
          : `📝 **iKhedut Pre-Filled Application Form Draft:**\n\nHello **${farmerName}**! Based on your profile details (${farmerDistrict}, ${farmerLand} acres, ${farmerCaste}), we have pre-filled your application draft for **Tractor Sahay Yojana**.\n\nYou can download the formatted PDF draft below and submit it directly to your Gram Sevak or portal.`,
      language: lang,
      matched_schemes: [IKHEDUT_SCHEMES[0]],
      citations: ["આઈ-ખેડૂત પોર્ટલ ઓનલાઈન અરજી પદ્ધતિ"],
      intent: "form_filling",
      prefilled_form: {
        application_ref:
          "IKH-DRAFT-" + Math.floor(100000 + Math.random() * 900000),
        scheme_id: "tractor-sahay-2025",
        scheme_name: "Tractor Assistance Scheme 2025",
        scheme_name_gu: "ટ્રેક્ટર સહાય યોજના ૨૦૨૫",
        farmer_name: farmerName,
        aadhaar_number: "XXXX-XXXX-૯૪૮૨",
        mobile_number: "૯૮૨૫XXXXXX",
        land_size_acres: farmerLand,
        district: farmerDistrict,
        taluka: "ગોંડલ",
        village: "શ્રીનાથગઢ",
        bank_name: "State Bank of India (SBI)",
        account_number: "૩૦૯૨XXXXXXX",
        ifsc_code: "SBIN0001248",
        caste_category: farmerCaste,
        created_at: new Date().toLocaleDateString("gu-IN"),
      },
    };
  }

  // 5. Feature 1: Greeting & Scheme Category Greeting Flow
  const isGreeting =
    /(^|\s)(hello|નમસ્તે|યોજના|scheme|કેટેગરી|category|હાય)(\s|$|\?|\.|,)/i.test(
      query,
    ) && !query.includes("સહાય");
  if (isGreeting) {
    return {
      response_text:
        lang === "gu"
          ? `🙏 **નમસ્તે ${farmerName}! આઈ-ખેડૂત પોર્ટલ આસિસ્ટન્ટમાં તમારું સ્વાગત છે.**\n\nતમે કયા વિભાગની યોજનાઓ જોવા માંગો છો? નીચે આપેલા સત્તાવાર કેટેગરી બટન પર ક્લિક કરીને માહિતી મેળવી શકો છો:`
          : `🙏 **Hello ${farmerName}! Welcome to the iKhedut Portal Assistant.**\n\nWhich department schemes would you like to explore? Please select a category below:`,
      language: lang,
      matched_schemes: [IKHEDUT_SCHEMES[0], IKHEDUT_SCHEMES[1]],
      citations: [],
      intent: "category_greeting",
      show_category_chips: true,
    };
  }

  const matched = IKHEDUT_SCHEMES.filter((s) => {
    return (
      query.includes(s.name_gu) ||
      query.includes(s.name_en.toLowerCase()) ||
      s.tags.some((t) => query.includes(t.toLowerCase()))
    );
  });

  let responseText = "";
  if (
    query.includes("નામ") ||
    query.includes("name") ||
    query.includes("who am i") ||
    query.includes("પ્રોફાઈલ") ||
    query.includes("profile")
  ) {
    if (lang === "gu") {
      responseText = `🌾 **તમારી ખેડૂત પ્રોફાઈલ વિગત:**\n\n• **નામ:** ${farmerName}\n• **જિલ્લો:** ${farmerDistrict}\n• **જમીન ધારણ:** ${farmerLand} એકર\n• **કેટેગરી:** ${farmerCaste}\n\nતમે ઉપર 'પ્રોફાઇલ બદલો' બટન પરથી ગમે ત્યારે તમારી વિગતો સુધારી શકો છો.`;
    } else {
      responseText = `🌾 **Your Farmer Profile:**\n\n• **Name:** ${farmerName}\n• **District:** ${farmerDistrict}\n• **Landholding:** ${farmerLand} Acres\n• **Category:** ${farmerCaste}`;
    }
  } else if (matched.length > 0) {
    const sch = matched[0];
    if (lang === "gu") {
      responseText = `🌾 **${sch.name_gu}**\n\nઆ માહિતી સ્થાનિક સંદર્ભ કેટલોગ પરથી છે; તે હાલના સરકારી સહાય દર, તમારી પાત્રતા અથવા મંજૂરીની પુષ્ટિ નથી. કેટલોગમાં દર્શાવેલો સંભવિત દર **${sch.subsidy_percentage}** અને મર્યાદા **₹${sch.max_subsidy_amount.toLocaleString("en-IN")}** છે. અરજી પહેલાં iKhedut પોર્ટલ અથવા સંબંધિત વિભાગમાં હાલના નિયમો ચકાસો.\n\n📋 **કેટલોગમાં દર્શાવેલા જરૂરી કાગળો:**\n${sch.required_documents_gu.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\n**કેટલોગમાં દર્શાવેલા પાત્રતા માપદંડ:**\n${sch.eligibility_criteria_gu.map((e) => `• ${e}`).join("\n")}\n\n🌐 **અધિકૃત અરજી:** ikhedut.gujarat.gov.in પર હાલની યોજના વિગતો તપાસો.`;
    } else if (lang === "hi") {
      responseText = `🌾 **${sch.name_hi || sch.name_en}**\n\nयह स्थानीय संदर्भ सूची की जानकारी है; यह वर्तमान सरकारी दर, आपकी पात्रता या स्वीकृति की पुष्टि नहीं है। सूची में संभावित सहायता **${sch.subsidy_percentage}** और अधिकतम सीमा **₹${sch.max_subsidy_amount.toLocaleString("en-IN")}** दी गई है। आवेदन से पहले iKhedut पोर्टल या संबंधित विभाग से मौजूदा नियम जाँचें।\n\n📋 **सूची में दिए गए दस्तावेज़:**\n${sch.required_documents_en.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\n🌐 **आधिकारिक आवेदन:** ikhedut.gujarat.gov.in पर वर्तमान योजना विवरण देखें।`;
    } else {
      responseText = `🌾 **${sch.name_en}**\n\nThis information comes from the local reference catalog; it does not confirm current government rates, your eligibility, or approval. The catalog lists a possible rate of **${sch.subsidy_percentage}** and a maximum cap of **₹${sch.max_subsidy_amount.toLocaleString("en-IN")}**. Check current rules with iKhedut or the responsible department before applying.\n\n📋 **Documents listed in the catalog:**\n${sch.required_documents_en.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\n**Eligibility criteria listed in the catalog:**\n${sch.eligibility_criteria_en.map((e) => `• ${e}`).join("\n")}\n\n🌐 **Official application:** Check current scheme details at ikhedut.gujarat.gov.in.`;
    }
  } else {
    if (lang === "gu") {
      responseText = `નમસ્તે **${farmerName}**! હું સ્થાનિક સંદર્ભ કેટલોગમાં ખેતીવાડી, સિંચાઈ, પશુપાલન અને અન્ય યોજનાઓ શોધી શકું છું. આ યાદી હાલની સત્તાવાર યોજના અથવા સહાય દરની પુષ્ટિ નથી. કઈ યોજનાની માહિતી જોઈએ છે?`;
    } else {
      responseText = `Hello **${farmerName}**! I can search the local reference catalog for agriculture, irrigation, livestock, and other schemes. It does not confirm current official schemes or rates. Which scheme would you like to look up?`;
    }
  }

  return {
    response_text: responseText,
    language: lang,
    matched_schemes: matched.length > 0 ? [matched[0]] : [],
    citations: [],
    intent: "scheme_inquiry",
  };
}
