import React, { useState, useMemo } from 'react';
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
  Info
} from 'lucide-react';
import { Language } from '../types';
import { GUJARAT_MARKET_PRICES, CropMarketPrice } from '../data/marketPrices';

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
  onAskAboutCrop
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label_gu: '🌾 તમામ પાક (All Crops)', label_en: 'All Crops', icon: '🌾' },
    { id: 'cereal', label_gu: '🌾 ધાન્ય (Wheat, Juvar, Bajari, Rice)', label_en: 'Grains & Cereals', icon: '🍞' },
    { id: 'oilseeds', label_gu: '🌱 તેલીબિયાં (Mustard, Divela, Groundnut)', label_en: 'Oilseeds', icon: '🌻' },
    { id: 'vegetables', label_gu: '🥦 શાકભાજી (Potato, Onion, Tomato, Chilli)', label_en: 'Vegetables', icon: '🥕' },
    { id: 'cash_crops', label_gu: '🧵 રોકડિયા (Cotton / કપાસ)', label_en: 'Cash Crops', icon: '🌱' },
    { id: 'spices', label_gu: '🌶️ મસાલા (Jeera / લસણ / Cumin)', label_en: 'Spices', icon: '🌿' }
  ];

  const filteredPrices = useMemo(() => {
    return GUJARAT_MARKET_PRICES.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        item.commodity_gu.toLowerCase().includes(q) ||
        item.commodity_en.toLowerCase().includes(q) ||
        item.market_name_gu.toLowerCase().includes(q) ||
        item.market_name_en.toLowerCase().includes(q) ||
        item.variety_gu.toLowerCase().includes(q) ||
        item.district_gu.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div 
      id="market-prices-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-850 via-emerald-800 to-teal-900 px-5 py-4 text-white flex items-center justify-between gap-3 border-b border-emerald-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-md">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>{language === 'gu' ? 'ગુજરાત APMC બજાર ભાવ (Mandi Bhav)' : 'Gujarat APMC Live Mandi Rates'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  તાજા બજાર ભાવ
                </span>
              </h3>
              <p className="text-xs text-emerald-200">
                {language === 'gu' 
                  ? 'ઘઉં, જુવાર, બાજરી, શાકભાજી, ચોખા, રાયડો, દિવેલા, કપાસ, મગફળી અને જીરુંના આજના સત્તાવાર ભાવ'
                  : 'Daily wholesale market arrivals and prices across Gondal, Rajkot, Unjha, Deesa & Mahuva mandis'}
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
        <div className="p-4 bg-stone-50 dark:bg-stone-900/90 border-b border-stone-200 dark:border-stone-800 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="mandi-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'gu' ? 'પાક અથવા માર્કેટ શોધો (દા.ત. ઘઉં, જુવાર, બાજરી, બટાટા, રાયડો, દિવેલા, ગોંડલ)...' : 'Search crop or mandi (e.g. Wheat, Juvar, Bajra, Potato, Mustard, Castor)...'}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
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
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{language === 'gu' ? cat.label_gu : cat.label_en}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Crops List Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pb-1">
            <span>
              {language === 'gu' ? `કુલ ${filteredPrices.length} પાકના ભાવ ઉપલબ્ધ` : `Showing ${filteredPrices.length} crop rates`}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {language === 'gu' ? 'દૈનિક ભાવ: ૨૦ કિગ્રા (૧ મણ) દીઠ' : 'Rates per 20 kg (1 Man)'}
            </span>
          </div>

          {filteredPrices.length === 0 ? (
            <div className="py-12 text-center text-stone-500 dark:text-stone-400 space-y-2">
              <Info className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-sm font-semibold">
                {language === 'gu' ? 'આ શોધ માટે કોઈ પાક મળ્યો નથી.' : 'No crop prices found for this search.'}
              </p>
              <p className="text-xs">
                {language === 'gu' ? 'બીજો પાક શોધો જેમ કે ઘઉં, જુવાર, બાજરી, ચોખા, રાયડો, દિવેલા અથવા શાકભાજી.' : 'Try searching for Wheat, Jowar, Bajri, Mustard, Castor or Vegetables.'}
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
                          <span>{language === 'gu' ? crop.commodity_gu : crop.commodity_en}</span>
                          {crop.price_trend === 'up' ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                              <TrendingUp className="w-2.5 h-2.5" /> +{crop.trend_percentage}%
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.2 rounded">
                              સ્થિર
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          {language === 'gu' ? crop.variety_gu : crop.variety_en}
                        </p>
                      </div>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                        {language === 'gu' ? crop.category_gu.split(' ')[0] : crop.category_en}
                      </span>
                    </div>

                    {/* Mandi & Location */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 mb-2.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{language === 'gu' ? crop.market_name_gu : crop.market_name_en}</span>
                    </div>

                    {/* Price Rates Highlight Box */}
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between mb-2">
                      <div>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 block">
                          {language === 'gu' ? 'મણે ભાવ (૨૦ કિગ્રા)' : 'Price per 20kg (1 Man)'}
                        </span>
                        <span className="text-base font-extrabold text-emerald-800 dark:text-emerald-300 font-mono">
                          ₹{crop.min_price} - ₹{crop.max_price}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 block">
                          {language === 'gu' ? 'સરેરાશ / ક્વિન્ટલ' : 'Modal / Quintal'}
                        </span>
                        <span className="text-xs font-bold text-stone-800 dark:text-stone-200 font-mono">
                          ₹{crop.modal_price} (₹{crop.price_per_quintal}/Qtl)
                        </span>
                      </div>
                    </div>

                    {/* Advisory & MSP note */}
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed mb-2 bg-stone-50 dark:bg-stone-900/60 p-2 rounded-md">
                      💡 <strong>{language === 'gu' ? 'બજાર વલણ:' : 'Advisory:'}</strong> {language === 'gu' ? crop.advisory_gu : crop.advisory_en}
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
                        <span>{language === 'gu' ? 'AI સલાહ લો' : 'Ask AI Advice'}</span>
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
            {language === 'gu' ? 'ગુજરાત રાજ્ય કૃષિ બજાર બોર્ડ (G-SAMB) સત્તાવાર ડેટા' : 'Official Gujarat State Agricultural Marketing Board (GSAMB) Data'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs"
          >
            {language === 'gu' ? 'બંધ કરો' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
