import React, { useState } from "react";
import {
  X,
  TrendingUp,
  TrendingDown,
  Search,
  MapPin,
  Sparkles,
  Filter,
  Scale,
  CheckCircle2,
  Calendar,
  Layers,
  Wheat,
  Info,
} from "lucide-react";
import { Language } from "../types";

interface MarketPricesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAskAboutCrop?: (cropName: string) => void;
}

export const MarketPricesModal: React.FC<MarketPricesModalProps> = ({
  isOpen,
  onClose,
  language,
  onAskAboutCrop,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    {
      id: "all",
      label_gu: "🌾 તમામ પાક (All Crops)",
      label_en: "All Crops",
      icon: "🌾",
    },
    {
      id: "cereal",
      label_gu: "🌾 ધાન્ય (Wheat, Juvar, Bajari, Rice)",
      label_en: "Grains & Cereals",
      icon: "🍞",
    },
    {
      id: "oilseeds",
      label_gu: "🌱 તેલીબિયાં (Mustard, Divela, Groundnut)",
      label_en: "Oilseeds",
      icon: "🌻",
    },
    {
      id: "vegetables",
      label_gu: "🥦 શાકભાજી (Potato, Onion, Tomato, Chilli)",
      label_en: "Vegetables",
      icon: "🥕",
    },
    {
      id: "cash_crops",
      label_gu: "🧵 રોકડિયા (Cotton / કપાસ)",
      label_en: "Cash Crops",
      icon: "🌱",
    },
    {
      id: "spices",
      label_gu: "🌶️ મસાલા (Jeera / લસણ / Cumin)",
      label_en: "Spices",
      icon: "🌿",
    },
  ];

  const districts = [
    {
      id: "all",
      name_gu: "📍 તમામ જિલ્લાઓ (All Mandis)",
      name_en: "All Locations",
    },
    { id: "ગોંડલ", name_gu: "ગોંડલ (Gondal APMC)", name_en: "Gondal" },
    { id: "રાજકોટ", name_gu: "રાજકોટ (Rajkot APMC)", name_en: "Rajkot" },
    { id: "ઉંઝા", name_gu: "ઉંઝા (Unjha APMC)", name_en: "Unjha" },
    { id: "મહેસાણા", name_gu: "મહેસાણા (Mehsana)", name_en: "Mehsana" },
    { id: "અમદાવાદ", name_gu: "અમદાવાદ (Ahmedabad)", name_en: "Ahmedabad" },
    { id: "સુરત", name_gu: "સુરત (Surat)", name_en: "Surat" },
    { id: "જુનાગઢ", name_gu: "જુનાગઢ (Junagadh)", name_en: "Junagadh" },
    { id: "અમરેલી", name_gu: "અમરેલી (Amreli)", name_en: "Amreli" },
    {
      id: "બનાસકાંઠા",
      name_gu: "ડીસા - બનાસકાંઠા (Deesa)",
      name_en: "Deesa / Banaskantha",
    },
    { id: "ભાવનગર", name_gu: "મહુવા - ભાવનગર (Mahuwa)", name_en: "Mahuwa" },
  ];

  const filteredPrices = [];

  if (!isOpen) return null;

  return (
    <div
      id="market-prices-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-emerald-850 via-emerald-800 to-teal-900 px-5 py-4 text-white flex items-center justify-between gap-3 border-b border-emerald-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>
                  {language === "gu"
                    ? "ગુજરાત APMC બજાર ભાવ"
                    : "Gujarat APMC Market Prices"}
                </span>
              </h3>
              <p className="text-xs text-emerald-200">
                {language === "gu"
                  ? "લાઇવ APMC ભાવ સેવા હાલમાં જોડાયેલ નથી"
                  : "Live APMC price feed is not currently connected"}
              </p>
            </div>
          </div>

          <button
            id="close-mandi-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="બંધ કરો"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="hidden">
          {/* Location / District Selector Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 shrink-0 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {language === "gu" ? "વિસ્તાર/જિલ્લો પસંદ કરો:" : "Select Area:"}
            </span>
            {districts.map((dist) => (
              <button
                key={dist.id}
                type="button"
                onClick={() => setSelectedDistrict(dist.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer ${
                  selectedDistrict === dist.id
                    ? "bg-emerald-800 text-white font-bold shadow-xs"
                    : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100"
                }`}
              >
                <span>{language === "gu" ? dist.name_gu : dist.name_en}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="mandi-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === "gu"
                  ? "પાક અથવા માર્કેટ શોધો (દા.ત. ઘઉં, જુવાર, બાજરી, કપાસ, જીરું, ગોંડલ)..."
                  : "Search crop or mandi (e.g. Wheat, Juvar, Bajra, Cotton, Gondal)..."
              }
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
              >
                સાફ કરો
              </button>
            )}
          </div>

          {/* Category Chips Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100"
                }`}
              >
                <span>{language === "gu" ? cat.label_gu : cat.label_en}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Crops List Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pb-1">
            <span>
              {language === "gu"
                ? "હાલના બજાર ભાવ ઉપલબ્ધ નથી"
                : "Current market prices unavailable"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {language === "gu"
                ? "અધિકૃત ડેટા ફીડની રાહમાં"
                : "Awaiting an authoritative data feed"}
            </span>
          </div>

          {filteredPrices.length === 0 ? (
            <div className="py-12 text-center text-stone-500 dark:text-stone-400 space-y-2">
              <Info className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-sm font-semibold">
                {language === "gu"
                  ? "લાઇવ બજાર ભાવ મેળવી શકાય તેમ નથી."
                  : "Live market prices cannot be retrieved right now."}
              </p>
              <p className="text-xs">
                {language === "gu"
                  ? "સંગ્રહિત નમૂના ભાવ આજના ભાવ તરીકે બતાવવામાં આવતા નથી. સંબંધિત APMCનો તાજો બુલેટિન તપાસો."
                  : "Stored sample prices are not shown as current quotes. Check the latest bulletin from the relevant APMC."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredPrices.map((crop) => (
                <div
                  key={crop.id}
                  id={`crop-card-${crop.id}`}
                  className="p-3.5 rounded-xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Crop Name + Category Badge */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <span>
                            {language === "gu"
                              ? crop.commodity_gu
                              : crop.commodity_en}
                          </span>
                          {crop.price_trend === "up" ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                              <TrendingUp className="w-2.5 h-2.5" /> +
                              {crop.trend_percentage}%
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.2 rounded">
                              સ્થિર
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          {language === "gu"
                            ? crop.variety_gu
                            : crop.variety_en}
                        </p>
                      </div>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                        {language === "gu"
                          ? crop.category_gu.split(" ")[0]
                          : crop.category_en}
                      </span>
                    </div>

                    {/* Mandi & Location */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 mb-2.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>
                        {language === "gu"
                          ? crop.market_name_gu
                          : crop.market_name_en}
                      </span>
                    </div>

                    {/* Price Rates Highlight Box */}
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between mb-2">
                      <div>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 block">
                          {language === "gu"
                            ? "મણે ભાવ (૨૦ કિગ્રા)"
                            : "Price per 20kg (1 Man)"}
                        </span>
                        <span className="text-base font-extrabold text-emerald-800 dark:text-emerald-300 font-mono">
                          ₹{crop.min_price} - ₹{crop.max_price}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 block">
                          {language === "gu"
                            ? "સરેરાશ / ક્વિન્ટલ"
                            : "Modal / Quintal"}
                        </span>
                        <span className="text-xs font-bold text-stone-800 dark:text-stone-200 font-mono">
                          ₹{crop.modal_price} (₹{crop.price_per_quintal}/Qtl)
                        </span>
                      </div>
                    </div>

                    {/* Advisory & MSP note */}
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed mb-2 bg-stone-50 dark:bg-stone-900/60 p-2 rounded-md">
                      💡{" "}
                      <strong>
                        {language === "gu" ? "બજાર વલણ:" : "Advisory:"}
                      </strong>{" "}
                      {language === "gu" ? crop.advisory_gu : crop.advisory_en}
                    </p>
                  </div>

                  {/* Footer Action: Ask AI Advisor */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between">
                    {crop.msp_rate ? (
                      <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold">
                        સરકારી ટેકાનો ભાવ: ₹{crop.msp_rate}/Qtl
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400">
                        આવક: {crop.arrival_tonnes} ટન
                      </span>
                    )}

                    {onAskAboutCrop && (
                      <button
                        type="button"
                        onClick={() => {
                          onAskAboutCrop(crop.commodity_gu);
                          onClose();
                        }}
                        className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>
                          {language === "gu" ? "AI સલાહ લો" : "Ask AI Advice"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {language === "gu"
              ? "અધિકૃત લાઇવ ડેટા સ્રોત જોડાયેલ નથી"
              : "No authoritative live data source is connected"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs"
          >
            {language === "gu" ? "બંધ કરો" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
