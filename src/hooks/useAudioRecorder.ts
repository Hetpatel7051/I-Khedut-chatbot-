import { useState, useRef, useCallback, useEffect } from 'react';
import { Language } from '../types';

interface AudioRecorderHook {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioBase64: string | null;
  audioLevel: number;
  transcription: string;
  isTranscribing: boolean;
  startRecording: (lang: Language) => Promise<void>;
  stopRecording: () => Promise<{ blob: Blob | null; base64: string | null; text: string }>;
  cancelRecording: () => void;
}

export function useAudioRecorder(): AudioRecorderHook {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [transcription, setTranscription] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  const cleanupAudio = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  useEffect(() => {
    return () => cleanupAudio();
  }, [cleanupAudio]);

  const startRecording = useCallback(async (lang: Language) => {
    try {
      setTranscription('');
      setAudioBlob(null);
      setAudioBase64(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Audio waveform visualizer analysis
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(updateLevel);
        }
      };
      updateLevel();

      // Web Speech API for instantaneous transcription in Gujarati/Hindi/English
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = lang === 'gu' ? 'gu-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onresult = (event: any) => {
          let currentText = '';
          for (let i = 0; i < event.results.length; ++i) {
            currentText += event.results[i][0].transcript;
          }
          setTranscription(currentText);
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition notice:', e.error);
        };

        try {
          recognition.start();
          recognitionRef.current = recognition;
        } catch (e) {
          console.warn('Could not start recognition:', e);
        }
      }

      // MediaRecorder
      const options = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? { mimeType: 'audio/webm;codecs=opus' }
        : undefined;

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting audio recording:', err);
      cleanupAudio();
      throw err;
    }
  }, [cleanupAudio]);

  const stopRecording = useCallback((): Promise<{ blob: Blob | null; base64: string | null; text: string }> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        cleanupAudio();
        setIsRecording(false);
        resolve({ blob: null, base64: null, text: transcription });
        return;
      }

      setIsTranscribing(true);

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const cleanBase64 = base64data.includes(',') ? base64data.split(',')[1] : base64data;
          setAudioBase64(cleanBase64);
          cleanupAudio();
          setIsRecording(false);
          setIsTranscribing(false);
          resolve({ blob, base64: cleanBase64, text: transcription });
        };
        reader.onerror = () => {
          cleanupAudio();
          setIsRecording(false);
          setIsTranscribing(false);
          resolve({ blob, base64: null, text: transcription });
        };
      };

      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        cleanupAudio();
        setIsRecording(false);
        setIsTranscribing(false);
        resolve({ blob: null, base64: null, text: transcription });
      }
    });
  }, [cleanupAudio, transcription]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    cleanupAudio();
    setIsRecording(false);
    setAudioBlob(null);
    setAudioBase64(null);
    setTranscription('');
  }, [cleanupAudio]);

  return {
    isRecording,
    audioBlob,
    audioBase64,
    audioLevel,
    transcription,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording
  };
}
