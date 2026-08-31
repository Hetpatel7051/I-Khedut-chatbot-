export type Language = 'gu' | 'hi' | 'en';

export interface SchemeSubsidyBreakdown {
  general?: string;
  small_marginal?: string;
  sc_st?: string;
  women?: string;
  group_farming?: string;
  per_month?: string;
  natural_farming_kit?: string;
  individual_small_farmer?: string;
  fpo_custom_hiring?: string;
  spraying_rental_subsidy?: string;
  all_farmers?: string;
  [key: string]: string | undefined;
}

export interface Scheme {
  id: string;
  name_en: string;
  name_gu: string;
  name_hi: string;
  category: string;
  category_gu: string;
  subsidy_percentage: string;
  max_subsidy_amount: number;
  subsidy_breakdown: SchemeSubsidyBreakdown;
  eligibility_criteria_en: string[];
  eligibility_criteria_gu: string[];
  required_documents_en: string[];
  required_documents_gu: string[];
  application_url: string;
  application_period: string;
  tags: string[];
}

export interface FarmerProfile {
  id?: string;
  name: string;
  phone?: string;
  district: string;
  taluka?: string;
  village?: string;
  land_size_acres: number;
  land_unit: 'acres' | 'vigha' | 'hectares';
  caste_category: 'General' | 'OBC' | 'SC' | 'ST';
  farmer_type: 'small' | 'marginal' | 'large' | 'women';
  primary_crops: string[];
  has_water_source: boolean;
  has_tractor: boolean;
  has_desi_cow: boolean;
}

export interface ApplicationStatusData {
  application_id: string;
  farmer_name: string;
  scheme_name: string;
  scheme_name_gu: string;
  status: string;
  status_gu: string;
  applied_date: string;
  last_updated: string;
  stage: number; // 1: Submitted, 2: Document Verified by Gram Sevak, 3: Approved by Taluka Officer, 4: DBT Transfer
  total_stages: number;
  disbursement_amount?: number;
  district: string;
  remarks?: string;
}

export interface MarketPriceData {
  id?: string;
  market_name?: string;
  market_name_en?: string;
  market_name_gu: string;
  commodity?: string;
  commodity_en?: string;
  commodity_gu: string;
  variety_gu?: string;
  variety_en?: string;
  district_gu?: string;
  district_en?: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  price_per_quintal?: number;
  unit?: string;
  unit_gu?: string;
  unit_en?: string;
  arrival_tonnes?: number;
  date: string;
  price_trend?: 'up' | 'down' | 'stable';
  trend_percentage?: number;
  category?: string;
  category_gu?: string;
  category_en?: string;
  advisory_gu?: string;
  advisory_en?: string;
  msp_rate?: number;
}

export interface WeatherData {
  location: string;
  location_gu: string;
  temperature_c: number;
  humidity_percent: number;
  wind_speed_kmh: number;
  rain_probability_percent: number;
  forecast_summary: string;
  forecast_summary_gu: string;
  advisory_gu: string;
}

export interface PreFilledFormData {
  application_ref: string;
  scheme_id: string;
  scheme_name: string;
  scheme_name_gu: string;
  farmer_name: string;
  aadhaar_number: string;
  mobile_number?: string;
  land_size_acres: number;
  district: string;
  taluka?: string;
  village?: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  caste_category: string;
  created_at: string;
}

export interface DocumentVerificationResult {
  is_valid: boolean;
  document_type: '7/12_satbara' | '8-A_khatauni' | 'aadhaar_card' | 'bank_passbook' | 'dealer_quotation' | 'unknown';
  document_name_gu: string;
  clarity: 'clear' | 'blurry' | 'unreadable';
  extracted_details?: {
    survey_number?: string;
    khata_number?: string;
    farmer_name?: string;
    district_or_taluka?: string;
    aadhaar_masked?: string;
  };
  feedback_gu: string;
  feedback_en: string;
}

export interface SchemeCategoryInfo {
  id: string;
  name_en: string;
  name_gu: string;
  name_hi: string;
  icon: string;
  description_gu: string;
  description_en: string;
  tags_gu: string[];
  color: string;
  scheme_count?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  language: Language;
  matchedSchemes?: Scheme[];
  audioBase64?: string;
  audioDurationSeconds?: number;
  citations?: string[];
  isVoiceInput?: boolean;
  intent?: string;
  imageDataUrl?: string;
  imageMimeType?: string;
  showCategoryChips?: boolean;
  showCategoryPicker?: boolean;
  categoriesList?: SchemeCategoryInfo[];
  selectedCategoryId?: string;
  applicationStatus?: ApplicationStatusData;
  marketPrices?: MarketPriceData[];
  weatherData?: WeatherData;
  prefilledForm?: PreFilledFormData;
  verificationResult?: DocumentVerificationResult;
  subsidyEstimate?: {
    schemeName: string;
    estimatedAmount: number;
    subsidyPercentage: string;
    explanation: string;
  };
}

export interface ChatRequestPayload {
  message: string;
  language: Language;
  farmer_id?: string;
  farmer_profile?: FarmerProfile;
  image_base64?: string;
  image_mime_type?: string;
  audio_base64?: string;
  audio_mime_type?: string;
  history?: { sender: 'user' | 'assistant'; content: string }[];
}

export interface ChatResponsePayload {
  response_text: string;
  language: Language;
  matched_schemes: Scheme[];
  audio_base64?: string;
  citations: string[];
  intent: string;
  show_category_chips?: boolean;
  show_category_picker?: boolean;
  categories_list?: SchemeCategoryInfo[];
  selected_category_id?: string;
  application_status?: ApplicationStatusData;
  market_prices?: MarketPriceData[];
  weather_data?: WeatherData;
  prefilled_form?: PreFilledFormData;
  verification_result?: DocumentVerificationResult;
  subsidy_estimate?: {
    schemeName: string;
    estimatedAmount: number;
    subsidyPercentage: string;
    explanation: string;
  };
}
