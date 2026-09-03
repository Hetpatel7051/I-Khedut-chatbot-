import React, { useState, useRef, useEffect } from 'react';
import { Language, FarmerProfile } from '../types';
import { 
  Sprout, 
  Languages, 
  UserCheck, 
  Calculator, 
  BookOpen, 
  Volume2, 
  Wifi,
  WifiOff,
  Database,
  MapPin,
  TrendingUp,
  Menu,
  X,
  ChevronRight,
  Settings,
  Bell
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  farmerProfile: FarmerProfile;
  isOnline?: boolean;
  onOpenProfile: () => void;
  onOpenCalculator: () => void;
  onOpenSchemes: () => void;
  onOpenChecklist: () => void;
  onOpenPrices?: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  farmerProfile,
  isOnline = true,
  onOpenProfile,
  onOpenCalculator,
  onOpenSchemes,
  onOpenPrices,
  onOpenNotifications
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header id="ikhedut-header" className="shrink-0 bg-emerald-900 text-white shadow-md border-b border-emerald-800 relative z-30">
      {/* Top Gujarat Government Identity Bar */}
      {/* <div className="bg-emerald-950 px-4 py-1.5 text-xs text-emerald-200 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/60">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-emerald-950 font-bold text-[10px]">
            ગુ
          </span>
          <span className="hidden sm:inline">ગુજરાત સરકાર - કૃષિ, ખેડૂત કલ્યાણ અને સહકાર વિભાગ</span>
          <span className="sm:hidden">કૃષિ વિભાગ ગુજરાત</span>
          <span className="hidden sm:inline text-emerald-400">| iKhedut Portal AI Assistant</span>
        </div>
        
        <div className="flex items-center gap-3"> */}
          {/* Service Worker Offline Cache Status */}
          {/* <div className="flex items-center gap-1.5 text-emerald-300">
            {isOnline ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-800/80 text-[10px] text-emerald-200 font-medium">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">ઓનલાઇન</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-600/90 text-[10px] text-amber-100 font-semibold animate-pulse">
                <WifiOff className="w-3 h-3 text-amber-200" />
                <span>ઓફલાઇન</span>
              </span>
            )}
            <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-900/80 text-[10px] text-emerald-300 font-mono">
              <Database className="w-3 h-3 text-amber-400" />
              SW Cache Active
            </span> */}
          {/* </div>

          {/* Quick Voice Prompt Reminder */}
          {/* <div className="hidden lg:flex items-center gap-1 text-amber-300 font-medium text-[11px]">
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
            <span>બોલીને પૂછો (Voice Enabled)</span>
          </div>
        </div>
      </div>  */}

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-inner text-emerald-950 font-black text-xl shrink-0">
            <Sprout className="w-6 h-6 text-emerald-950" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5 truncate">
                <span className="truncate">આઈ-ખેડૂત AI સહાયક</span>
                <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-medium">
                  {language === 'gu' ? 'ગુજરાતી' : language === 'hi' ? 'हिंदी' : 'English'}
                </span>
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-200 truncate max-w-full">
              {language === 'gu' 
                ? 'કૃષિ સહાય યોજનાઓ અને સબસિડી'
                : language === 'hi'
                ? 'कृषि सहायता योजनाएं और सब्सिडी'
                : 'Agricultural Subsidies & Eligibility'}
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {/* New Schemes Notification Bell Button */}
          <button
            onClick={onOpenNotifications}
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/90 hover:bg-emerald-700 text-xs font-semibold text-amber-300 transition-colors border border-emerald-700/60 shadow-sm cursor-pointer"
            title="નવી સબસિડી યોજનાઓ"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'gu' ? 'યોજના સૂચનાઓ' : 'Notifications'}</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
              ૫
            </span>
          </button>

          {onOpenPrices && (
            <button
              onClick={onOpenPrices}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/90 hover:bg-emerald-750 text-xs font-semibold text-amber-300 transition-colors border border-emerald-700/60 shadow-sm cursor-pointer"
              title="ગુજરાત માર્કેટ યાર્ડ પાક ભાવ"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'gu' ? 'બજાર ભાવ (APMC)' : language === 'hi' ? 'बाजार भाव' : 'Mandi Rates'}</span>
            </button>
          )}

          <button
            onClick={onOpenSchemes}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-xs font-medium text-emerald-100 transition-colors border border-emerald-700/50 shadow-sm cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'gu' ? 'તમામ યોજનાઓ' : language === 'hi' ? 'सभी योजनाएं' : 'All Schemes'}</span>
          </button>

          <button
            onClick={onOpenCalculator}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-bold text-emerald-950 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{language === 'gu' ? 'સબસિડી કેલ્ક્યુલેટર' : language === 'hi' ? 'सब्सिडी कैलकुलेटर' : 'Calculator'}</span>
          </button>

          {/* Settings / Profile Button */}
          <button
            onClick={onOpenProfile}
            className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors border border-emerald-700/60 cursor-pointer"
            title="પ્રોફાઇલ અને સેટિંગ્સ"
          >
            <Settings className="w-4 h-4 text-amber-300" />
          </button>

          {/* Language Selector */}
          <div className="relative inline-flex items-center bg-emerald-950 rounded-lg p-0.5 border border-emerald-700/70 shadow-sm">
            <Languages className="w-3.5 h-3.5 ml-2 text-emerald-400" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-white text-xs font-semibold px-2 py-1 outline-none cursor-pointer rounded"
            >
              <option value="gu" className="bg-emerald-900 text-white">ગુજરાતી</option>
              <option value="hi" className="bg-emerald-900 text-white">हिंदी</option>
              <option value="en" className="bg-emerald-900 text-white">English</option>
            </select>
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Notification Button Mobile */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-300 border border-emerald-700/60 transition-colors"
            title="યોજના સૂચનાઓ"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
              ૫
            </span>
          </button>

          {/* Quick Language Toggle on Mobile */}
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="bg-emerald-800/80 text-white text-xs font-semibold px-2 py-1.5 border border-emerald-700/60 outline-none cursor-pointer rounded-lg"
          >
            <option value="gu">ગુજરાતી</option>
            <option value="hi">हिंदी</option>
            <option value="en">English</option>
          </select>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 border border-emerald-700/50 text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Active Profile Info Banner (Clean Desktop + Mobile) without Edit button */}
      <div className="bg-emerald-950 px-4 py-2 text-[11px] text-emerald-200 border-t border-emerald-800/80 flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap shadow-inner">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 bg-emerald-900/60 px-2 py-0.5 rounded-full text-amber-300 font-medium border border-emerald-800/50">
            <UserCheck className="w-3 h-3" />
            {farmerProfile.name.split(' ')[0]}
          </span>
          <span className="flex items-center gap-1 text-emerald-100 font-medium">
            <MapPin className="w-3 h-3 text-emerald-400" />
            {farmerProfile.district.split(' ')[0]}
          </span>
          <span className="text-emerald-600">•</span>
          <span>જમીન: <strong className="text-white">{farmerProfile.land_size_acres} {farmerProfile.land_unit === 'acres' ? 'એકર' : 'વીઘਾ'}</strong></span>
          <span className="text-emerald-600">•</span>
          <span>કેટેગરી: <strong className="text-white">{farmerProfile.caste_category}</strong></span>
          <span className="text-emerald-600 hidden sm:inline">•</span>
          <span className="hidden sm:inline">પાક: <strong className="text-white">{farmerProfile.primary_crops.join(', ')}</strong></span>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel (Contains Edit Profile & Settings moved from slide bar) */}
      {isMobileMenuOpen && (
        <div ref={menuRef} className="md:hidden absolute top-full left-0 right-0 bg-emerald-900 border-b border-emerald-800 shadow-xl origin-top animate-in slide-in-from-top-2 z-50">
          <div className="p-3 space-y-2">
            {/* Edit Profile & Settings option moved into 3-line menu */}
            <button
              onClick={() => { onOpenProfile(); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-750 border border-emerald-700 text-amber-300 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-950 rounded-lg">
                  <Settings className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-left">
                  <span className="font-bold block text-sm">
                    {language === 'gu' ? 'પ્રોફાઇલ અને જમીન વિગતો બદલો' : 'Edit Profile & Land Details'}
                  </span>
                  <span className="text-[10px] text-emerald-200">
                    {farmerProfile.name} • {farmerProfile.district} ({farmerProfile.land_size_acres} વીઘા)
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </button>

            {onOpenPrices && (
              <button
                onClick={() => { onOpenPrices(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-800/50 hover:bg-emerald-800 border border-emerald-700/50 text-amber-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-950 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">{language === 'gu' ? 'બજાર ભાવ (APMC Mandi)' : 'Mandi Rates'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-500" />
              </button>
            )}

            <button
              onClick={() => { onOpenSchemes(); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-800/50 hover:bg-emerald-800 border border-emerald-700/50 text-emerald-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-950 rounded-lg">
                  <BookOpen className="w-4 h-4 text-amber-300" />
                </div>
                <span className="font-medium">{language === 'gu' ? 'તમામ યોજનાઓ બ્રાઉઝ કરો' : 'Browse Schemes'}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-500" />
            </button>

            <button
              onClick={() => { onOpenCalculator(); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 border border-amber-400 text-emerald-950 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-400 rounded-lg">
                  <Calculator className="w-4 h-4" />
                </div>
                <span className="font-bold">{language === 'gu' ? 'સબસિડી કેલ્ક્યુલેટર' : 'Subsidy Calculator'}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
