import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { IKHEDUT_SCHEMES } from '../data/schemes';
import { Scheme, Language, FarmerProfile } from '../types';
import { 
  Calculator, 
  Coins, 
  Sparkles, 
  Percent, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  FileText, 
  ExternalLink,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface EligibilityCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  farmerProfile: FarmerProfile;
  language: Language;
  onAskAIAboutScheme?: (schemeName: string) => void;
}

export const EligibilityCalculator: React.FC<EligibilityCalculatorProps> = ({
  isOpen,
  onClose,
  farmerProfile,
  language,
  onAskAIAboutScheme
}) => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(IKHEDUT_SCHEMES[0].id);
  const [estimatedCost, setEstimatedCost] = useState<number>(120000);
  const [caste, setCaste] = useState<string>(farmerProfile.caste_category || 'General');
  const [isWomanFarmer, setIsWomanFarmer] = useState<boolean>(farmerProfile.farmer_type === 'women');
  const [landAcres, setLandAcres] = useState<number>(farmerProfile.land_size_acres || 3.0);

  if (!isOpen) return null;

  const activeScheme = IKHEDUT_SCHEMES.find(s => s.id === selectedSchemeId) || IKHEDUT_SCHEMES[0];

  // Dynamic Subsidy Math Engine
  const calculation = useMemo(() => {
    let percentage = 0.25;
    let percentageLabel = "25%";
    let maxCap = activeScheme.max_subsidy_amount;

    if (activeScheme.id === 'ikhedut-sch-001') {
      // Tractor
      if (caste === 'SC' || caste === 'ST' || isWomanFarmer) {
        percentage = 0.50;
        percentageLabel = "50%";
        maxCap = 60000;
      } else if (landAcres <= 5) {
        percentage = 0.35;
        percentageLabel = "35%";
        maxCap = 55000;
      } else {
        percentage = 0.25;
        percentageLabel = "25%";
        maxCap = 45000;
      }
    } else if (activeScheme.id === 'ikhedut-sch-002') {
      // Drip / Sprinkler GGRC
      if (caste === 'SC' || caste === 'ST' || isWomanFarmer || landAcres <= 5) {
        percentage = 0.70;
        percentageLabel = "70%";
      } else {
        percentage = 0.50;
        percentageLabel = "50%";
      }
      maxCap = 100000;
    } else if (activeScheme.id === 'ikhedut-sch-003') {
      // Barbed wire fencing
      percentage = 0.50;
      percentageLabel = "50%";
      maxCap = 40000;
    } else if (activeScheme.id === 'ikhedut-sch-004') {
      // Desi Gau Sahay
      percentage = 1.0;
      percentageLabel = "100% Monthly DBT";
      maxCap = 10800; // 900 * 12
    } else if (activeScheme.id === 'ikhedut-sch-005') {
      // Drone
      if (caste === 'SC' || caste === 'ST' || isWomanFarmer) {
        percentage = 0.75;
        percentageLabel = "75%";
      } else {
        percentage = 0.50;
        percentageLabel = "50%";
      }
      maxCap = 500000;
    } else if (activeScheme.id === 'ikhedut-sch-006') {
      // Smartphone
      percentage = 0.40;
      percentageLabel = "40%";
      maxCap = 6000;
    } else if (activeScheme.id === 'ikhedut-sch-007') {
      // Solar pump PM-KUSUM
      percentage = (caste === 'SC' || caste === 'ST') ? 0.75 : 0.60;
      percentageLabel = (caste === 'SC' || caste === 'ST') ? "75%" : "60%";
      maxCap = 150000;
    } else {
      percentage = 0.50;
      percentageLabel = "50%";
      maxCap = activeScheme.max_subsidy_amount;
    }

    const rawSubsidy = estimatedCost * percentage;
    const finalGovSubsidy = Math.min(rawSubsidy, maxCap);
    const farmerPayable = Math.max(0, estimatedCost - finalGovSubsidy);

    return {
      percentageLabel,
      percentageVal: percentage * 100,
      maxCap,
      finalGovSubsidy,
      farmerPayable
    };
  }, [activeScheme, estimatedCost, caste, isWomanFarmer, landAcres]);

  const handleTriggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 text-emerald-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 text-amber-400 flex items-center justify-center font-black shadow-inner">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-emerald-950">
                {language === 'gu' ? 'આઈ-ખેડૂત સબસિડી કેલ્ક્યુલેટર (Subsidy Calculator)' : 'iKhedut Subsidy Calculator'}
              </h2>
              <p className="text-xs text-emerald-950/80 font-medium">
                {language === 'gu' ? 'તમારા સાધન અથવા યોજનાની સચોટ સરકારી સહાય ગણો' : 'Calculate exact government grant and your net share'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-950 hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* 1. Scheme Selector */}
          <div>
            <label className="block font-bold text-stone-900 dark:text-stone-100 mb-1.5">
              યોજના પસંદ કરો (Select Agricultural Scheme):
            </label>
            <select
              value={selectedSchemeId}
              onChange={(e) => {
                setSelectedSchemeId(e.target.value);
                const s = IKHEDUT_SCHEMES.find(item => item.id === e.target.value);
                if (s) {
                  if (s.id === 'ikhedut-sch-001') setEstimatedCost(150000);
                  else if (s.id === 'ikhedut-sch-002') setEstimatedCost(80000);
                  else if (s.id === 'ikhedut-sch-004') setEstimatedCost(10800);
                  else if (s.id === 'ikhedut-sch-006') setEstimatedCost(14000);
                  else setEstimatedCost(s.max_subsidy_amount * 2);
                }
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-emerald-300 dark:border-stone-700 bg-emerald-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            >
              {IKHEDUT_SCHEMES.map((sch) => (
                <option key={sch.id} value={sch.id}>
                  {sch.name_gu} ({sch.category_gu}) - Max ₹{sch.max_subsidy_amount.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Farmer Parameters (Land, Caste, Equipment Cost) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 dark:bg-stone-800/50 p-3.5 rounded-xl border border-stone-200 dark:border-stone-700">
            {/* Purchase/Equipment Cost */}
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1 text-xs">
                સાધન કિંમત / ખર્ચ (₹):
              </label>
              <input
                type="number"
                step="1000"
                min="1000"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 font-extrabold text-stone-900 dark:text-stone-100 outline-none"
              />
            </div>

            {/* Land Size */}
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1 text-xs">
                જમીન (એકર):
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={landAcres}
                onChange={(e) => setLandAcres(parseFloat(e.target.value) || 1)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 font-bold text-stone-900 dark:text-stone-100 outline-none"
              />
            </div>

            {/* Social Category */}
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1 text-xs">
                કેટેગરી (Caste):
              </label>
              <select
                value={caste}
                onChange={(e) => setCaste(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 font-semibold text-stone-900 dark:text-stone-100 outline-none text-xs"
              >
                <option value="General">સામાન્ય (General)</option>
                <option value="OBC">OBC / SEBC</option>
                <option value="SC">SC (અનુસૂચિત જાતિ)</option>
                <option value="ST">ST (આદિજાતિ)</option>
              </select>
            </div>
          </div>

          {/* Woman farmer toggle */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isWomanFarmer}
                onChange={(e) => setIsWomanFarmer(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
              />
              <span>મહિલા ખાતેદાર છે (Woman Farmer - Eligible for maximum slab)</span>
            </label>
          </div>

          {/* 3. Output Result Summary Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white p-5 rounded-2xl shadow-lg border border-emerald-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Coins className="w-32 h-32" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-700/80 pb-3">
                <div>
                  <div className="text-xs font-medium text-emerald-300">
                    લાગુ પડતી સબસિડી ટકાવારી (Applicable Slab):
                  </div>
                  <div className="text-xl font-black text-amber-400 flex items-center gap-1.5">
                    <span>{calculation.percentageLabel}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-600">
                      મહત્તમ કેપ: ₹{calculation.maxCap.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerConfetti}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>અભિનંદન!</span>
                </button>
              </div>

              {/* Two Big Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-600/50">
                  <div className="text-xs text-emerald-300 font-medium">
                    ગુજરાત સરકાર સબસિડી સહાય (Government Subsidy):
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                    ₹{calculation.finalGovSubsidy.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-300/80 mt-0.5">
                    (સીધી ડીબીટી દ્વારા બેંક ખાતામાં જમા)
                  </div>
                </div>

                <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-600/50">
                  <div className="text-xs text-emerald-300 font-medium">
                    ખેડૂતનો પોતાનો હિસ્સો (Farmer Net Contribution):
                  </div>
                  <div className="text-2xl font-extrabold text-amber-300 mt-1">
                    ₹{calculation.farmerPayable.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-300/80 mt-0.5">
                    (સાધન ખરીદી વખતે ચૂકવવાનો ભાગ)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
            {onAskAIAboutScheme && (
              <button
                type="button"
                onClick={() => {
                  onAskAIAboutScheme(activeScheme.name_gu);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-900 dark:text-emerald-300 font-bold text-xs transition-colors"
              >
                <span>AI સહાયકને આ યોજના વિશે પૂછો</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <a
              href={activeScheme.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-transform active:scale-95 ml-auto"
            >
              <span>આઈ-ખેડૂત પોર્ટલ પર ફોર્મ ભરો</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
