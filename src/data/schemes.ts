import { Scheme, SchemeCategoryInfo } from '../types';

export const SCHEME_CATEGORIES: SchemeCategoryInfo[] = [
  {
    id: 'agriculture',
    name_gu: 'ખેતીવાડી યોજનાઓ',
    name_en: 'Agriculture & Farm Mechanization',
    name_hi: 'कृषि एवं कृषि यंत्रीकरण',
    icon: '🚜',
    description_gu: 'ટ્રેક્ટર, રોટાવેટર, કાંટાળી તારની વાડ, એગ્રી ડ્રોન, સ્માર્ટફોન અને ખેત ગોડાઉન સહાય',
    description_en: 'Tractors, Rotavators, Barbed Wire Fencing, Agri Drones, Smartphone, and Godowns',
    tags_gu: ['ટ્રેક્ટર', 'તાર વાડ', 'ડ્રોન', 'ગોડાઉન', 'સ્માર્ટફોન', 'સાધન'],
    color: 'emerald',
    scheme_count: 6
  },
  {
    id: 'horticulture',
    name_gu: 'બાગાયતી યોજનાઓ',
    name_en: 'Horticulture & Greenhouses',
    name_hi: 'बागवानी एवं ग्रीनहाउस',
    icon: '🍎',
    description_gu: 'ગ્રીનહાઉસ, શેડનેટ હાઉસ, પ્લાસ્ટિક મલ્ચિંગ, ફળપાક વાવેતર અને પેક હાઉસ સહાય',
    description_en: 'Greenhouse, Shade Net, Plastic Mulching, Fruit Plantation, and Pack Houses',
    tags_gu: ['ગ્રીનહાઉસ', 'શેડનેટ', 'મલ્ચિંગ', 'કેરી', 'ફળપાક', 'બાગાયત'],
    color: 'rose',
    scheme_count: 2
  },
  {
    id: 'animal_husbandry',
    name_gu: 'પશુપાલન અને ડેરી',
    name_en: 'Animal Husbandry & Dairy',
    name_hi: 'पशुपालन एवं डेयरी',
    icon: '🐄',
    description_gu: 'દેશી ગાય નિભાવ ખર્ચ (₹૯૦૦/માસ), દૂધાળી ગાય/ભેંસ ખરીદી અને કેટલ શેડ સહાય',
    description_en: 'Desi Cow ₹900/mo DBT, Milch Cattle Purchase, and Modern Cattle Shed',
    tags_gu: ['દેશી ગાય', 'દૂધાળા પશુ', 'કેટલ શેડ', 'ડેરી', 'પશુપાલન'],
    color: 'amber',
    scheme_count: 2
  },
  {
    id: 'irrigation_solar',
    name_gu: 'સૂક્ષ્મ પિયત & સોલાર પંપ',
    name_en: 'Micro Irrigation & Solar Energy',
    name_hi: 'सूक्ष्म सिंचाई एवं सोलर पंप',
    icon: '💧',
    description_gu: 'ટપક/ફુવારા પદ્ધતિ (GGRC ૭૦% સહાય), PM-KUSUM સોલાર પંપ અને ખેત તલાવડી',
    description_en: 'GGRC Drip & Sprinkler (up to 70%), PM-KUSUM Solar Pump, and Farm Ponds',
    tags_gu: ['ટપક', 'ફુવારા', 'સોલાર પંપ', 'કુસુમ', 'ખેત તલાવડી', 'GGRC'],
    color: 'sky',
    scheme_count: 3
  },
  {
    id: 'fisheries',
    name_gu: 'મત્સ્યપાલન યોજનાઓ',
    name_en: 'Fisheries & Aquaculture',
    name_hi: 'मत्स्य पालन योजनाएं',
    icon: '🐟',
    description_gu: 'ફિશિંગ બોટ/નેટ આધુનિકીકરણ, ફિશ પોન્ડ, ઝીંગા પાલન અને કોલ્ડ ચેઈન સહાય',
    description_en: 'Fishing Boat/Net Modernization, Fish Pond, Prawn Hatchery, and Cold Storage',
    tags_gu: ['મત્સ્યપાલન', 'બોટ', 'નેટ', 'ઝીંગા', 'માછલી', 'દરિયાકાંઠો'],
    color: 'teal',
    scheme_count: 1
  },
  {
    id: 'natural_farming',
    name_gu: 'પ્રાકૃતિક અને ઓર્ગેનિક ખેતી',
    name_en: 'Natural & Organic Farming',
    name_hi: 'प्राकृतिक एवं जैविक खेती',
    icon: '🌱',
    description_gu: 'જીવામૃત કિટ/ડ્રમ સહાય (₹૧,૨૪૮), પ્રાકૃતિક કૃષિ પ્રોત્સાહન અને સર્ટિફિકેશન',
    description_en: 'JeevAmrut Kit & Drums (₹1,248), Zero-Budget Natural Farming Certification',
    tags_gu: ['પ્રાકૃતિક ખેતી', 'જીવામૃત', 'ઓર્ગેનિક', 'દેશી બિયારણ', 'જૈવિક'],
    color: 'lime',
    scheme_count: 1
  }
];

export const IKHEDUT_SCHEMES: Scheme[] = [
  {
    id: "ikhedut-sch-001",
    name_en: "Tractor Sahay Yojana (Tractor Assistance Scheme)",
    name_gu: "ટ્રેક્ટર સહાય યોજના",
    name_hi: "ट्रैक्टर सहायता योजना",
    category: "Agrimachinery",
    category_gu: "ખેતીવાડી યાંત્રિકીકરણ",
    subsidy_percentage: "25% to 50%",
    max_subsidy_amount: 60000,
    subsidy_breakdown: {
      general: "25% of purchase cost or up to ₹45,000 (for PTO HP up to 20-40 HP)",
      small_marginal: "35% of purchase cost or up to ₹55,000",
      sc_st: "50% of purchase cost or up to ₹60,000",
      women: "50% of purchase cost or up to ₹60,000"
    },
    eligibility_criteria_en: [
      "Farmer must possess cultivable agricultural land in Gujarat (verified by 7/12 and 8-A records).",
      "Only one tractor subsidy allowed per farmer/family within a 10-year period.",
      "The tractor must be purchased from an authorized manufacturing dealer approved by the Government of Gujarat.",
      "Tractor must have valid CMVR compliance certificate and PTO HP as per guideline."
    ],
    eligibility_criteria_gu: [
      "ગુજરાતના ખેડૂત કે જેમના નામે ખેતીલાયક જમીન ૭/૧૨ અને ૮-અ માં નોંધાયેલ હોય.",
      "કુટુંબ દીઠ દર ૧૦ વર્ષમાં એક જ વખત ટ્રેક્ટર સહાય મળવાપાત્ર રહેશે.",
      "ગુજરાત સરકાર માન્ય અધિકૃત ડીલર પાસેથી જ નવું ટ્રેક્ટર ખરીદવાનું રહેશે.",
      "CMVR પ્રમાણિત 20 થી 40 PTO HP સુધીનું મોડેલ હોવું જરૂરી."
    ],
    required_documents_en: [
      "Aadhaar Card (Linked with Bank Account)",
      "7/12 (RoR) and 8-A Khatauni Land Records (latest 3 months)",
      "Bank Account Passbook / Cancelled Cheque (Active DBT enabled)",
      "Caste Certificate (if applying under SC/ST/SEBC quota)",
      "Quotation / Performa Invoice from Authorized Tractor Dealer",
      "Self-Declaration of not availing tractor subsidy in past 10 years"
    ],
    required_documents_gu: [
      "આધાર કાર્ડ (બેંક એકાઉન્ટ સાથે લિંક કરેલું)",
      "૭/૧૨ અને ૮-અ ના તાજેતરના ૩ માસના ઉતારા",
      "બેંક પાસબુકની નકલ અથવા કેન્સલ ચેક (DBT સક્ષમ)",
      "જાતિનો દાખલો (SC/ST/SEBC ખેડૂતો માટે)",
      "અધિકૃત ડીલરનું કવોટેશન / પ્રોફોર્મા બિલ",
      "છેલ્લા ૧૦ વર્ષમાં સહાય ન લીધા અંગેનું બાંયધરી પત્રક"
    ],
    application_url: "https://ikhedut.gujarat.gov.in/Public/frm_Public_SchemeSchemeDetails.aspx",
    application_period: "Portal open round the year subject to target allocations (April - January)",
    tags: ["tractor", "machinery", "farming equipment", "ટ્રેક્ટર", "સાધન", "યાંત્રિકીકરણ", "ખેતીવાડી"]
  },
  {
    id: "ikhedut-sch-002",
    name_en: "Micro Irrigation Scheme (Drip and Sprinkler Subsidy - GGRC)",
    name_gu: "સૂક્ષ્મ પિયત પદ્ધતિ સહાય (ટપક અને ફુવારા પિયત યોજના - GGRC)",
    name_hi: "सूक्ष्म सिंचाई ड्रिप एवं स्प्रिंकलर योजना",
    category: "Irrigation",
    category_gu: "સૂક્ષ્મ પિયત (સિંચાઈ)",
    subsidy_percentage: "55% to 70%",
    max_subsidy_amount: 85000,
    subsidy_breakdown: {
      general: "55% of the total unit cost for normal general farmers",
      small_marginal: "70% of total unit cost for Small and Marginal farmers (holding < 2 Hectares)",
      tribal_sc_st: "70% to 85% in Tribal areas / Dark zones as per TSP guidelines"
    },
    eligibility_criteria_en: [
      "All farmers holding agricultural land with assured irrigation water source (well, borewell, canal, farm pond).",
      "Electricity connection or solar pump must be active at the site.",
      "Eligible once every 7 years for the same piece of agricultural land."
    ],
    eligibility_criteria_gu: [
      "સિંચાઈ માટે સક્ષમ જળસ્ત્રોત (કૂવો, બોરવેલ, કેનાલ કે ખેત તલાવડી) ધરાવતા તમામ ખેડૂતો.",
      "ખેતરમાં વીજ જોડાણ અથવા સોલાર પંપ કાર્યરત હોવો જરૂરી.",
      "સમાન સર્વે નંબર માટે દર ૭ વર્ષે એક વખત સહાય મળવાપાત્ર છે."
    ],
    required_documents_en: [
      "Aadhaar Card copy",
      "7/12, 8-A and Form 6 (Hakk Patrak)",
      "Electricity Bill / Solar Pump installation certificate / Water source proof",
      "Soil & Water Testing Report (from approved agri lab)",
      "Quotation and Farm layout design by GGRC empaneled micro-irrigation vendor"
    ],
    required_documents_gu: [
      "આધાર કાર્ડ નકલ",
      "૭/૧૨, ૮-અ અને ૬ નંબર હક્ક પત્રક",
      "વીજળી બિલ અથવા સોલાર પંપ પ્રમાણપત્ર / પાણીનો પુરાવો",
      "જમીન અને પાણી ચકાસણી રિપોર્ટ",
      "GGRC માન્ય કંપનીનું એસ્ટીમેટ અને ખેતરનો લેઆઉટ નકશો"
    ],
    application_url: "https://ggrc.co.in",
    application_period: "Continuous open throughout the agricultural season",
    tags: ["drip", "sprinkler", "water saving", "GGRC", "ટપક", "સિંચાઈ", "ફુવારા", "જળ"]
  },
  {
    id: "ikhedut-sch-003",
    name_en: "Kantedar Tar Fencing Scheme (Barbed Wire Fencing for Crop Protection)",
    name_gu: "કાંટાળી તારની વાડ યોજના (જંગલી પ્રાણીઓથી પાક રક્ષણ)",
    name_hi: "कटीले तार की बाड़ योजना",
    category: "Crop Protection",
    category_gu: "પાક રક્ષણ",
    subsidy_percentage: "50% or ₹200/Running Meter",
    max_subsidy_amount: 40000,
    subsidy_breakdown: {
      general: "₹200 per running meter or 50% of the cost (whichever is less), up to ₹40,000 per farmer / group",
      group_farming: "Up to ₹2,00,000 for cluster group of farmers with contiguous landholding > 5 Hectares"
    },
    eligibility_criteria_en: [
      "Farmer or cluster group of farmers suffering from wild animal menace (Blue bull/Nilgai, Wild boar).",
      "Group application of neighboring farmers preferred (minimum cluster length of 400 meters).",
      "Fencing structure must follow state agriculture department specifications (cement poles + GI barbed wire)."
    ],
    eligibility_criteria_gu: [
      "જંગલી પ્રાણીઓ (રોઝ, ભૂંડ વગેરે) ના ત્રાસથી પાક રક્ષણ માટે ખેડૂતો કે ખેડૂત જૂથો.",
      "નજીકના ખેડૂતોનું ક્લસ્ટર બનાવીને સંયુક્ત અરજીને પ્રાધાન્ય (ન્યૂનતમ ૪૦૦ મીટર લંબાઈ).",
      "નિયત માપદંડ મુજબ સિમેન્ટ થાંભલા અને જી.આઈ. કાંટાળી તાર લગાવવી ફરજિયાત."
    ],
    required_documents_en: [
      "Aadhaar Card of all participating farmers",
      "7/12, 8-A and Village Map (Naksho) indicating boundary lines",
      "Group Consent Agreement / Sahmati Patrak",
      "Bank Passbook / Cancelled Cheque",
      "Geo-tagged photographs before and after fencing completion"
    ],
    required_documents_gu: [
      "તમામ સહભાગી ખેડૂતોના આધાર કાર્ડ",
      "૭/૧૨, ૮-અ અને સીમા દર્શાવતો ગામનો નકશો",
      "ખેડૂત જૂથ સંમતિ પત્રક",
      "બેંક પાસબુક નકલ",
      "કામ શરૂ કરતાં પહેલાં અને પૂર્ણ થયા પછીના જીઓ-ટેગ ફોટા"
    ],
    application_url: "https://ikhedut.gujarat.gov.in",
    application_period: "Usually portal window opens July - September annually",
    tags: ["fencing", "protection", "nilgai", "boar", "વાડ", "કાંટાળી તાર", "પાક રક્ષણ", "ખેતીવાડી"]
  },
  {
    id: "ikhedut-sch-004",
    name_en: "Desi Gau Sahay Yojana (Indigenous Cow Maintenance Allowance for Natural Farming)",
    name_gu: "દેશી ગાય નિભાવ ખર્ચ સહાય યોજના (પ્રાકૃતિક ખેતી)",
    name_hi: "देशी गाय रखरखाव सहायता योजना",
    category: "Natural Farming",
    category_gu: "પ્રાકૃતિક ખેતી",
    subsidy_percentage: "100% Monthly Allowance (₹900/month)",
    max_subsidy_amount: 10800,
    subsidy_breakdown: {
      per_month: "₹900 per month (₹10,800 per annum) directly credited into DBT bank account for 1 indigenous cow maintenance",
      natural_farming_kit: "Additional one-time ₹1,248 assistance for natural farming input preparation kit (drums, barrels)"
    },
    eligibility_criteria_en: [
      "Farmer must own at least one indigenous breed cow (Gir, Kankrej, or local Desi cow) with official ear-tag.",
      "Farmer must have received certification/training in Natural Farming (JeevAmrut, BeejAmrut).",
      "Must practice zero-budget natural farming on at least portion of own land."
    ],
    eligibility_criteria_gu: [
      "ખેડૂત પાસે કાનમાં ટેગ (Ear Tag) ધરાવતી ઓછામાં ઓછી એક દેશી ગાય (ગીર, કાંકરેજ અથવા સ્થાનિક દેશી ગાય) હોવી જોઈએ.",
      "પ્રાકૃતિક ખેતીની તાલીમ લીધેલી હોવી જોઈએ (જીવામૃત, બીજામૃત બનાવવાની જાણકારી).",
      "પોતાની જમીન પર રાસાયણિક ખાતર વગર પ્રાકૃતિક ખેતી કરવી ફરજિયાત."
    ],
    required_documents_en: [
      "Aadhaar Card",
      "7/12 and 8-A records",
      "Veterinary Officer verification certificate with Cow Ear-tag number (12 digits)",
      "Bank Passbook (DBT linked)",
      "Natural Farming Training / Master Trainer recommendation"
    ],
    required_documents_gu: [
      "આધાર કાર્ડ",
      "૭/૧૨ અને ૮-અ ઉતારા",
      "પશુ ચિકિત્સક અધિકારીનું ૧૨ આંકડાનું ઈયર-ટેગ પ્રમાણપત્ર",
      "બેંક પાસબુક (DBT સક્ષમ)",
      "પ્રાકૃતિક ખેતી તાલીમ પ્રમાણપત્ર / સંમતિ"
    ],
    application_url: "https://ikhedut.gujarat.gov.in",
    application_period: "Year-round subject to verification quota",
    tags: ["cow", "natural farming", "desi cow", "dbt", "દેશી ગાય", "ગૌ સહાય", "પ્રાકૃતિક ખેતી", "જીવામૃત", "પશુપાલન"]
  },
  {
    id: "ikhedut-sch-005",
    name_en: "Agricultural Drone Subsidy Scheme (Smart Agro Drone for Spraying)",
    name_gu: "એગ્રીકલ્ચર ડ્રોન સહાય યોજના (જંતુનાશક અને ખાતર છંટકાવ)",
    name_hi: "कृषि ड्रोन सब्सिडी योजना",
    category: "Hi-Tech Agriculture",
    category_gu: "હાઈ-ટેક કૃષિ",
    subsidy_percentage: "40% to 75%",
    max_subsidy_amount: 500000,
    subsidy_breakdown: {
      individual_small_farmer: "50% of cost up to ₹5,00,000 for purchasing agriculture drone",
      fpo_custom_hiring: "75% of cost up to ₹7,50,000 for FPO/Cooperative societies",
      spraying_rental_subsidy: "₹500 per acre (up to ₹2,500/year for 5 acres) for hiring drone spraying services"
    },
    eligibility_criteria_en: [
      "Individual farmer, Agri-graduates, Women SHGs, or Farmer Producer Organizations (FPOs).",
      "Drone pilot must hold DGCA certified remote pilot license (or engage certified pilot service).",
      "Drone must be type-certified by DGCA for agricultural spraying."
    ],
    eligibility_criteria_gu: [
      "વ્યક્તિગત ખેડૂતો, કૃષિ સ્નાતકો, મહિલા સ્વસહાય જૂથો અથવા ખેડૂત ઉત્પાદક સંગઠનો (FPOs).",
      "DGCA પ્રમાણિત ડ્રોન પાયલોટ લાયસન્સ અથવા અધિકૃત સર્વિસ પ્રોવાઈડર.",
      "ડ્રોન ભારત સરકારના DGCA દ્વારા કૃષિ છંટકાવ માટે પ્રમાણિત હોવું જોઈએ."
    ],
    required_documents_en: [
      "Aadhaar Card",
      "7/12 & 8-A Land Records",
      "DGCA Remote Pilot License / Service Provider Agreement",
      "Bank Account details"
    ],
    required_documents_gu: [
      "આધાર કાર્ડ",
      "૭/૧૨ અને ૮-અ ના ઉતારા",
      "DGCA માન્ય પાઈલટ પ્રમાણપત્ર / એગ્રીમેન્ટ",
      "બેંક પાસબુક નકલ"
    ],
    application_url: "https://ikhedut.gujarat.gov.in",
    application_period: "Special window announced quarterly",
    tags: ["drone", "hi-tech", "spraying", "pesticide", "ડ્રોન", "છંટકાવ", "ટેકનોલોજી", "ખેતીવાડી"]
  },
  {
    id: "ikhedut-sch-006",
    name_en: "Smart Phone Subsidy Scheme for Farmers",
    name_gu: "સ્માર્ટફોન સહાય યોજના (ડિજિટલ ખેડૂત)",
    name_hi: "स्मार्टफोन खरीद सहायता योजना",
    category: "Digital Agriculture",
    category_gu: "ડિજિટલ સેવાઓ",
    subsidy_percentage: "10% to 40%",
    max_subsidy_amount: 6000,
    subsidy_breakdown: {
      all_farmers: "Up to 40% of smartphone purchase cost or ₹6,000 (whichever is lower) for purchasing 4G/5G smartphone up to ₹15,000 value"
    },
    eligibility_criteria_en: [
      "Landholding farmer of Gujarat state with 7/12 land record.",
      "One smartphone subsidy per land account.",
      "Purchased phone must be equipped with camera, internet access, and ability to run iKhedut / weather apps."
    ],
    eligibility_criteria_gu: [
      "ગુજરાતના જમીન ધારક ખેડૂત (૭/૧૨ ખાતાધારક).",
      "એક ખાતા દીઠ એક જ સ્માર્ટફોન માટે સહાય મળવાપાત્ર છે.",
      "ફોન 4G/5G ઈન્ટરનેટ ક્ષમતા ધરાવતો અને જીએસટી બિલ વાળો હોવો જોઈએ."
    ],
    required_documents_en: [
      "Aadhaar Card",
      "7/12 & 8-A Land Record",
      "Original GST Tax Invoice showing Mobile Model and IMEI Number",
      "Bank Passbook / Cancelled Cheque",
      "Cancelled IMEI barcode slip from phone box"
    ],
    required_documents_gu: [
      "આધાર કાર્ડ",
      "૭/૧૨ અને ૮-અ ના ઉતારા",
      "મોબાઇલ મોડેલ અને IMEI નંબર દર્શાવતું અસલ જીએસટી બિલ",
      "બેંક પાસબુક / રદ કરેલ ચેક",
      "મોબાઈલ બોક્સ પરનો બારકોડ સ્લીપ"
    ],
    application_url: "https://ikhedut.gujarat.gov.in",
    application_period: "Seasonal window (May - August)",
    tags: ["smartphone", "digital", "mobile", "સ્માર્ટફોન", "મોબાઈલ", "ડિજિટલ ખેતી", "ખેતીવાડી"]
  },
  {
    id: "ikhedut-sch-007",
    name_en: "Solar Pump Scheme (PM-KUSUM Component-B)",
    name_gu: "સોલાર કૃષિ પંપ યોજના (પીએમ-કુસુમ યોજના)",
    name_hi: "सोलर पंप योजना (पीएम-कुसुम)",
    category: "Solar Energy & Irrigation",
    category_gu: "સૌર ઊર્જા અને સિંચાઈ",
    subsidy_percentage: "60% to 75%",
    max_subsidy_amount: 150000,
    subsidy_breakdown: {
      general: "60% combined subsidy (30% Central + 30% State), 40% farmer contribution",
      sc_st: "75% combined subsidy for SC/ST and dark zone farmers"
    },
    eligibility_criteria_en: [
      "Farmers without grid electricity agricultural connection or seeking daylight solar power.",
      "Water source (well/borewell) depth suitable for 3 HP, 5 HP, or 7.5 HP solar surface/submersible pump."
    ],
    eligibility_criteria_gu: [
      "ખેતી માટે વીજળી કનેક્શન ન હોય અથવા દિવસના સમયે સૌર ઊર્જાથી પિયત કરવા માંગતા ખેડૂતો.",
      "કૂવો અથવા બોરવેલ ઉપલબ્ધ હોવો જરૂરી (3 HP, 5 HP અથવા 7.5 HP ક્ષમતા માટે)."
    ],
    required_documents_en: [
      "Aadhaar Card",
      "7/12, 8-A and Water Availability Certificate from Talati",
      "Bank Passbook",
      "Self-undertaking regarding no existing grid connection"
    ],
    required_documents_gu: [
      "આધાર કાર્ડ",
      "૭/૧૨, ૮-અ અને તલાટીનો પાણી પ્રાપ્તિનો દાખલો",
      "બેંક પાસબુક",
      "વીજ જોડાણ ન હોવા અંગેનું બાંયધરી પત્રક"
    ],
    application_url: "https://ikhedut.gujarat.gov.in",
    application_period: "Annual target allocation basis",
    tags: ["solar", "kusum", "pump", "irrigation", "સોલાર પંપ", "સૂર્ય ઊર્જા", "કુસુમ", "સિંચાઈ"]
  },
  {
    id: "ikhedut-sch-008",
    name_en: "Farm Storage Structure / Godown Sahay Yojana",
    name_gu: "ખેત સંગ્રહ સંરચના સહાય યોજના (ખેતર પર ગોડાઉન)",
    name_hi: "खेत गोदाम निर्माण सहायता योजना",
    category: "Post-Harvest Infrastructure",
    category_gu: "કાપણી પછીનું ઇન્ફ્રાસ્ટ્રક્ચર",
    subsidy_percentage: "50%",
    max_subsidy_amount: 75000,
    subsidy_breakdown: {
      all_farmers: "50% of the cost up to ₹75,000 for construction of minimum 330 sq. ft. on-farm storage godown"
    },
    eligibility_criteria_en: [
      "Farmer having minimum 2 acres of land to construct storage facility for agricultural produce.",
      "Godown must be constructed as per structural specifications (paved floor, RCC roof/sheet, pest-proof)."
    ],
    eligibility_criteria_gu: [
      "ઓછામાં ઓછી ૨ એકર ખેતીની જમીન ધરાવતા ખેડૂત.",
      "અનાજ અને પાક સંગ્રહ માટે નિયત ૩૩૦ ચોરસ ફૂટનું પાકું ગોડાઉન બનાવવું ફરજિયાત."
    ],
    required_documents_en: [
      "Aadhaar Card",
      "7/12 & 8-A Records",
      "Site Layout Plan / Engineer Estimate",
      "Bank Passbook",
      "Geo-tagged inspection photos"
    ],
    required_documents_gu: [
      "આધાર કાર્ડ",
      "૭/૧૨ અને ૮-અ ઉતારા",
      "સાઈટ લેઆઉટ નકશો / એન્જિનિયર એસ્ટીમેટ",
      "બેંક પાસબુક",
      "કામ પૂર્ણાહુતિના ફોટોગ્રાફ્સ"
    ],
    application_url: "https://ikhedut.gujarat.gov.in",
    application_period: "May - October",
    tags: ["storage", "godown", "warehouse", "post harvest", "ગોડાઉન", "સંગ્રહ", "માળખું", "ખેતીવાડી"]
  },
  {
    id: "ikhedut-sch-009",
    name_en: "Greenhouse and Shade Net House Subsidy (Horticulture Department)",
    name_gu: "ગ્રીનહાઉસ અને શેડનેટ હાઉસ સહાય યોજના (બાગાયત વિભાગ)",
    name_hi: "ग्रीनहाउस एवं शेडनेट हाउस सब्सिडी योजना",
    category: "Horticulture",
    category_gu: "બાગાયતી યોજનાઓ",
    subsidy_percentage: "50% to 65%",
    max_subsidy_amount: 2000000,
    subsidy_breakdown: {
      general: "50% of unit cost (up to ₹20,00,000 for naturally ventilated polyhouse / Net house)",
      sc_st: "65% of unit cost in scheduled / tribal regions"
    },
    eligibility_criteria_en: [
      "Horticulture farmers having assured irrigation and suitable land.",
      "Structure must follow NHM (National Horticulture Mission) technical specifications.",
      "Minimum area 1,000 sq. meters up to 4,000 sq. meters."
    ],
    eligibility_criteria_gu: [
      "ગુજરાતના બાગાયતી પાક લેતા ખેડૂતો કે જેમની પાસે સિંચાઈની પૂરતી સુવિધા છે.",
      "રાષ્ટ્રીય બાગાયત મિશન (NHM) ના માપદંડ મુજબ પોલિહાઉસ/શેડનેટ બનાવવું ફરજિયાત.",
      "ન્યૂનતમ ૧,૦૦૦ ચોરસ મીટર થી ૪,૦૦૦ ચોરસ મીટર વિસ્તાર માટે મળવાપાત્ર."
    ],
    required_documents_en: [
      "Aadhaar Card",
      "7/12 & 8-A Land Records",
      "Approved vendor engineering layout drawing & cost estimate",
      "Bank Account details"
    ],
    required_documents_gu: [
      "આધાર કાર્ડ",
      "૭/૧૨ અને ૮-અ ના ઉતારા",
      "માન્ય કંપનીનો ટેકનિકલ નકશો અને ખર્ચ એસ્ટીમેટ",
      "બેંક પાસબુક નકલ"
    ],
    application_url: "https://ikhedut.gujarat.gov.in",
    application_period: "Portal open round the year",
    tags: ["greenhouse", "shadenet", "horticulture", "polyhouse", "ગ્રીનહાઉસ", "શેડનેટ", "બાગાયત", "પોલિહાઉસ"]
  },
  {
    id: "ikhedut-sch-010",
    name_en: "Plastic Mulching & Fruit Plantation Sahay",
    name_gu: "પ્લાસ્ટિક મલ્ચિંગ અને ફળપાક વાવેતર સહાય",
    name_hi: "प्लास्टिक मल्चिंग एवं फल पौधरोपण सहायता",
    category: "Horticulture",
    category_gu: "બાગાયતી યોજનાઓ",
    subsidy_percentage: "50%",
    max_subsidy_amount: 16000,
    subsidy_breakdown: {
      all_farmers: "50% of cost up to ₹16,000 per hectare for plastic mulching (max 2 ha per beneficiary)"
    },
    eligibility_criteria_en: [
      "Farmers growing vegetable or fruit crops with drip irrigation system installed.",
      "Must purchase BIS certified plastic mulch films from authorized dealers."
    ],
    eligibility_criteria_gu: [
      "શાકભાજી અથવા બાગાયતી ફળપાકોમાં ટપક સિંચાઈ સાથે મલ્ચિંગ કરતા ખેડૂતો.",
      "BIS પ્રમાણિત પ્લાસ્ટિક ફિલ્મ ખરીદવી ફરજિયાત."
    ],
    required_documents_en: [
      "Aadhaar Card",
      "7/12, 8-A Records",
      "Drip Irrigation Certificate (GGRC)",
      "GST Invoice with BIS Batch number"
    ],
    required_documents_gu: [
      "આધાર કાર્ડ",
      "૭/૧૨ અને ૮-અ ના ઉતારા",
      "GGRC ટપક પિયત પ્રમાણપત્ર",
      "BIS નંબર વાળું જીએસટી બિલ"
    ],
    application_url: "https://ikhedut.gujarat.gov.in",
    application_period: "June - November",
    tags: ["mulching", "horticulture", "vegetables", "fruits", "મલ્ચિંગ", "પ્લાસ્ટિક", "ફળપાક", "બાગાયત"]
  },
  {
    id: "ikhedut-sch-011",
    name_en: "Milch Cattle Purchase & Modern Cattle Shed Scheme",
    name_gu: "દૂધાળા પશુ ખરીદી અને કેટલ શેડ સહાય યોજના (પશુપાલન)",
    name_hi: "दुधारू पशु खरीद एवं कैटल शेड योजना",
    category: "Animal Husbandry",
    category_gu: "પશુપાલન અને ડેરી",
    subsidy_percentage: "25% to 50%",
    max_subsidy_amount: 45000,
    subsidy_breakdown: {
      general: "25% to 50% subsidy for purchase of 1 to 2 milch cows/buffaloes (up to ₹30,000 - ₹45,000)",
      sc_st: "50% subsidy for SC/ST livestock owners"
    },
    eligibility_criteria_en: [
      "Livestock farmers and rural milk producers associated with dairy cooperative societies.",
      "Animals must be vaccinated, ear-tagged, and insured."
    ],
    eligibility_criteria_gu: [
      "ડેરી સહકારી મંડળી સાથે જોડાયેલા પશુપાલકો અને દૂધ ઉત્પાદકો.",
      "પશુનું ઈયર-ટેગિંગ (Ear Tag) અને વીમો કરાવવો ફરજિયાત."
    ],
    required_documents_en: [
      "Aadhaar Card",
      "Dairy Member Certificate / Passbook",
      "Veterinary Health Certificate & Tag Receipt",
      "Bank Account details"
    ],
    required_documents_gu: [
      "આધાર કાર્ડ",
      "દૂધ મંડળી સભ્યપદ કાર્ડ",
      "પશુ આરોગ્ય પ્રમાણપત્ર અને ટેગ રસીદ",
      "બેંક પાસબુક"
    ],
    application_url: "https://ikhedut.gujarat.gov.in",
    application_period: "July - December",
    tags: ["dairy", "cattle", "cow", "buffalo", "પશુપાલન", "દૂધાળા પશુ", "ભેંસ", "ગાય", "ડેરી"]
  },
  {
    id: "ikhedut-sch-012",
    name_en: "Fisheries Boat Modernization & Aquaculture Pond Scheme",
    name_gu: "મત્સ્યપાલન બોટ આધુનિકીકરણ અને ફિશ પોન્ડ સહાય (મત્સ્યોદ્યોગ)",
    name_hi: "मत्स्य पालन नाव आधुनिकीकरण एवं तालाब योजना",
    category: "Fisheries",
    category_gu: "મત્સ્યપાલન યોજનાઓ",
    subsidy_percentage: "40% to 60%",
    max_subsidy_amount: 300000,
    subsidy_breakdown: {
      general: "40% of unit cost for fishing equipment / insulated fish boxes / pond excavation",
      sc_st_women: "60% of unit cost (up to ₹3,00,000) for SC/ST and women fisherfolk"
    },
    eligibility_criteria_en: [
      "Registered fishermen of Gujarat holding valid biometric card or inland fish pond farmers.",
      "Approval from Commissioner of Fisheries, Gujarat."
    ],
    eligibility_criteria_gu: [
      "ગુજરાતના નોંધાયેલા માછીમારો (બાયોમેટ્રિક કાર્ડ ધારક) અથવા અંતર્દેશીય મત્સ્યપાલન કરતા ખેડૂતો.",
      "મત્સ્યોદ્યોગ કમિશનરની કચેરીની મંજૂરી જરૂરી."
    ],
    required_documents_en: [
      "Fisherman Biometric ID Card",
      "Aadhaar Card & Bank Details",
      "Boat Registration / Land lease agreement for fish pond",
      "Quotation of machinery / nets"
    ],
    required_documents_gu: [
      "માછીમાર બાયોમેટ્રિક ઓળખકાર્ડ",
      "આધાર કાર્ડ અને બેંક પાસબુક",
      "બોટ નોંધણી નંબર અથવા તળાવ લીઝ કરાર",
      "સાધનોનું ક્વોટેશન"
    ],
    application_url: "https://ikhedut.gujarat.gov.in",
    application_period: "Portal active round the year",
    tags: ["fisheries", "boat", "fish pond", "aquaculture", "મત્સ્યપાલન", "બોટ", "માછલી", "ઝીંગા"]
  },
  {
    id: "ikhedut-sch-013",
    name_en: "Power Tiller and Rotavator Farm Implements Sahay",
    name_gu: "પાવર ટીલર અને રોટાવેટર ખેત ઓજાર સહાય યોજના",
    name_hi: "पावर टिलर एवं रोटावेटर कृषि यंत्र सहायता",
    category: "Agrimachinery",
    category_gu: "ખેતીવાડી યાંત્રિકીકરણ",
    subsidy_percentage: "40% to 50%",
    max_subsidy_amount: 45000,
    subsidy_breakdown: {
      general: "40% of equipment cost up to ₹35,000",
      small_sc_st_women: "50% of cost up to ₹45,000 for Small/Marginal/SC/ST/Women farmers"
    },
    eligibility_criteria_en: [
      "Landholding farmers of Gujarat.",
      "Equipment must be tested and approved by designated testing centers (FMTTI)."
    ],
    eligibility_criteria_gu: [
      "ગુજરાતના ખેતીની જમીન ધરાવતા ખેડૂતો.",
      "સરકાર માન્ય ટેસ્ટિંગ સેન્ટર (FMTTI) પાસ થયેલા ઓજારો ખરીદવા જરૂરી."
    ],
    required_documents_en: [
      "Aadhaar Card",
      "7/12 & 8-A Records",
      "Authorized Dealer GST Quotation",
      "Bank Passbook"
    ],
    required_documents_gu: [
      "આધાર કાર્ડ",
      "૭/૧૨ અને ૮-અ ઉતારા",
      "ડીલરનું જીએસટી કોટેશન",
      "બેંક પાસબુક"
    ],
    application_url: "https://ikhedut.gujarat.gov.in",
    application_period: "April - December",
    tags: ["rotavator", "power tiller", "machinery", "tools", "રોટાવેટર", "પાવર ટીલર", "ઓજાર", "ખેતીવાડી"]
  },
  {
    id: "ikhedut-sch-014",
    name_en: "Khet Talavadi Farm Pond & Rainwater Harvesting Scheme",
    name_gu: "ખેત તલાવડી જળ સંચય સહાય યોજના (સિંચાઈ સુવિધા)",
    name_hi: "खेत तालाब निर्माण जल संचयन योजना",
    category: "Irrigation & Water Conservation",
    category_gu: "જળ સંચય અને સિંચાઈ",
    subsidy_percentage: "100% (Up to Fixed Amount)",
    max_subsidy_amount: 50000,
    subsidy_breakdown: {
      all_farmers: "Direct financial assistance of ₹20,000 to ₹50,000 (depending on pond cubic meter capacity) for excavation of on-farm pond with plastic lining"
    },
    eligibility_criteria_en: [
      "Farmers having land suitable for rain runoff harvesting.",
      "Minimum pond dimensions must meet state watershed guidelines."
    ],
    eligibility_criteria_gu: [
      "વરસાદી પાણીના સંગ્રહ માટે અનુકૂળ જમીન ધરાવતા ખેડૂતો.",
      "નિયત માપદંડ મુજબ ખેત તલાવડીનું ખોદાણ કરવું જરૂરી."
    ],
    required_documents_en: [
      "Aadhaar Card",
      "7/12 and 8-A Records",
      "Gram Sevak / Talati site inspection report",
      "Bank Passbook"
    ],
    required_documents_gu: [
      "આધાર કાર્ડ",
      "૭/૧૨ અને ૮-અ ઉતારા",
      "ગ્રામ સેવકનો સ્થળ તપાસ રિપોર્ટ",
      "બેંક પાસબુક"
    ],
    application_url: "https://ikhedut.gujarat.gov.in",
    application_period: "Pre-Monsoon (March - June)",
    tags: ["farm pond", "water harvesting", "irrigation", "talavadi", "ખેત તલાવડી", "જળ સંચય", "સિંચાઈ"]
  }
];

export const GUJARAT_DISTRICTS = [
  "Ahmedabad (અમદાવાદ)",
  "Amreli (અમરેલી)",
  "Anand (આણંદ)",
  "Aravalli (અરવલ્લી)",
  "Banaskantha (બનાસકાંઠા)",
  "Bharuch (ભરૂચ)",
  "Bhavnagar (ભાવનગર)",
  "Botad (બોટાદ)",
  "Chhota Udepur (છોટા ઉદેપુર)",
  "Dahod (દાહોદ)",
  "Dang (ડાંગ)",
  "Devbhoomi Dwarka (દેવભૂમિ દ્વારકા)",
  "Gandhinagar (ગાંધીનગર)",
  "Gir Somnath (ગીર સોમનાથ)",
  "Jamnagar (જામનગર)",
  "Junagadh (જૂનાગઢ)",
  "Kheda (ખેડા)",
  "Kutch (કચ્છ)",
  "Mahisagar (મહીસાગર)",
  "Mehsana (મહેસાણા)",
  "Morbi (મોરબી)",
  "Narmada (નર્મદા)",
  "Navsari (નવસારી)",
  "Panchmahal (પંચમહાલ)",
  "Patan (પાટણ)",
  "Porbandar (પોરબંદર)",
  "Rajkot (રાજકોટ)",
  "Sabarkantha (સાબરકાંઠા)",
  "Surat (સુરત)",
  "Surendranagar (સુરેન્દ્રનગર)",
  "Tapi (તાપી)",
  "Vadodara (વડોદરા)",
  "Valsad (વલસાડ)"
];

export const COMMON_CROPS = [
  { en: "Cotton (કપાસ)", gu: "કપાસ", hi: "कपास" },
  { en: "Groundnut (મગફળી)", gu: "મગફળી", hi: "मूंगफली" },
  { en: "Wheat (ઘઉં)", gu: "ઘઉં", hi: "गेहूं" },
  { en: "Cumin / Jeera (જીરું)", gu: "જીરું", hi: "जीरा" },
  { en: "Castor / Divela (દિવેલા)", gu: "દિવેલા", hi: "अरंडी" },
  { en: "Paddy / Rice (ડાંગર)", gu: "ડાંગર", hi: "धान" },
  { en: "Mango / Kesar (કેરી)", gu: "કેસર કેરી", hi: "आम" },
  { en: "Mustard / Rai (રાયડો)", gu: "રાયડો", hi: "सरसों" },
  { en: "Sugarcane (શેરડી)", gu: "શેરડી", hi: "गन्ना" }
];

export function getSchemesForCategory(categoryId: string): Scheme[] {
  if (!categoryId || categoryId === 'all') {
    return IKHEDUT_SCHEMES;
  }
  const cat = categoryId.toLowerCase();
  if (cat === 'agriculture' || cat === 'agrimachinery' || cat === 'ખેતીવાડી') {
    return IKHEDUT_SCHEMES.filter(s => 
      s.category === 'Agrimachinery' || 
      s.category === 'Crop Protection' || 
      s.category === 'Hi-Tech Agriculture' || 
      s.category === 'Digital Agriculture' || 
      s.category === 'Post-Harvest Infrastructure' ||
      s.tags.includes('ખેતીવાડી') ||
      s.tags.includes('tractor') ||
      s.tags.includes('fencing')
    );
  }
  if (cat === 'horticulture' || cat === 'bagayat' || cat === 'બાગાયત' || cat === 'બાગાયતી') {
    return IKHEDUT_SCHEMES.filter(s => 
      s.category === 'Horticulture' || 
      s.tags.includes('horticulture') ||
      s.tags.includes('બાગાયત') ||
      s.tags.includes('greenhouse')
    );
  }
  if (cat === 'animal_husbandry' || cat === 'pashupalan' || cat === 'પશુપાલન' || cat === 'dairy') {
    return IKHEDUT_SCHEMES.filter(s => 
      s.category === 'Animal Husbandry' || 
      s.category === 'Natural Farming' ||
      s.tags.includes('પશુપાલન') ||
      s.tags.includes('cow') ||
      s.tags.includes('dairy')
    );
  }
  if (cat === 'irrigation_solar' || cat === 'sinchai' || cat === 'સિંચાઈ' || cat === 'solar' || cat === 'સૌર') {
    return IKHEDUT_SCHEMES.filter(s => 
      s.category === 'Irrigation' || 
      s.category === 'Solar Energy & Irrigation' || 
      s.category === 'Irrigation & Water Conservation' ||
      s.tags.includes('સિંચાઈ') ||
      s.tags.includes('solar') ||
      s.tags.includes('drip')
    );
  }
  if (cat === 'fisheries' || cat === 'matsyapalan' || cat === 'મત્સ્યપાલન') {
    return IKHEDUT_SCHEMES.filter(s => 
      s.category === 'Fisheries' || 
      s.tags.includes('fisheries') ||
      s.tags.includes('મત્સ્યપાલન')
    );
  }
  if (cat === 'natural_farming' || cat === 'prakrutik' || cat === 'પ્રાકૃતિક') {
    return IKHEDUT_SCHEMES.filter(s => 
      s.category === 'Natural Farming' || 
      s.tags.includes('natural farming') ||
      s.tags.includes('પ્રાકૃતિક ખેતી')
    );
  }
  return IKHEDUT_SCHEMES.filter(s => 
    s.category.toLowerCase().includes(cat) || 
    s.tags.some(t => t.toLowerCase().includes(cat))
  );
}
