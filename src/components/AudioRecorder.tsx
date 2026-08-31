import React from 'react';
import { Mic, MicOff, Square, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { Language } from '../types';

interface AudioRecorderProps {
  isRecording: boolean;
  audioLevel: number;
  transcription: string;
  isTranscribing: boolean;
  language: Language;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  isRecording,
  audioLevel,
  transcription,
  isTranscribing,
  language,
  onStartRecording,
  onStopRecording,
  onCancelRecording
}) => {
  return (
    <div id="audio-recorder-container" className="flex items-center">
      {!isRecording ? (
        <button
          id="start-voice-record-btn"
          type="button"
          onClick={onStartRecording}
          disabled={isTranscribing}
          className="relative group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
          title={language === 'gu' ? 'બોલીને પ્રશ્ન પૂછો (Voice Query)' : 'Record your voice query'}
        >
          <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
          
          {/* Subtle pulse ring indicator */}
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-white animate-ping opacity-75"></span>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-white"></span>
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-full px-3 py-1.5 shadow-md animate-in fade-in zoom-in-95 duration-200">
          {/* Pulsating red recording badge */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="text-xs font-bold text-red-700 dark:text-red-300 whitespace-nowrap">
              {language === 'gu' ? 'સાંભળી રહ્યો છું...' : language === 'hi' ? 'सुन रहा हूँ...' : 'Listening...'}
            </span>
          </div>

          {/* Dynamic Audio Level Waveform Bars */}
          <div className="flex items-center gap-0.5 h-6 px-1">
            {[40, 70, 90, 60, 85, 50, 95, 30].map((baseHeight, idx) => {
              const dynamicHeight = Math.max(
                4,
                Math.min(24, Math.round((baseHeight * (audioLevel + 20)) / 100))
              );
              return (
                <div
                  key={idx}
                  className="w-1 bg-red-500 rounded-full transition-all duration-75"
                  style={{ height: `${dynamicHeight}px` }}
                />
              );
            })}
          </div>

          {/* Stop & Send Button */}
          <button
            id="stop-and-send-voice-btn"
            type="button"
            onClick={onStopRecording}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-sm transition-transform active:scale-90"
            title="બોલવાનું પૂરું કરો અને મોકલો"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Cancel Button */}
          <button
            id="cancel-voice-btn"
            type="button"
            onClick={onCancelRecording}
            className="text-xs text-stone-500 hover:text-stone-700 dark:text-stone-400 px-1 font-medium"
            title="રદ કરો"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
