import React from 'react';
import { 
  Tractor, 
  Apple, 
  Milk, 
  Droplets, 
  Fish, 
  Leaf, 
  Sparkles, 
  ChevronRight,
  Layers
} from 'lucide-react';
import { SchemeCategoryInfo, Language } from '../types';
import { SCHEME_CATEGORIES } from '../data/schemes';

interface CategoryPickerProps {
  language: Language;
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string, categoryLabel: string) => void;
  isCompact?: boolean;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  language,
  selectedCategoryId,
  onSelectCategory,
  isCompact = false
}) => {
  const getCategoryIcon = (iconStr: string, id: string) => {
    switch (id) {
      case 'agriculture':
        return <Tractor className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'horticulture':
        return <Apple className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'animal_husbandry':
        return <Milk className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'irrigation_solar':
        return <Droplets className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
      case 'fisheries':
        return <Fish className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      case 'natural_farming':
        return <Leaf className="w-5 h-5 text-lime-600 dark:text-lime-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getBorderColor = (id: string, isSelected: boolean) => {
    if (isSelected) return 'border-emerald-600 ring-2 ring-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 shadow-md';
    switch (id) {
      case 'agriculture':
        return 'border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-400 bg-white dark:bg-stone-900';
      case 'horticulture':
        return 'border-rose-200 dark:border-rose-800/60 hover:border-rose-400 bg-white dark:bg-stone-900';
      case 'animal_husbandry':
        return 'border-amber-200 dark:border-amber-800/60 hover:border-amber-400 bg-white dark:bg-stone-900';
      case 'irrigation_solar':
        return 'border-sky-200 dark:border-sky-800/60 hover:border-sky-400 bg-white dark:bg-stone-900';
      case 'fisheries':
        return 'border-cyan-200 dark:border-cyan-800/60 hover:border-cyan-400 bg-white dark:bg-stone-900';
      case 'natural_farming':
        return 'border-lime-200 dark:border-lime-800/60 hover:border-lime-400 bg-white dark:bg-stone-900';
      default:
        return 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900';
    }
  };

  return (
    <div id="ikhedut-category-picker" className="w-full my-3">
      {/* Category Header */}
      <div className="flex items-center justify-between gap-2 mb-2.5 pb-1 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-700 text-white flex items-center justify-center font-bold">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
              <span>{language === 'gu' ? 'ગુજરાત આઈ-ખેડૂત યોજના વિભાગો (Categories)' : 'iKhedut Scheme Categories'}</span>
            </h4>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {language === 'gu' ? 'સંબંધિત યોજનાઓ જોવા માટે કેટેગરી પસંદ કરો:' : 'Click a category to view related government schemes:'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          ૬ સત્તાવાર વિભાગો
        </span>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {SCHEME_CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const displayName = language === 'gu' ? cat.name_gu : language === 'hi' ? cat.name_hi : cat.name_en;
          const displayDesc = language === 'gu' ? cat.description_gu : cat.description_en;

          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              type="button"
              onClick={() => onSelectCategory(cat.id, cat.name_gu)}
              className={`p-3 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer flex flex-col justify-between group shadow-xs ${getBorderColor(cat.id, isSelected)}`}
            >
              <div>
                {/* Category Top Bar */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" role="img" aria-label={cat.name_en}>
                      {cat.icon}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                      {displayName}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 shrink-0">
                    {cat.scheme_count} {language === 'gu' ? 'યોજના' : 'Schemes'}
                  </span>
                </div>

                {/* Category Description */}
                <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-300 line-clamp-2 mb-2">
                  {displayDesc}
                </p>
              </div>

              {/* Tags & Action Row */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {cat.tags_gu.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400">
                      #{t}
                    </span>
                  ))}
                </div>

                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  <span>{language === 'gu' ? 'યોજના જુઓ' : 'View'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
