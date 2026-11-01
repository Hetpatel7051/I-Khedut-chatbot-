import React, { useState, useRef, useEffect } from "react";
import { Language } from "../types";
import {
  Sprout,
  Languages,
  Calculator,
  BookOpen,
  TrendingUp,
  Menu,
  X,
  ChevronRight,
  Settings,
  Bell,
} from "lucide-react";

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenProfile: () => void;
  onOpenCalculator: () => void;
  onOpenSchemes: () => void;
  onOpenPrices?: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenProfile,
  onOpenCalculator,
  onOpenSchemes,
  onOpenPrices,
  onOpenNotifications,
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
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      id="ikhedut-header"
      className="shrink-0 bg-emerald-800 text-white shadow-sm border-b border-emerald-900 relative z-30"
    >
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-emerald-800 font-black text-xl shrink-0">
            <Sprout className="w-6 h-6 text-emerald-800" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg text-white flex items-center gap-1.5 truncate">
                <span className="truncate">આઈ-ખેડૂત AI સહાયક</span>
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-100 truncate max-w-full">
              {language === "gu"
                ? "કૃષિ સહાય યોજનાઓ અને સબસિડી"
                : language === "hi"
                  ? "कृषि सहायता योजनाएं और सब्सिडी"
                  : "Agricultural Subsidies & Eligibility"}
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {/* New Schemes Notification Bell Button */}
          <button
            onClick={onOpenNotifications}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20"
            title={language === "gu" ? "યોજના સૂચનાઓ" : "Scheme notifications"}
            aria-label={
              language === "gu" ? "યોજના સૂચનાઓ" : "Scheme notifications"
            }
          >
            <Bell className="h-4 w-4" />
          </button>

          {onOpenPrices && (
            <button
              onClick={onOpenPrices}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20"
              title={language === "gu" ? "બજાર ભાવ (APMC)" : "Mandi rates"}
              aria-label={language === "gu" ? "બજાર ભાવ (APMC)" : "Mandi rates"}
            >
              <TrendingUp className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={onOpenSchemes}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors border border-white/25 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-white" />
            <span>
              {language === "gu"
                ? "તમામ યોજનાઓ"
                : language === "hi"
                  ? "सभी योजनाएं"
                  : "All Schemes"}
            </span>
          </button>

          <button
            onClick={onOpenCalculator}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-xs font-bold text-emerald-900 transition-colors cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>
              {language === "gu"
                ? "સબસિડી કેલ્ક્યુલેટર"
                : language === "hi"
                  ? "सब्सिडी कैलकुलेटर"
                  : "Calculator"}
            </span>
          </button>

          {/* Settings / Profile Button */}
          <button
            onClick={onOpenProfile}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/25 cursor-pointer"
            title="પ્રોફાઇલ અને સેટિંગ્સ"
            aria-label={language === "gu" ? "ખેડૂત પ્રોફાઇલ" : "Farmer profile"}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Language Selector */}
          <div className="relative inline-flex items-center bg-white/10 rounded-lg p-0.5 border border-white/25">
            <Languages className="w-3.5 h-3.5 ml-2 text-emerald-100" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-white text-xs font-semibold px-2 py-1 outline-none cursor-pointer rounded"
            >
              <option value="gu" className="text-stone-900">
                ગુજરાતી
              </option>
              <option value="hi" className="text-stone-900">
                हिंदी
              </option>
              <option value="en" className="text-stone-900">
                English
              </option>
            </select>
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Notification Button Mobile */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/25 transition-colors"
            title="યોજના સૂચનાઓ"
            aria-label={
              language === "gu" ? "યોજના સૂચનાઓ" : "Scheme notifications"
            }
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Quick Language Toggle on Mobile */}
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="bg-white/10 text-white text-xs font-semibold px-2 py-1.5 border border-white/25 outline-none cursor-pointer rounded-lg"
          >
            <option value="gu" className="text-stone-900">
              ગુજરાતી
            </option>
            <option value="hi" className="text-stone-900">
              हिंदी
            </option>
            <option value="en" className="text-stone-900">
              English
            </option>
          </select>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/25 text-white transition-colors"
            aria-label={
              isMobileMenuOpen
                ? language === "gu"
                  ? "મેનૂ બંધ કરો"
                  : "Close menu"
                : language === "gu"
                  ? "મેનૂ ખોલો"
                  : "Open menu"
            }
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel (Contains Edit Profile & Settings moved from slide bar) */}
      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-emerald-100 shadow-lg origin-top animate-in slide-in-from-top-2 z-50"
        >
          <div className="p-3 space-y-2">
            {/* Edit Profile & Settings option moved into 3-line menu */}
            <button
              onClick={() => {
                onOpenProfile();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white hover:bg-emerald-50 border border-stone-200 text-emerald-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Settings className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-left">
                  <span className="font-bold block text-sm">
                    {language === "gu"
                      ? "ખેડૂત પ્રોફાઇલ બદલો"
                      : language === "hi"
                        ? "किसान प्रोफ़ाइल बदलें"
                        : "Edit farmer profile"}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {language === "gu"
                      ? "જમીન અને વ્યક્તિગત વિગતો"
                      : language === "hi"
                        ? "भूमि और व्यक्तिगत विवरण"
                        : "Land and personal details"}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            </button>

            {onOpenPrices && (
              <button
                onClick={() => {
                  onOpenPrices();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white hover:bg-emerald-50 border border-stone-200 text-stone-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">
                    {language === "gu"
                      ? "બજાર ભાવ (APMC Mandi)"
                      : "Mandi Rates"}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </button>
            )}

            <button
              onClick={() => {
                onOpenSchemes();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white hover:bg-emerald-50 border border-stone-200 text-stone-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                </div>
                <span className="font-medium">
                  {language === "gu"
                    ? "તમામ યોજનાઓ બ્રાઉઝ કરો"
                    : "Browse Schemes"}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            </button>

            <button
              onClick={() => {
                onOpenCalculator();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 border border-emerald-700 text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <Calculator className="w-4 h-4" />
                </div>
                <span className="font-bold">
                  {language === "gu"
                    ? "સબસિડી કેલ્ક્યુલેટર"
                    : "Subsidy Calculator"}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
