import React, { useState } from 'react';
import { IKHEDUT_SCHEMES } from '../data/schemes';
import { Scheme, Language } from '../types';
import { SchemeCard } from './SchemeCard';
import { Search, Filter, BookOpen, X, Sparkles } from 'lucide-react';

interface QuickSchemeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onOpenChecklist: (scheme: Scheme) => void;
}

export const QuickSchemeDrawer: React.FC<QuickSchemeDrawerProps> = ({
  isOpen,
  onClose,
  language,
  onOpenChecklist
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = [
    { id: 'All', label_gu: 'તમામ યોજનાઓ', label_en: 'All' },
    { id: 'Agrimachinery', label_gu: 'ખેતીવાડી યાંત્રીકીકરણ', label_en: 'Machinery' },
    { id: 'Irrigation', label_gu: 'ટપક/સિંચાઈ (GGRC)', label_en: 'Irrigation' },
    { id: 'Crop Protection', label_gu: 'પાક રક્ષણ (વાડ)', label_en: 'Crop Protection' },
    { id: 'Natural Farming', label_gu: 'પ્રાકૃતિક ખેતી (ગાય)', label_en: 'Natural Farming' },
    { id: 'Hi-Tech Agriculture', label_gu: 'ડ્રોન/હાઈ-ટેક', label_en: 'Hi-Tech' },
    { id: 'Solar Energy & Irrigation', label_gu: 'સોલાર પંપ (કુસુમ)', label_en: 'Solar' },
  ];

  const filteredSchemes = IKHEDUT_SCHEMES.filter(scheme => {
    const matchesCat = selectedCategory === 'All' || scheme.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      scheme.name_gu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-full bg-stone-50 dark:bg-stone-900 shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-emerald-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-bold text-base">
                {language === 'gu' ? 'ગુજરાત આઈ-ખેડૂત યોજના ડિરેક્ટરી' : 'Gujarat iKhedut Scheme Directory'}
              </h2>
              <p className="text-xs text-emerald-200">
                {language === 'gu' ? 'તમામ સત્તાવાર સબસિડી અને માપદંડ' : 'Official subsidy rates and criteria'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'gu' ? 'યોજના અથવા સાધન શોધો (દા.ત. ટ્રેક્ટર, ટપક, વાડ)...' : 'Search schemes...'}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {language === 'gu' ? cat.label_gu : cat.label_en}
              </button>
            ))}
          </div>
        </div>

        {/* Scheme List Feed */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            કુલ ઉપલબ્ધ યોજનાઓ: {filteredSchemes.length}
          </div>

          {filteredSchemes.length === 0 ? (
            <div className="text-center py-12 text-stone-500 dark:text-stone-400">
              <p>કોઈ યોજના મળી નથી. કૃપા કરીને અન્ય કીવર્ડ શોધો.</p>
            </div>
          ) : (
            filteredSchemes.map((sch) => (
              <SchemeCard
                key={sch.id}
                scheme={sch}
                language={language}
                onOpenChecklist={onOpenChecklist}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
