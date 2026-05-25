import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface WaveformVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
}

export default function WaveformVisualizer({ isListening, isSpeaking }: WaveformVisualizerProps) {
  // We render 24 smooth spectral lines representing vocal frequencies
  const [amplitudes, setAmplitudes] = useState<number[]>(new Array(24).fill(6));
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // We only activate actual microphone visualizers when isListening is true
    if (isListening) {
      let active = true;

      const initAudio = async () => {
        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            startSimulation();
            return;
          }

          const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(err => {
            console.warn("Microphone access denied or not supported in this frame context, falling back to simulated visuals.", err);
            startSimulation();
            throw err;
          });

          if (!active) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }

          streamRef.current = stream;

          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const audioContext = new AudioContextClass();
          audioContextRef.current = audioContext;

          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 64; // Gives us 32 frequency domain buckets
          analyser.smoothingTimeConstant = 0.55;
          analyserRef.current = analyser;

          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const updateVolume = () => {
            if (!active) return;
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              
              // Map frequency data to our 24 visual bars
              const newAmplitudes = Array.from({ length: 24 }, (_, i) => {
                // Symmetrical mapping: make center-bars represent vocals, fading to edges
                const distanceFromCenter = Math.abs(i - 11.5);
                const bellFactor = Math.exp(-Math.pow(distanceFromCenter / 8, 2));

                // Grab index in frequency range
                const binIndex = Math.min(
                  Math.floor((i / 24) * dataArray.length),
                  dataArray.length - 1
                );
                const value = dataArray[binIndex];
                
                // Map audio amplitude (0-255) to a gorgeous aesthetic height (6px to ~96px)
                const height = 6 + (value / 255) * 88 * bellFactor;
                
                // Also overlay small highfrequency vibration so the wave looks organic and dynamic
                const highFreqVibration = Math.sin(Date.now() * 0.1 + i * 1.5) * 2;
                
                return Math.max(6, Math.min(100, height + highFreqVibration));
              });

              setAmplitudes(newAmplitudes);
            }
            animationRef.current = requestAnimationFrame(updateVolume);
          };

          updateVolume();
        } catch (err) {
          console.error("Failed to start speech microphone analysis:", err);
          startSimulation();
        }
      };

      const startSimulation = () => {
        let frameCount = 0;
        const simulate = () => {
          if (!active) return;
          frameCount++;

          const newAmplitudes = Array.from({ length: 24 }, (_, i) => {
            const distanceFromCenter = Math.abs(i - 11.5);
            const bellFactor = Math.exp(-Math.pow(distanceFromCenter / 7.5, 2));

            // Dynamic Voice-like simulation (envelope, bursts, sub-frequencies)
            const sineWave = Math.sin(frameCount * 0.16 + i * 0.45);
            const cosineWave = Math.cos(frameCount * 0.28 - i * 0.25);
            const breathingFactor = 0.6 + 0.4 * Math.sin(frameCount * 0.04);

            const waveHeight = 6 + (28 + (sineWave * 18) + (cosineWave * 12)) * bellFactor * breathingFactor;
            return Math.max(6, Math.min(100, waveHeight));
          });

          setAmplitudes(newAmplitudes);
          animationRef.current = requestAnimationFrame(simulate);
        };
        simulate();
      };

      initAudio();

      return () => {
        active = false;
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(() => {});
        }
      };
    } 
    
    // When Speaking (synthesized or simulated streaming outbound)
    if (isSpeaking) {
      let active = true;
      let frameCount = 0;

      const simulateSpeech = () => {
        if (!active) return;
        frameCount++;

        // Vocal burst cadence: Speech has rhythmic bursts of high and low values (syllables)
        const speechEnvelope = 0.5 + 0.5 * Math.sin(frameCount * 0.075) * Math.sin(frameCount * 0.024);
        const isActiveBurst = speechEnvelope > 0.08;

        const newAmplitudes = Array.from({ length: 24 }, (_, i) => {
          const distanceFromCenter = Math.abs(i - 11.5);
          const bellFactor = Math.exp(-Math.pow(distanceFromCenter / 7.0, 2));

          const wave1 = Math.sin(frameCount * 0.24 + i * 0.35);
          const wave2 = Math.sin(frameCount * 0.14 - i * 0.18);
          const detailWave = Math.sin(frameCount * 0.6 + i * 0.9) * 3;
          
          let height = 6;
          if (isActiveBurst) {
            height = 6 + (22 + (wave1 * 28) + (wave2 * 14)) * bellFactor * speechEnvelope + detailWave;
          } else {
            // Soft breathing voice gap
            height = 6 + Math.sin(frameCount * 0.06 + i * 0.7) * 3 * bellFactor;
          }

          return Math.max(6, Math.min(100, height));
        });

        setAmplitudes(newAmplitudes);
        animationRef.current = requestAnimationFrame(simulateSpeech);
      };

      simulateSpeech();

      return () => {
        active = false;
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }

    // Default: Beautiful, calm horizontal ambient idle pulse (breathing)
    let active = true;
    let frameCount = 0;
    const simulateIdle = () => {
      if (!active) return;
      frameCount++;

      const newAmplitudes = Array.from({ length: 24 }, (_, i) => {
        const distanceFromCenter = Math.abs(i - 11.5);
        const bellFactor = Math.exp(-Math.pow(distanceFromCenter / 9, 2));
        
        // Gentle undulating wave across the bars
        const idleWave = Math.sin(frameCount * 0.035 + i * 0.28) * 3 + 7;
        return Math.max(6, idleWave * bellFactor + 4);
      });

      setAmplitudes(newAmplitudes);
      animationRef.current = requestAnimationFrame(simulateIdle);
    };

    simulateIdle();

    return () => {
      active = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isListening, isSpeaking]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-4 w-full">
      {/* Waveform wrapper container */}
      <div className="flex items-center justify-center space-x-[4px] h-[110px] px-8 relative w-full max-w-sm">
        {/* Glow backdrop behind the spectral bands */}
        <div className={`absolute inset-x-8 inset-y-2 filter blur-2xl transition-all duration-1000 opacity-20 rounded-full ${
          isSpeaking ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500' :
          isListening ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-cyan-400' :
          'bg-white/5'
        }`} />

        {/* Dynamic Waveform Bars */}
        {amplitudes.map((height, i) => {
          let barBg = 'bg-white/20';
          if (isSpeaking) {
            barBg = 'bg-gradient-to-t from-emerald-600/80 via-teal-400 to-emerald-200';
          } else if (isListening) {
            barBg = 'bg-gradient-to-t from-indigo-600/80 via-blue-400 to-cyan-300';
          } else {
            barBg = 'bg-gradient-to-t from-white/5 via-white/15 to-white/25';
          }

          return (
            <div
              key={i}
              className={`w-[5px] rounded-full ${barBg} transition-colors duration-500`}
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>

      {/* Modern status and pulse rate labels for a deluxe finish */}
      <div className="flex items-center space-x-1.5 font-mono text-[9px] tracking-widest text-s-gray-500 select-none">
        <span className={`w-1 h-1 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-ping' : isListening ? 'bg-blue-400 animate-ping' : 'bg-s-gray-600'}`} />
        <span className="uppercase">
          {isSpeaking ? 'AI SPEKTRAL OUT • ACTIVE' : isListening ? 'USER VOICE IN • STREAMING' : 'AUDIO DEACTIVATED • STANDBY'}
        </span>
      </div>
    </div>
  );
}
