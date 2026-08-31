import React, { useState } from 'react';
import { FarmerProfile, Language } from '../types';
import { GUJARAT_DISTRICTS, COMMON_CROPS } from '../data/schemes';
import { User, MapPin, LandPlot, Users, Sprout, Droplets, Tractor, HeartHandshake, CheckCircle2, X } from 'lucide-react';

interface FarmerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FarmerProfile;
  onSave: (profile: FarmerProfile) => void;
  language: Language;
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  language
}) => {
  const [formData, setFormData] = useState<FarmerProfile>({ ...profile });
  const [isSaved, setIsSaved] = useState(false);

  // Synchronize internal form state whenever profile or modal open state changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({ ...profile });
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const toggleCrop = (cropName: string) => {
    const crops = formData.primary_crops || [];
    if (crops.includes(cropName)) {
      setFormData({ ...formData, primary_crops: crops.filter(c => c !== cropName) });
    } else {
      setFormData({ ...formData, primary_crops: [...crops, cropName] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-emerald-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base">
                {language === 'gu' ? 'ખેડૂત પ્રોફાઈલ અને જમીનની વિગત' : 'Farmer Profile & Land Records'}
              </h2>
              <p className="text-xs text-emerald-200">
                {language === 'gu' ? 'સચોટ સબસિડી અને પાત્રતા ગણતરી માટે તમારી વિગત ભરો' : 'Set your land size and category for accurate subsidy calculation'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Farmer Name */}
          <div>
            <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
              ખેડૂતનું નામ (Farmer Full Name):
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="દા.ત. રમેશભાઈ પટેલ"
            />
          </div>

          {/* District Selector (All 33 Gujarat Districts) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>જિલ્લો (District in Gujarat):</span>
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {GUJARAT_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Social / Caste Category */}
            <div>
              <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>જ્ઞાતિ કેટેગરી (Social Category):</span>
              </label>
              <select
                value={formData.caste_category}
                onChange={(e) => setFormData({ ...formData, caste_category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
              >
                <option value="General">સામાન્ય (General - 25%-50% Subsidy)</option>
                <option value="OBC">ઓબીસી / બક્ષીપંચ (OBC / SEBC)</option>
                <option value="SC">અનુસૂચિત જાતિ (SC - Up to 70% Subsidy)</option>
                <option value="ST">અનુસૂચિત જનજાતિ (ST - Up to 75% Subsidy)</option>
              </select>
            </div>
          </div>

          {/* Land Size in Acres / Vigha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1 flex items-center gap-1">
                <LandPlot className="w-3.5 h-3.5 text-teal-600" />
                <span>જમીન ધારણ ક્ષમતા (Land Holding):</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  required
                  value={formData.land_size_acres}
                  onChange={(e) => setFormData({ ...formData, land_size_acres: parseFloat(e.target.value) || 0 })}
                  className="w-2/3 px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                />
                <select
                  value={formData.land_unit}
                  onChange={(e) => setFormData({ ...formData, land_unit: e.target.value as any })}
                  className="w-1/3 px-2 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold"
                >
                  <option value="acres">એકર (Acres)</option>
                  <option value="vigha">વીઘા (Vigha)</option>
                  <option value="hectares">હેક્ટર (Hectare)</option>
                </select>
              </div>
            </div>

            {/* Farmer Holding Type */}
            <div>
              <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                ખેડૂત પ્રકાર (Holding Class):
              </label>
              <select
                value={formData.farmer_type}
                onChange={(e) => setFormData({ ...formData, farmer_type: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="marginal">સીમાંત ખેડૂત (Marginal: &lt; 1 Hectare / 2.5 Acres)</option>
                <option value="small">નાના ખેડૂત (Small: 1 to 2 Hectares)</option>
                <option value="large">મોટા ખેડૂત (Large: &gt; 2 Hectares)</option>
                <option value="women">મહિલા ખાતેદાર (Women Farmer)</option>
              </select>
            </div>
          </div>

          {/* Primary Crops Multi-Select */}
          <div>
            <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1.5 flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>મુખ્ય વાવેતર પાક (Primary Crops Grown):</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_CROPS.map((c) => {
                const isSelected = formData.primary_crops?.includes(c.en) || formData.primary_crops?.includes(c.gu);
                return (
                  <button
                    key={c.en}
                    type="button"
                    onClick={() => toggleCrop(c.en)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-600'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {c.gu} ({c.en.split(' ')[0]})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Farm Assets Checkbox Toggles */}
          <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
            <div className="font-semibold text-stone-800 dark:text-stone-200">
              હાલના સાધન / સુવિધાઓ (Current Farm Assets):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={formData.has_water_source}
                  onChange={(e) => setFormData({ ...formData, has_water_source: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
                <span>પાણીનો સ્ત્રોત (Bore/Well)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={formData.has_tractor}
                  onChange={(e) => setFormData({ ...formData, has_tractor: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <Tractor className="w-4 h-4 text-amber-500 shrink-0" />
                <span>પોતાનું ટ્રેક્ટર છે</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={formData.has_desi_cow}
                  onChange={(e) => setFormData({ ...formData, has_desi_cow: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>દેશી ગાય ધરાવો છો</span>
              </label>
            </div>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              રદ કરો (Cancel)
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md transition-transform active:scale-95"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>સેવ થઈ ગયું! (Saved)</span>
                </>
              ) : (
                <span>પ્રોફાઈલ સેવ કરો (Save Profile)</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
