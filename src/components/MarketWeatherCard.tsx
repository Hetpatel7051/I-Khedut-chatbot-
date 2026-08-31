import React, { useState } from 'react';
import { MarketPriceData, WeatherData, Language } from '../types';
import { CloudSun, TrendingUp, Droplets, Wind, MapPin, Calendar, Sparkles, ChevronRight, Layers } from 'lucide-react';

interface MarketWeatherCardProps {
  marketPrices?: MarketPriceData[];
  weatherData?: WeatherData;
  language: Language;
  onOpenAllPrices?: () => void;
}

export const MarketWeatherCard: React.FC<MarketWeatherCardProps> = ({
  marketPrices,
  weatherData,
  language,
  onOpenAllPrices
}) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'grains' | 'oilseeds' | 'vegetables'>('all');

  const filteredPrices = (marketPrices || []).filter(item => {
    if (selectedTab === 'all') return true;
    const name = (item.commodity_gu + ' ' + item.commodity).toLowerCase();
    if (selectedTab === 'grains') {
      return name.includes('ઘઉં') || name.includes('જુવાર') || name.includes('બાજરી') || name.includes('ચોખા') || name.includes('ડાંગર') || name.includes('wheat') || name.includes('jowar') || name.includes('bajra') || name.includes('paddy');
    }
    if (selectedTab === 'oilseeds') {
      return name.includes('રાયડો') || name.includes('દિવેલા') || name.includes('એરંડા') || name.includes('મગફળી') || name.includes('તલ') || name.includes('mustard') || name.includes('castor') || name.includes('groundnut');
    }
    if (selectedTab === 'vegetables') {
      return name.includes('બટાટા') || name.includes('ડુંગળી') || name.includes('ટામેટા') || name.includes('મરચા') || name.includes('લસણ') || name.includes('potato') || name.includes('onion') || name.includes('tomato') || name.includes('garlic');
    }
    return true;
  });

  return (
    <div className="mt-3 space-y-3">
      {/* Weather Widget */}
      {weatherData && (
        <div className="p-3.5 rounded-xl bg-linear-to-r from-sky-50 to-blue-50 dark:from-sky-950/40 dark:to-blue-950/40 border border-sky-200 dark:border-sky-800 text-xs">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-sky-200/80 dark:border-sky-800/60">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="font-bold text-sky-950 dark:text-sky-200 text-sm">
                {language === 'gu' ? 'કૃષિ હવામાન અનુમાન' : 'Agri Weather Forecast'}
              </span>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-medium text-sky-800 dark:text-sky-300">
              <MapPin className="w-3 h-3" />
              {language === 'gu' ? weatherData.location_gu : weatherData.location}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 my-2.5 text-center">
            <div className="p-2 rounded-lg bg-white/70 dark:bg-stone-900/60 border border-sky-100 dark:border-sky-900">
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block">{language === 'gu' ? 'તાપમાન' : 'Temp'}</span>
              <span className="text-base font-bold text-stone-900 dark:text-stone-100">{weatherData.temperature_c}°C</span>
            </div>
            <div className="p-2 rounded-lg bg-white/70 dark:bg-stone-900/60 border border-sky-100 dark:border-sky-900">
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block flex items-center justify-center gap-0.5">
                <Droplets className="w-3 h-3 text-sky-500" />
                {language === 'gu' ? 'ભેજ' : 'Humidity'}
              </span>
              <span className="text-base font-bold text-stone-900 dark:text-stone-100">{weatherData.humidity_percent}%</span>
            </div>
            <div className="p-2 rounded-lg bg-white/70 dark:bg-stone-900/60 border border-sky-100 dark:border-sky-900">
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block flex items-center justify-center gap-0.5">
                <Wind className="w-3 h-3 text-teal-500" />
                {language === 'gu' ? 'પવન' : 'Wind'}
              </span>
              <span className="text-base font-bold text-stone-900 dark:text-stone-100">{weatherData.wind_speed_kmh} km/h</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-sky-100/70 dark:bg-sky-900/30 text-sky-900 dark:text-sky-200 text-[11px] flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>{language === 'gu' ? 'કૃષિ સલાહ:' : 'Advisory:'}</strong> {weatherData.advisory_gu}
            </span>
          </div>
        </div>
      )}

      {/* APMC Mandi Prices Widget */}
      {marketPrices && marketPrices.length > 0 && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50/80 via-emerald-50/60 to-amber-50/80 dark:from-amber-950/30 dark:via-emerald-950/30 dark:to-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs shadow-xs">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-200/80 dark:border-amber-800/60">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                {language === 'gu' ? 'તાજા APMC બજાર ભાવ (ગુજરાત માર્કેટ યાર્ડ)' : 'Live APMC Mandi Rates (Gujarat Mandis)'}
              </span>
            </div>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3" />
              {marketPrices[0]?.date || 'આજના તાજા ભાવ'}
            </span>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 my-2 overflow-x-auto pb-1 text-[11px]">
            <button
              type="button"
              onClick={() => setSelectedTab('all')}
              className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                selectedTab === 'all'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {language === 'gu' ? 'બધા' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('grains')}
              className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                selectedTab === 'grains'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {language === 'gu' ? '🌾 ધાન્ય (ઘઉં, જુવાર, બાજરી, ચોખા)' : 'Grains'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('oilseeds')}
              className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                selectedTab === 'oilseeds'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {language === 'gu' ? '🌱 તેલીબિયાં (રાયડો, દિવેલા)' : 'Oilseeds'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('vegetables')}
              className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                selectedTab === 'vegetables'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {language === 'gu' ? '🥦 શાકભાજી (બટાટા, ડુંગળી, ટામેટા, લસણ)' : 'Vegetables'}
            </button>
          </div>

          <div className="divide-y divide-amber-200/50 dark:divide-amber-800/40 my-1">
            {filteredPrices.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">
                      {language === 'gu' ? item.commodity_gu : item.commodity}
                    </span>
                    {item.price_trend === 'up' && (
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950 px-1 rounded">
                        +{item.trend_percentage || 2}%
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                    {language === 'gu' ? item.market_name_gu : item.market_name}
                  </span>
                  {item.advisory_gu && (
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 italic">
                      {language === 'gu' ? item.advisory_gu : item.advisory_en}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-emerald-800 dark:text-emerald-300 text-sm sm:text-base block font-mono">
                    ₹{item.min_price} - ₹{item.max_price}
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-medium">
                    {language === 'gu' ? `સરેરાશ ₹${item.modal_price} / ${item.unit}` : `Avg ₹${item.modal_price} / ${item.unit}`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {onOpenAllPrices && (
            <div className="mt-2 pt-2 border-t border-amber-200/80 dark:border-amber-800/60 text-center">
              <button
                type="button"
                onClick={onOpenAllPrices}
                className="w-full py-1.5 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{language === 'gu' ? 'બધા પાકના સંપૂર્ણ બજાર ભાવ જુઓ' : 'View Full Gujarat APMC Price Board'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

