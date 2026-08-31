export interface CropMarketPrice {
  id: string;
  category: 'cereal' | 'pulses' | 'oilseeds' | 'spices' | 'vegetables' | 'cash_crops';
  category_gu: string;
  category_en: string;
  commodity_en: string;
  commodity_gu: string;
  variety_gu: string;
  variety_en: string;
  market_name_gu: string;
  market_name_en: string;
  district_gu: string;
  district_en: string;
  min_price: number; // in INR per 20kg (મણ)
  max_price: number; // in INR per 20kg (મણ)
  modal_price: number; // in INR per 20kg (મણ)
  price_per_quintal: number; // in INR per 100kg (ક્વિન્ટલ)
  unit_gu: string;
  unit_en: string;
  arrival_tonnes: number;
  price_trend: 'up' | 'down' | 'stable';
  trend_percentage: number;
  msp_rate?: number; // Minimum Support Price per quintal
  date: string;
  advisory_gu: string;
  advisory_en: string;
}

export const GUJARAT_MARKET_PRICES: CropMarketPrice[] = [
  // 1. WHEAT (ઘઉં)
  {
    id: 'crop-wheat-lokwan',
    category: 'cereal',
    category_gu: 'ધાન્ય પાક (Grains)',
    category_en: 'Cereals & Grains',
    commodity_en: 'Wheat (Lokwan)',
    commodity_gu: 'ઘઉં (લોકવાન)',
    variety_gu: 'લોકવાન નં. ૧ (સુપર ક્વોલિટી)',
    variety_en: 'Lokwan Grade-1',
    market_name_gu: 'રાજકોટ બેડી માર્કેટ યાર્ડ (Rajkot APMC)',
    market_name_en: 'Rajkot Bedi APMC Market',
    district_gu: 'રાજકોટ',
    district_en: 'Rajkot',
    min_price: 490,
    max_price: 595,
    modal_price: 545,
    price_per_quintal: 2725,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 420,
    price_trend: 'up',
    trend_percentage: 2.4,
    msp_rate: 2275,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'ઘઉંના ભાવમાં સુધારો છે. સૂકા અને સાફ કરેલા લોકવાન ઘઉંને સારો ટેકો મળે છે.',
    advisory_en: 'Wheat prices are firming up. Clean dry stock fetches top-tier rates.'
  },
  {
    id: 'crop-wheat-tukda',
    category: 'cereal',
    category_gu: 'ધાન્ય પાક (Grains)',
    category_en: 'Cereals & Grains',
    commodity_en: 'Wheat (Tukda)',
    commodity_gu: 'ઘઉં (ટુકડા)',
    variety_gu: 'ટુકડા પ્રીમિયમ',
    variety_en: 'Tukda Premium',
    market_name_gu: 'ગોંડલ માર્કેટ યાર્ડ (Gondal APMC)',
    market_name_en: 'Gondal APMC Market',
    district_gu: 'રાજકોટ',
    district_en: 'Rajkot',
    min_price: 520,
    max_price: 640,
    modal_price: 580,
    price_per_quintal: 2900,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 310,
    price_trend: 'up',
    trend_percentage: 3.1,
    msp_rate: 2275,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'ટુકડા ઘઉંની માંગ ઊંચી હોવાથી મણે ₹૬૪૦ સુધીના ભાવ બોલાય છે.',
    advisory_en: 'High consumer demand for Tukda variety pushing maximum rates.'
  },

  // 2. JUVAR / JOWAR (જુવાર)
  {
    id: 'crop-juvar-white',
    category: 'cereal',
    category_gu: 'ધાન્ય પાક (Grains)',
    category_en: 'Cereals & Grains',
    commodity_en: 'Jowar / Juvar (Sorghum)',
    commodity_gu: 'જુવાર (સફેદ / દેશી)',
    variety_gu: 'સફેદ મોતીચૂર જુવાર',
    variety_en: 'White Motichoor Jowar',
    market_name_gu: 'અમરેલી માર્કેટ યાર્ડ (Amreli APMC)',
    market_name_en: 'Amreli APMC Market',
    district_gu: 'અમરેલી',
    district_en: 'Amreli',
    min_price: 680,
    max_price: 920,
    modal_price: 810,
    price_per_quintal: 4050,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 85,
    price_trend: 'stable',
    trend_percentage: 0.5,
    msp_rate: 3180,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'જુવારના ભાવ સ્થિર છે. દેશી સફેદ જુવારના સારા ભાવ મળી રહ્યા છે.',
    advisory_en: 'Jowar market is steady with strong demand for bold white grains.'
  },

  // 3. BAJARI / BAJRA (બાજરી)
  {
    id: 'crop-bajari-desi',
    category: 'cereal',
    category_gu: 'ધાન્ય પાક (Grains)',
    category_en: 'Cereals & Grains',
    commodity_en: 'Bajra / Bajari (Pearl Millet)',
    commodity_gu: 'બાજરી (દેશી / હાઇબ્રિડ)',
    variety_gu: 'દેશી લીલી છાંયવાળી બાજરી',
    variety_en: 'Desi Greenish Pearl Millet',
    market_name_gu: 'ડીસા માર્કેટ યાર્ડ (Deesa APMC)',
    market_name_en: 'Deesa APMC Market',
    district_gu: 'બનાસકાંઠા',
    district_en: 'Banaskantha',
    min_price: 430,
    max_price: 540,
    modal_price: 485,
    price_per_quintal: 2425,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 260,
    price_trend: 'up',
    trend_percentage: 1.8,
    msp_rate: 2500,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'બનાસકાંઠા અને સૌરાષ્ટ્રમાં બાજરીની આવક સારી છે. દેશી બાજરીના ઊંચા ભાવ છે.',
    advisory_en: 'Steady arrivals of pearl millet; desi varieties receiving premium bids.'
  },

  // 4. CHOKHA / PADDY / RICE (ચોખા / ડાંગર)
  {
    id: 'crop-chokha-paddy',
    category: 'cereal',
    category_gu: 'ધાન્ય પાક (Grains)',
    category_en: 'Cereals & Grains',
    commodity_en: 'Paddy / Rice (Chokha / Dangar)',
    commodity_gu: 'ડાંગર / ચોખા (જીરાસાર / ગુર્જરી)',
    variety_gu: 'જીરાસાર - ગુર્જરી ડાંગર',
    variety_en: 'Jirasar & Gurjari Paddy',
    market_name_gu: 'બાવળા માર્કેટ યાર્ડ (Bavla APMC)',
    market_name_en: 'Bavla APMC Market',
    district_gu: 'અમદાવાદ / આણંદ',
    district_en: 'Ahmedabad / Anand',
    min_price: 420,
    max_price: 565,
    modal_price: 490,
    price_per_quintal: 2450,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 540,
    price_trend: 'stable',
    trend_percentage: 0.8,
    msp_rate: 2300,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'બાવળા અને માતર યાર્ડમાં ડાંગરની જોરદાર લેવાલી. જીરાસાર ડાંગરમાં સારો ટેકો.',
    advisory_en: 'Bavla market witnessing active buying interest for fine grain paddy.'
  },

  // 5. MUSTARD / RAI / RAYDO (રાયડો / સરસવ)
  {
    id: 'crop-mustard-raydo',
    category: 'oilseeds',
    category_gu: 'તેલીબિયાં પાક (Oilseeds)',
    category_en: 'Oilseeds',
    commodity_en: 'Mustard Seeds / Raydo (રાયડો)',
    commodity_gu: 'રાયડો / સરસવ (Mustard)',
    variety_gu: 'કાળો રાયડો (૪૨% તેલ ટકાવારી)',
    variety_en: 'Black Mustard (42% Oil Content)',
    market_name_gu: 'થરાદ / પાટણ માર્કેટ યાર્ડ',
    market_name_en: 'Tharad & Patan APMC',
    district_gu: 'પાટણ / બનાસકાંઠા',
    district_en: 'Patan / Banaskantha',
    min_price: 980,
    max_price: 1220,
    modal_price: 1110,
    price_per_quintal: 5550,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 380,
    price_trend: 'up',
    trend_percentage: 2.6,
    msp_rate: 5650,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'તેલ મિલોની લેવાલી વધતાં રાયડાના ભાવમાં ઉછાળો. તેલ ટકાવારી વધારે હોય તો ભાવ ઊંચા મળે છે.',
    advisory_en: 'Mustard demand surges backed by oil millers; high oil-content stocks gain.'
  },

  // 6. DIVELA / CASTOR (દિવેલા / એરંડા)
  {
    id: 'crop-divela-castor',
    category: 'oilseeds',
    category_gu: 'તેલીબિયાં પાક (Oilseeds)',
    category_en: 'Oilseeds',
    commodity_en: 'Castor Seeds / Divela (દિવેલા / એરંડા)',
    commodity_gu: 'દિવેલા / એરંડા (Castor Seeds)',
    variety_gu: 'ગુજરાત એરંડા-૫ (હાઇબ્રિડ)',
    variety_en: 'Gujarat Castor-5 Hybrid',
    market_name_gu: 'કડી / પાલનપુર માર્કેટ યાર્ડ',
    market_name_en: 'Kadi & Palanpur APMC',
    district_gu: 'મહેસાણા / બનાસકાંઠા',
    district_en: 'Mehsana / Banaskantha',
    min_price: 1120,
    max_price: 1290,
    modal_price: 1215,
    price_per_quintal: 6075,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 490,
    price_trend: 'up',
    trend_percentage: 1.5,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'દિવેલામાં નિકાસ માંગ સારી રહેતાં ભાવ મણે ₹૧,૨૦૦ ની ઉપર મજબૂત બન્યા છે.',
    advisory_en: 'Castor seed market maintains strong tone supported by steady export demand.'
  },

  // 7. COTTON (કપાસ)
  {
    id: 'crop-cotton-bt',
    category: 'cash_crops',
    category_gu: 'રોકડિયા પાક (Cash Crops)',
    category_en: 'Cash Crops',
    commodity_en: 'Cotton (Kapas / Shankar-6)',
    commodity_gu: 'કપાસ (શંકર-૬ / બીટી કપાસ)',
    variety_gu: 'શંકર-૬ સુપર સફેદ રૂ',
    variety_en: 'Shankar-6 Premium White Lint',
    market_name_gu: 'ગોંડલ / રાજકોટ માર્કેટ યાર્ડ',
    market_name_en: 'Gondal & Rajkot APMC',
    district_gu: 'રાજકોટ / બોટાદ',
    district_en: 'Rajkot / Botad',
    min_price: 1420,
    max_price: 1710,
    modal_price: 1580,
    price_per_quintal: 7900,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 1250,
    price_trend: 'up',
    trend_percentage: 2.8,
    msp_rate: 7020,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'સૂકા અને સ્વચ્છ કપાસમાં મણે ₹૧,૭૦૦+ ના ભાવ મળી રહ્યા છે.',
    advisory_en: 'Good moisture-free Shankar-6 cotton fetching above ₹1,700 per 20kg.'
  },

  // 8. GROUNDNUT (મગફળી)
  {
    id: 'crop-groundnut-g20',
    category: 'oilseeds',
    category_gu: 'તેલીબિયાં પાક (Oilseeds)',
    category_en: 'Oilseeds',
    commodity_en: 'Groundnut (Magfali / GG-20)',
    commodity_gu: 'મગફળી (જી-૨૦ / જાડી મગફળી)',
    variety_gu: 'જી-૨૦ જાડી મગફળી',
    variety_en: 'GG-20 Bold Pods',
    market_name_gu: 'ગોંડલ / જૂનાગઢ માર્કેટ યાર્ડ',
    market_name_en: 'Gondal & Junagadh APMC',
    district_gu: 'રાજકોટ / જૂનાગઢ',
    district_en: 'Rajkot / Junagadh',
    min_price: 1250,
    max_price: 1520,
    modal_price: 1390,
    price_per_quintal: 6950,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 980,
    price_trend: 'up',
    trend_percentage: 1.9,
    msp_rate: 6783,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'તેલ મિલો અને દાણા વેપારીઓની સારી માંગ. ગુણવત્તાવાળી મગફળીના સારા ભાવ.',
    advisory_en: 'Steady support from oil millers and peanut shellers for bold pods.'
  },

  // 9. CUMIN / JEERA (જીરું)
  {
    id: 'crop-cumin-jeera',
    category: 'spices',
    category_gu: 'મસાલા પાક (Spices)',
    category_en: 'Spices',
    commodity_en: 'Cumin Seeds (Jeera / જીરું)',
    commodity_gu: 'જીરું (ઊંઝા સિંગલ પત્તી)',
    variety_gu: 'સિંગલ પત્તી બોલ્ડ જીરું',
    variety_en: 'Single Patti Bold Cumin',
    market_name_gu: 'ઊંઝા માર્કેટ યાર્ડ (Unjha APMC)',
    market_name_en: 'Unjha APMC Market',
    district_gu: 'મહેસાણા',
    district_en: 'Mehsana',
    min_price: 4900,
    max_price: 6100,
    modal_price: 5500,
    price_per_quintal: 27500,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 320,
    price_trend: 'up',
    trend_percentage: 4.2,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'વિશ્વપ્રસિદ્ધ ઊંઝા યાર્ડમાં નિકાસ લેવાલીથી જીરુંના ભાવમાં મજબૂત તેજી.',
    advisory_en: 'Unjha Mandi leading robust cumin rally backed by strong export orders.'
  },

  // 10. VEGETABLES (શાકભાજી) - POTATO (બટાટા)
  {
    id: 'crop-veg-potato',
    category: 'vegetables',
    category_gu: 'શાકભાજી (Vegetables)',
    category_en: 'Vegetables',
    commodity_en: 'Potato (Batata / બટાટા)',
    commodity_gu: 'બટાટા (પોખરાજ / બાદશાહ)',
    variety_gu: 'ડીસા સુપર પોખરાજ',
    variety_en: 'Deesa Pukhraj Fresh',
    market_name_gu: 'ડીસા / અમદાવાદ માર્કેટ યાર્ડ',
    market_name_en: 'Deesa & Ahmedabad APMC',
    district_gu: 'બનાસકાંઠા / અમદાવાદ',
    district_en: 'Banaskantha / Ahmedabad',
    min_price: 240,
    max_price: 360,
    modal_price: 300,
    price_per_quintal: 1500,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 1400,
    price_trend: 'stable',
    trend_percentage: 0.2,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'કોલ્ડ સ્ટોરેજ અને તાજા બટાટાની સતત આવક. ગુણવત્તાવાળા બટાટાના સ્થિર ભાવ.',
    advisory_en: 'Steady supplies from Deesa cold storages; stable wholesale trading.'
  },

  // 11. VEGETABLES - ONION (ડુંગળી)
  {
    id: 'crop-veg-onion',
    category: 'vegetables',
    category_gu: 'શાકભાજી (Vegetables)',
    category_en: 'Vegetables',
    commodity_en: 'Onion (Dungli / ડુંગળી)',
    commodity_gu: 'ડુંગળી (લાલ / સફેદ)',
    variety_gu: 'મહુવા લાલ / સફેદ સુકા કંદ',
    variety_en: 'Mahuva Red & White Onion',
    market_name_gu: 'મહુવા / ગોંડલ માર્કેટ યાર્ડ',
    market_name_en: 'Mahuva & Gondal APMC',
    district_gu: 'ભાવનગર / રાજકોટ',
    district_en: 'Bhavnagar / Rajkot',
    min_price: 260,
    max_price: 480,
    modal_price: 370,
    price_per_quintal: 1850,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 1850,
    price_trend: 'up',
    trend_percentage: 3.5,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'મહુવા અને ગોંડલ યાર્ડમાં લાલ ડુંગળીની ભારે માંગ. સારા માલના ઊંચા ભાવ.',
    advisory_en: 'Robust demand for fresh red bulb onions across Saurashtra mandis.'
  },

  // 12. VEGETABLES - TOMATO (ટામેટા)
  {
    id: 'crop-veg-tomato',
    category: 'vegetables',
    category_gu: 'શાકભાજી (Vegetables)',
    category_en: 'Vegetables',
    commodity_en: 'Tomato (Tameta / ટામેટા)',
    commodity_gu: 'ટામેટા (દેશી / હાઇબ્રિડ)',
    variety_gu: 'હાઇબ્રિડ લાલ ટામેટા',
    variety_en: 'Hybrid Firm Red Tomatoes',
    market_name_gu: 'સુરત / નવસારી / રાજકોટ APMC',
    market_name_en: 'Surat & Rajkot APMC',
    district_gu: 'સુરત / રાજકોટ',
    district_en: 'Surat / Rajkot',
    min_price: 180,
    max_price: 340,
    modal_price: 260,
    price_per_quintal: 1300,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 620,
    price_trend: 'stable',
    trend_percentage: -0.5,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'સ્થાનિક આવક નિયમિત રહેતા ટામેટાના ભાવ સ્થિર રહેવાની સંભાવના છે.',
    advisory_en: 'Consistent local vegetable arrivals keeping tomato prices balanced.'
  },

  // 13. VEGETABLES - GREEN CHILLI (લીલા મરચા)
  {
    id: 'crop-veg-chilli',
    category: 'vegetables',
    category_gu: 'શાકભાજી (Vegetables)',
    category_en: 'Vegetables',
    commodity_en: 'Green Chilli (Marcha / લીલા મરચા)',
    commodity_gu: 'લીલા મરચા (તીખા / ગોંડલ મરચા)',
    variety_gu: 'ગોંડલ સ્પેશિયલ લીલા મરચા',
    variety_en: 'Gondal Fresh Green Chillies',
    market_name_gu: 'ગોંડલ / વડોદરા માર્કેટ યાર્ડ',
    market_name_en: 'Gondal & Vadodara APMC',
    district_gu: 'રાજકોટ / વડોદરા',
    district_en: 'Rajkot / Vadodara',
    min_price: 550,
    max_price: 950,
    modal_price: 750,
    price_per_quintal: 3750,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 210,
    price_trend: 'up',
    trend_percentage: 4.0,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'લીલા મરચાના ભાવમાં તેજી. તાજા અને તીખા મરચાના સારા દામ મળે છે.',
    advisory_en: 'Sharp demand for premium spicy green chillies in wholesale terminals.'
  },

  // 14. VEGETABLES - GARLIC (લસણ)
  {
    id: 'crop-veg-garlic',
    category: 'vegetables',
    category_gu: 'શાકભાજી / મસાલા (Garlic)',
    category_en: 'Vegetables & Condiments',
    commodity_en: 'Garlic (Lasan / લસણ)',
    commodity_gu: 'લસણ (જામનગર / દેશી લસણ)',
    variety_gu: 'જામનગર દેશી સફેદ લસણ',
    variety_en: 'Jamnagar Desi White Garlic',
    market_name_gu: 'જામનગર / ગોંડલ માર્કેટ યાર્ડ',
    market_name_en: 'Jamnagar & Gondal APMC',
    district_gu: 'જામનગર / રાજકોટ',
    district_en: 'Jamnagar / Rajkot',
    min_price: 1800,
    max_price: 3200,
    modal_price: 2500,
    price_per_quintal: 12500,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 340,
    price_trend: 'up',
    trend_percentage: 5.2,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'જામનગર લસણની રાષ્ટ્રીય માંગથી ભાવમાં ઉત્સાહ. મોટો માલ ₹૩,૦૦૦+ પર ટ્રેડ થાય છે.',
    advisory_en: 'Strong national off-take for Jamnagar garlic elevating prices above ₹3,000/20kg.'
  },

  // 15. PULSES - CHANA / GRAM (ચણા)
  {
    id: 'crop-pulses-chana',
    category: 'pulses',
    category_gu: 'કઠોળ પાક (Pulses)',
    category_en: 'Pulses',
    commodity_en: 'Gram / Chickpeas (Chana / ચણા)',
    commodity_gu: 'ચણા (દેશી ચણા)',
    variety_gu: 'ગુજરાત ચણા-૫ (પીળા)',
    variety_en: 'Gujarat Chana-5 Yellow',
    market_name_gu: 'દાહોદ / રાજકોટ માર્કેટ યાર્ડ',
    market_name_en: 'Dahod & Rajkot APMC',
    district_gu: 'દાહોદ / રાજકોટ',
    district_en: 'Dahod / Rajkot',
    min_price: 1050,
    max_price: 1280,
    modal_price: 1160,
    price_per_quintal: 5800,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 410,
    price_trend: 'stable',
    trend_percentage: 0.9,
    msp_rate: 5440,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'ચણાના ભાવ એમએસપી (MSP) કરતા ઊંચા ટ્રેડ થઈ રહ્યા છે.',
    advisory_en: 'Chana wholesale prices trading comfortably above Government MSP rates.'
  },

  // 16. SESAME / TIL (તલ)
  {
    id: 'crop-oilseeds-til',
    category: 'oilseeds',
    category_gu: 'તેલીબિયાં પાક (Oilseeds)',
    category_en: 'Oilseeds',
    commodity_en: 'Sesame Seeds (Tal / તલ)',
    commodity_gu: 'સફેદ તલ / કાળા તલ',
    variety_gu: 'ગુજરાત તલ-૧ (સફેદ બોલ્ડ)',
    variety_en: 'Gujarat Tal-1 Bold White',
    market_name_gu: 'રાજકોટ / અમરેલી માર્કેટ યાર્ડ',
    market_name_en: 'Rajkot & Amreli APMC',
    district_gu: 'રાજકોટ / અમરેલી',
    district_en: 'Rajkot / Amreli',
    min_price: 2400,
    max_price: 3100,
    modal_price: 2750,
    price_per_quintal: 13750,
    unit_gu: '૨૦ કિગ્રા (મણ)',
    unit_en: '20 kg (Man)',
    arrival_tonnes: 190,
    price_trend: 'up',
    trend_percentage: 2.1,
    date: 'આજના તાજા ભાવ (Today)',
    advisory_gu: 'સફેદ તલમાં નિકાસકારોની સારી લેવાલી હોવાથી બજાર મજબૂત છે.',
    advisory_en: 'White sesame demand remains elevated with strong export support.'
  }
];

export function getPricesByCategory(category: string): CropMarketPrice[] {
  if (!category || category === 'all') return GUJARAT_MARKET_PRICES;
  return GUJARAT_MARKET_PRICES.filter(p => p.category === category);
}

export function searchCropPrices(query: string): CropMarketPrice[] {
  const q = query.toLowerCase().trim();
  if (!q) return GUJARAT_MARKET_PRICES;

  return GUJARAT_MARKET_PRICES.filter(p => 
    p.commodity_gu.toLowerCase().includes(q) ||
    p.commodity_en.toLowerCase().includes(q) ||
    p.market_name_gu.toLowerCase().includes(q) ||
    p.market_name_en.toLowerCase().includes(q) ||
    p.variety_gu.toLowerCase().includes(q) ||
    p.district_gu.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (q.includes('wheat') || q.includes('ઘઉં')) && p.id.includes('wheat') ||
    (q.includes('juvar') || q.includes('જુવાર') || q.includes('jowar')) && p.id.includes('juvar') ||
    (q.includes('bajar') || q.includes('બાજરી') || q.includes('bajra')) && p.id.includes('bajar') ||
    (q.includes('chokh') || q.includes('ચોખા') || q.includes('ડાંગર') || q.includes('rice') || q.includes('paddy')) && p.id.includes('chokha') ||
    (q.includes('mustard') || q.includes('રાયડો') || q.includes('સરસવ') || q.includes('rai')) && p.id.includes('mustard') ||
    (q.includes('divela') || q.includes('દિવેલા') || q.includes('એરંડા') || q.includes('castor')) && p.id.includes('divela') ||
    (q.includes('veg') || q.includes('શાકભાજી') || q.includes('બટાટા') || q.includes('ડુંગળી') || q.includes('ટામેટા') || q.includes('મરચા') || q.includes('લસણ')) && p.category === 'vegetables' ||
    (q.includes('cotton') || q.includes('કપાસ')) && p.id.includes('cotton') ||
    (q.includes('groundnut') || q.includes('મગફળી')) && p.id.includes('groundnut') ||
    (q.includes('cumin') || q.includes('જીરું') || q.includes('jeera')) && p.id.includes('cumin')
  );
}
